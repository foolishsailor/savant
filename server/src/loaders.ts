import {
  JSONLoader,
  JSONLinesLoader
} from 'langchain/document_loaders/fs/json';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

interface DocumentLoaders {
  [key: string]: (file: Blob) => Promise<any>;
}

const getFileExtension = (filename: string): string => {
  return filename
    .slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
    .toLowerCase();
};

const getBlobFromFile = (file: Express.Multer.File): Blob => {
  const { buffer } = file;
  const type = file.mimetype;
  const blob = new Blob([buffer], { type });
  return blob;
};

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 0
});

const loaders: DocumentLoaders = {
  json: async (file: Blob) => new JSONLoader(file, '/texts'),
  jsonl: async (file: Blob) => new JSONLinesLoader(file, '/html'),
  txt: async (file: Blob) => new TextLoader(file),
  tsx: async (file: Blob) => new TextLoader(file),
  ts: async (file: Blob) => new TextLoader(file),
  css: async (file: Blob) => new TextLoader(file),
  csv: async (file: Blob) => new CSVLoader(file),
  docx: async (file: Blob) => new DocxLoader(file),
  pdf: async (file: Blob) => new PDFLoader(file)
};

export const loader = async (file: Express.Multer.File) => {
  const blob = getBlobFromFile(file);

  const extension = getFileExtension(file.originalname);
  const loadFn = loaders[extension];

  if (!loadFn) {
    throw new Error(`Unsupported file extension: ${extension}`);
  }

  const fileLoader = await loadFn(blob);
  return fileLoader.loadAndSplit(textSplitter);
};
