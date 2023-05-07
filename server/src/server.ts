import express from 'express';
const router = express.Router();
import bodyParser from 'body-parser';
import cors from 'cors';
import { ChromaClient } from 'chromadb';
import * as dotenv from 'dotenv';

import documentRoutes from './routes/documents';
import vectorStoreRoutes from './routes/vectorStore';
import collectionRoutes from './routes/collections';

dotenv.config();

(async () => {
  // const client = new ChromaClient();
  // await client.reset();
  const app = express();
  const port = process.env.PORT || 4000;

  app
    .use(bodyParser.json())
    .use(cors())
    .use(documentRoutes({ router }))
    .use(vectorStoreRoutes({ router }))
    .use(collectionRoutes({ router }))

    .listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
})();
