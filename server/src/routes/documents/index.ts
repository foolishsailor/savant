import routes from './routes';
import { Chroma } from 'langchain/vectorstores/chroma';
import controller from './controller';
import { Router } from 'express';

export interface DocumentRoutes {
  router: Router;
  vectorStore: any;
  store: Chroma;
}

export default ({ router, vectorStore, store }: DocumentRoutes): Router =>
  routes(router, controller(vectorStore, store));
