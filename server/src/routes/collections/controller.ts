import { VectorStore } from '@/services/vector-store';
import { Request, Response } from 'express';
import { Readable } from 'stream';

export interface Controller {
  getCollection(req: Request, res: Response): Promise<void>;
  createCollection(req: Request, res: Response): Promise<void>;
  deleteCollection(req: Request, res: Response): Promise<void>;
  question(req: Request, res: Response): Promise<void>;
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
    },

    question: async (req: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Transfer-Encoding', 'chunked');

      const { question, systemPrompt, queryType, temperature } = req.body;
      const stream = new Readable({
        read() {}
      });

      stream.pipe(res);

      const streamCallback = (token: string) => {
        stream.push(token);
      };

      await vectorStore.askQuestion(
        question,
        systemPrompt,
        queryType,
        temperature,
        streamCallback
      );
      res.end();
    }
  };
};
