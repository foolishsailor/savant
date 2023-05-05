import { VectorStore } from '../../services.ts/vector-db';
import { Chroma } from 'langchain/vectorstores/chroma';
import { Request, Response } from 'express';

export interface Controller {
  addDocuments(req: Request, res: Response): Promise<void>;
  deleteDocuments(req: Request, res: Response): Promise<void>;
  clearDocuments(req: Request, res: Response): Promise<void>;
}

export default (vectorStore: any, store: Chroma) => {
  const savedDocuments: Express.Multer.File[] = [];

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

  return {
    addDocuments: async (req: Request, res: Response) => {
      const documents = req.files as Express.Multer.File[];

      savedDocuments.push(...documents);

      documentLoader(documents);

      res.json(savedDocuments.map((file) => file.originalname));
    },
    // deleteDocument endpoint
    deleteDocuments: async (req: Request, res: Response) => {
      const index = parseInt(req.params.index);

      const updatedDocuments = deleteDocument(index);
      res.json(updatedDocuments);
    },

    clearDocuments: async (req: Request, res: Response) => {
      const clearedDocuments = clearDocuments();
      res.json(clearedDocuments);
    }
  };
};
