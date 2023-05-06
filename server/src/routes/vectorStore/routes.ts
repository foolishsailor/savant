import { Router } from 'express';
import { Controller } from './controller';

export default (router: Router, controller: Controller) => {
  return router.post('/vectorstore/askQuestion', controller.askQuestion);
};
