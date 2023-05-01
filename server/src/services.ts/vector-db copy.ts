import { OpenAI } from 'langchain/llms';
import { ChatVectorDBQAChain } from 'langchain/chains';
import { Chroma } from 'langchain/vectorstores';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';

import * as fs from 'fs';

//Help from here
//https://github.com/menloparklab/langchain-cohere-qdrant-doc-retrieval/blob/main/app.py
//https://github.com/hwchase17/langchainjs/blob/main/examples/src/chains/chat_vector_db_chroma.ts
//https://docs.trychroma.com/integrations

/** TODO:
 * 1. Create function to create and name a vectorstore
 * 2. Create function to add documents to vectorstore
 * 3. Function must parse by file type and choose correct loader
 * 4. Create function to ask questions

*/

const openAIApiKey = process.env.OPENAI_API_KEY;

export const VectorStore = async (file: File) => {
  const model = new OpenAI({ openAIApiKey });

  /* Create the vectorstore */
  const vectorStore = new Chroma(new OpenAIEmbeddings({ openAIApiKey }), {
    collectionName: 'state_of_the_union'
  });

  //Text
  /* Load in the file we want to do question answering over */
  //const text = fs.readFileSync(file);
  /* Split the text into chunks */
  // const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  // const docs = await textSplitter.createDocuments([text]);

  // PDF
  const pdfLoader = new PDFLoader(file);
  const docs = await pdfLoader.loadAndSplit();

  vectorStore.addDocuments(docs);

  /* Create the chain */
  const chain = ChatVectorDBQAChain.fromLLM(model, vectorStore);
  /* Ask it a question */
  const question = 'What did the president say about Justice Breyer?';
  const res = await chain.call({ question, chat_history: [] });

  //const chromaRes = await chromaStore.similaritySearch(input, memoryCount);??
  console.log(res);
};
