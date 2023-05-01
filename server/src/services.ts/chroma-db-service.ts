import chalk from 'chalk';
import * as dotenv from 'dotenv';
import * as console from 'console';
import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb';

import { VectorDB } from './vector-db';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.log(chalk.red('OPENAI_API_KEY Key Not Found in the .env file'));
  process.exit(1);
}

const client = new ChromaClient();
const embedding = new OpenAIEmbeddingFunction(process.env.OPENAI_API_KEY);
const chromaDB = VectorDB.getInstance(client, embedding);

export { chromaDB, client };
