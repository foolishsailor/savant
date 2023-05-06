import express from 'express';
const router = express.Router();
import bodyParser from 'body-parser';
import cors from 'cors';

import * as dotenv from 'dotenv';
import { VectorStore } from './services.ts/vector-db';

import documentRoutes from './routes/documents';
import vectorStoreRoutes from './routes/vectorStore';
import collectionRoutes from './routes/collections';

dotenv.config();

(async () => {
  const vectorStore = await VectorStore();
  const store = await vectorStore.createCollection('test_document_store');
  console.log(
    'collections',
    await vectorStore.getCollection('test_document_store')
  );

  const app = express();
  const port = process.env.PORT || 4000;

  app
    .use(bodyParser.json())
    .use(cors())
    .use(documentRoutes({ router, vectorStore, store }))
    .use(vectorStoreRoutes({ router, vectorStore, store }))
    .use(collectionRoutes({ router, vectorStore, store }))

    .listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
})();
