import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import * as dotenv from 'dotenv';

dotenv.config();

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

app.post('/askQuestion', (req, res) => {
  const { question } = req.body;

  const markup = queryDocuments(question);
  res.json({ response: markup });
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
  // Extract file names from the array of files
  const fileNames = files.map((file) => file.originalname);

  return fileNames;
}

function queryDocuments(question: string): string {
  // Query the documents with the given question
  // ...
  return 'Example markup response';
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
