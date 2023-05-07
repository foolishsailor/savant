import { Router } from 'express';
import { Controller } from './controller';
import multer from 'multer';

export default (router: Router, controller: Controller) => {
  const upload = multer();

  return router
    .get('/documents', controller.getDocuments)
    .post('/documents', upload.array('documents'), controller.addDocuments)
    .post('/documents/delete', controller.deleteDocuments)
    .delete('/documents', controller.clearDocuments);
};
