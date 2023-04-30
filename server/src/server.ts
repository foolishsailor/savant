import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

//https://medium.com/geekculture/automating-pdf-interaction-with-langchain-and-chatgpt-e723337f26a6

const app = express();
const port = process.env.PORT || 4000;

const savedDocuments: File[] = [];
app.use(bodyParser.json());
app.use(cors());
app.use(cors());

app.get('/test', (_req, res) => {
  res.send('Hello World!');
});

// addDocuments endpoint
app.post('/addDocuments', (req, res) => {
  const { documents } = req.body;

  savedDocuments.push(...documents);

  const uploadedDocuments = documentLoader(documents);
  res.json(uploadedDocuments);
});

// askQuestion endpoint
app.post('/askQuestion', (req, res) => {
  const { question } = req.body;
  // Call the queryDocuments function with the provided question
  // and send the resulting markup string as the response
  const markup = queryDocuments(question);
  res.json({ response: markup });
});

// deleteDocument endpoint
app.delete('/deleteDocument/:index', (req, res) => {
  const index = parseInt(req.params.index);
  // Call the deleteDocument function with the provided index
  // and send the updated documents array as the response
  const updatedDocuments = deleteDocument(index);
  res.json(updatedDocuments);
});

// clearDocuments endpoint
app.delete('/clearDocuments', (_req, res) => {
  // Call the clearDocuments function and send the updated
  // (empty) documents array as the response
  const clearedDocuments = clearDocuments();
  res.json(clearedDocuments);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Dummy functions for demonstration purposes
// Replace these with your actual implementation
function documentLoader(files: File[]): string[] {
  // Extract file names from the array of files
  const fileNames = files.map((file) => file.name);

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
