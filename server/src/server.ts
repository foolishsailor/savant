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

  console.log('store', store);
  console.log('collections', collections);

  const app = express();
  const port = process.env.PORT || 4000;
  const upload = multer();

  const savedDocuments: Express.Multer.File[] = [];
  app.use(bodyParser.json());
  app.use(cors());
  app.use(cors());

  app.get('/test', (_req, res) => {
    res.send('Hello World!');
  });

  app.post('/addDocuments', upload.array('documents'), (req, res) => {
    const documents = req.files as Express.Multer.File[];

    savedDocuments.push(...documents);

    const uploadedDocuments = documentLoader(documents);

    res.json(savedDocuments.map((file) => file.originalname));
  });

  app.post('/askQuestion', async (req, res) => {
    console.log('ask question');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    const { question, systemPrompt } = req.body;
    const stream = new Readable({
      read() {}
    });

    stream.pipe(res);

    vectorStore.setCallback((token: string) => {
      stream.push(token);
    });

    await vectorStore.askQuestion(question, store, systemPrompt);
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

  // Dummy functions for demonstration purposes
  // Replace these with your actual implementation
  function documentLoader(files: Express.Multer.File[]): string[] {
    files.forEach(async (file: Express.Multer.File) => {
      await vectorStore.addDocuments(file, store);
    });

    // Extract file names from the array of files
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
