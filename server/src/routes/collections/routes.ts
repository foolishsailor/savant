import { Router } from 'express';
import { Controller } from './controller';

export default (router: Router, controller: Controller) => {
  return router
    .get('/collections', controller.getCollection)
    .post('/collections', controller.createCollection)
    .delete('/collections/:name', controller.deleteCollection)
    .post('/collections/question', controller.question);
};
