import { VectorStore } from '@/services/vector-store';
import { Request, Response } from 'express';
import { Readable } from 'stream';

export interface Controller {
  askQuestion(req: Request, res: Response): Promise<void>;
}

export default () => {
  const vectorStore = new VectorStore();
  return {
    askQuestion: async (req: Request, res: Response) => {
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
