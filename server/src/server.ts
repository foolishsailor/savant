import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import * as dotenv from 'dotenv';
import { VectorStore } from './services.ts/vector-db';
import { ChromaClient } from 'chromadb';
import { Readable } from 'stream';

dotenv.config();

(async () => {
  const client = new ChromaClient();
  await client.reset();

  const vectorStore = await VectorStore();

  const store = await vectorStore.createCollection('test_document_store');
  const collections = await vectorStore.listCollections(store);

  const app = express();
  const port = process.env.PORT || 4000;
  const upload = multer();

  const savedDocuments: Express.Multer.File[] = [];
  app.use(bodyParser.json());
  app.use(cors());
  app.use(cors());

  app.post('/addDocuments', upload.array('documents'), (req, res) => {
    const documents = req.files as Express.Multer.File[];

    savedDocuments.push(...documents);

    documentLoader(documents);

    res.json(savedDocuments.map((file) => file.originalname));
  });

  app.post('/askQuestion', async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const { question, systemPrompt, queryType, temperature } = req.body;
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
      queryType,
      temperature,
      streamCallback
    );
    res.end();
  });

  // deleteDocument endpoint
  app.delete('/deleteDocument/:index', (req, res) => {
    const index = parseInt(req.params.index);

    const updatedDocuments = deleteDocument(index);
    res.json(updatedDocuments);
  });

  app.delete('/clearDocuments', (_req, res) => {
    const clearedDocuments = clearDocuments();
    res.json(clearedDocuments);
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  function documentLoader(files: Express.Multer.File[]): string[] {
    files.forEach(async (file: Express.Multer.File) => {
      await vectorStore.addDocuments(file, store);
    });

    const fileNames = files.map((file) => file.originalname);

    return fileNames;
  }

  function deleteDocument(index: number): any[] {
    // Delete the document at the given index
    // ...
    return [];
  }

  function clearDocuments(): any[] {
    // Clear all documents
    // ...
    return [];
  }
})();
