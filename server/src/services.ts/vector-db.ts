import { OpenAI } from 'langchain/llms';
import { ChatVectorDBQAChain } from 'langchain/chains';
import { Chroma } from 'langchain/vectorstores';
import { OpenAIEmbeddings } from 'langchain/embeddings';

import { loader } from '../loaders';

//Help from here
//https://github.com/menloparklab/langchain-cohere-qdrant-doc-retrieval/blob/main/app.py
//https://github.com/hwchase17/langchainjs/blob/main/examples/src/chains/chat_vector_db_chroma.ts
//https://docs.trychroma.com/integrations

const openAIApiKey = process.env.OPENAI_API_KEY;

export const VectorStore = async () => {
  const model = new OpenAI({ openAIApiKey });
  const chatHistory: string[] = [];

  return {
    listCollections: async (store: Chroma) => {
      const collections = await store.index?.listCollections();
      return collections;
    },
    createCollection: async (name: string) => {
      const vectorStore = new Chroma(new OpenAIEmbeddings({ openAIApiKey }), {
        collectionName: name
      });

      return vectorStore;
    },
    addDocuments: async (file: File, store: Chroma) => {
      const docs = await loader(file);
      store.addDocuments(docs);
    },
    clearChatHistory: () => {
      chatHistory.length = 0;
    },
    askQuestion: async (question: string, store: Chroma) => {
      const chain = ChatVectorDBQAChain.fromLLM(model, store);
      const res = await chain.call({ question, chat_history: chatHistory });

      chatHistory.push(res.text);

      return res;
    }
  };
};
