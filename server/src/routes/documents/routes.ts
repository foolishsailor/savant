import { Router } from 'express';
import { Controller } from './controller';
import multer from 'multer';

export default (router: Router, controller: Controller) => {
  const upload = multer();

  return router
    .post('/documents', upload.array('documents'), controller.addDocuments)
    .delete('/documents/:index', controller.deleteDocuments)
    .delete('/documents', controller.clearDocuments);
};
