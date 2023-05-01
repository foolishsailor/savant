import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import {
  JSONLoader,
  JSONLinesLoader
} from 'langchain/document_loaders/fs/json';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';

const loader = new DirectoryLoader(
  'src/document_loaders/example_data/example',
  {
    '.json': (path) => new JSONLoader(path, '/texts'),
    '.jsonl': (path) => new JSONLinesLoader(path, '/html'),
    '.txt': (path) => new TextLoader(path),
    '.csv': (path) => new CSVLoader(path),
    '.docx': (path) => new DocxLoader(path),
    '.pdf': (path) => new PDFLoader(path)
  }
);
const docs = await loader.load();
console.log({ docs });
