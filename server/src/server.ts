import express from 'express';
const router = express.Router();
import bodyParser from 'body-parser';
import cors from 'cors';

import * as dotenv from 'dotenv';
import { VectorStore } from './services.ts/vector-db';
import { ChromaClient } from 'chromadb';
import { Readable } from 'stream';

import documentRoutes from './routes/documents';

dotenv.config();

(async () => {
  const client = new ChromaClient();
  //await client.reset();

  const vectorStore = await VectorStore();
  const store = await vectorStore.createCollection('test_document_store');
  const collections = await vectorStore.listCollections(store);

  const app = express();
  const port = process.env.PORT || 4000;

  app
    .use(bodyParser.json())
    .use(cors())
    .use(documentRoutes({ router, vectorStore, store }));

  app.post('/askQuestion', async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const { question, systemPrompt } = req.body;
    const stream = new Readable({
      read() {}
    });

    stream.pipe(res);

    const streamCallback = (token: string) => {
      stream.push(token);
    };

    await vectorStore.askQuestion(
      question,
      store,
      systemPrompt,
      streamCallback
    );
    res.end();
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
})();
