import {
  JSONLoader,
  JSONLinesLoader
} from 'langchain/document_loaders/fs/json';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const getFileExtension = (filename: string): string => {
  return filename
    .slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
    .toLowerCase();
};

const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });

const loaders = {
  '.json': async (file: File) => new JSONLoader(file, '/texts'),
  '.jsonl': async (file: File) => new JSONLinesLoader(file, '/html'),
  '.txt': async (file: File) => new TextLoader(file),
  '.csv': async (file: File) => new CSVLoader(file),
  '.docx': async (file: File) => new DocxLoader(file),
  '.pdf': async (file: File) => new PDFLoader(file)
};

export const loader = (file: File) => {
  const extension = getFileExtension(file.name);
  const loader = loaders[extension](file);

  if (!loader) {
    throw new Error(`Unsupported file extension: ${extension}`);
  }
  return loader.loadAndSplit(textSplitter);
};
