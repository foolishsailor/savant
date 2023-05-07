import { VectorStore } from '@/services/vector-store';
import { Request, Response } from 'express';

export interface Controller {
  getDocuments(req: Request, res: Response): Promise<void>;
  addDocuments(req: Request, res: Response): Promise<void>;
  deleteDocuments(req: Request, res: Response): Promise<void>;
  clearDocuments(req: Request, res: Response): Promise<void>;
}

export default () => {
  const vectorStore = new VectorStore();

  return {
    getDocuments: async (req: Request, res: Response) => {
      const { collectionName } = req.query;

      const collection = await vectorStore.getCollection(
        collectionName as string
      );

      const documents = await vectorStore.getDocuments(collection);

      res.json(documents);
    },

    addDocuments: async (req: Request, res: Response) => {
      const files = req.files as Express.Multer.File[];

      const collectionName = req.body.collectionName as string;

      const promises = files.map((file: Express.Multer.File) =>
        vectorStore.addDocuments(file)
      );

      await Promise.all(promises).then((results) =>
        results.reduce((acc, cur) => [...acc, ...cur], [])
      );

      const collection = await vectorStore.getCollection(collectionName);
      const documents = await vectorStore.getDocuments(collection);

      res.json(documents);
    },

    deleteDocuments: async (req: Request, res: Response) => {
      const { collectionName, fileName } = req.body;

      console.log('=======================', collectionName, fileName);

      const updatedDocuments = await vectorStore.deleteDocuments(
        collectionName,
        fileName
      );
      res.json(updatedDocuments);
    },

    clearDocuments: async (req: Request, res: Response) => {
      res.json();
    }
  };
};
