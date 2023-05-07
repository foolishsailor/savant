import { VectorStore } from '@/services/vector-store';
import { Request, Response } from 'express';

export interface Controller {
  getCollection(req: Request, res: Response): Promise<void>;
  createCollection(req: Request, res: Response): Promise<void>;
  deleteCollection(req: Request, res: Response): Promise<void>;
}

export default () => {
  const vectorStore = new VectorStore();
  return {
    getCollection: async (req: Request, res: Response) => {
      const { collectionName } = req.query;
      let collections;

      if (collectionName) {
        await vectorStore.setCreateChromaStore(collectionName as string);
        const collection = await vectorStore.getCollection(
          collectionName as string
        );
        collections = collection ? [collection] : [];
      } else {
        collections = await vectorStore.listCollections();
      }

      res.json(collections);
    },

    createCollection: async (req: Request, res: Response) => {},

    deleteCollection: async (req: Request, res: Response) => {
      const { name } = req.params;

      const collection = await vectorStore.getCollection(name);
      if (collection) {
        await vectorStore.deleteCollection(name);
      }

      const collections = await vectorStore.listCollections();
      res.json(collections);
    }
  };
};
