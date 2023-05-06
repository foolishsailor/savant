import { Chroma } from 'langchain/vectorstores/chroma';
import { Request, Response } from 'express';

export interface Controller {
  getCollection(req: Request, res: Response): Promise<void>;
  createCollection(req: Request, res: Response): Promise<void>;
  deleteCollection(req: Request, res: Response): Promise<void>;
}

export default (vectorStore: any, store: Chroma) => {
  return {
    getCollection: async (req: Request, res: Response) => {
      const collectionName = req.query.name;
      let collections;

      if (collectionName) {
        const collection = await vectorStore.getCollection(
          store,
          collectionName
        );
        collections = collection ? [collection] : [];
      } else {
        collections = await vectorStore.listCollections(store);
      }

      res.json(collections);
    },

    createCollection: async (req: Request, res: Response) => {},

    deleteCollection: async (req: Request, res: Response) => {}
  };
};
