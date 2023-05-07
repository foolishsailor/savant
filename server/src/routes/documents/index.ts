import routes from './routes';
import controller from './controller';
import { Router } from 'express';

export interface DocumentRoutes {
  router: Router;
}

export default ({ router }: DocumentRoutes): Router =>
  routes(router, controller());
