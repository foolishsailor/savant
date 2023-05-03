import { OpenAI } from 'langchain/llms/openai';
import {
  ChatVectorDBQAChain,
  RetrievalQAChain,
  loadQARefineChain
} from 'langchain/chains';
import { Chroma } from 'langchain/vectorstores/chroma';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

import { loader } from '../loaders';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate
} from 'langchain/prompts';

//Help from here
//https://github.com/menloparklab/langchain-cohere-qdrant-doc-retrieval/blob/main/app.py
//https://github.com/hwchase17/langchainjs/blob/main/examples/src/chains/chat_vector_db_chroma.ts
//https://docs.trychroma.com/integrations

export const VectorStore = async () => {
  console.log('openAIApiKey', process.env.OPENAI_API_KEY);
  console.log(
    'process.env.DEFAULT_OPENAI_MODEL',
    process.env.DEFAULT_OPENAI_MODEL
  );
  const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: process.env.DEFAULT_OPENAI_MODEL,
    streaming: true
  });
  const chatHistory: string[] = [];

  return {
    listCollections: async (store: Chroma) => {
      const collections = await store.index?.listCollections();
      return collections;
    },
    createCollection: async (name: string) => {
      const vectorStore = new Chroma(
        new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
        {
          collectionName: name
        }
      );

      console.log('collection creates', name);
      return vectorStore;
    },
    addDocuments: async (file: Express.Multer.File, store: Chroma) => {
      console.log('addDocuments');

      const docs = await loader(file);

      console.log('docs ========', docs);
      await store.addDocuments(docs);

      console.log('await docs added');
    },
    clearChatHistory: () => {
      chatHistory.length = 0;
    },
    askQuestion: async (
      question: string,
      store: Chroma,
      systemPrompt: string
    ) => {
      const chatPrompt = PromptTemplate.fromTemplate(
        ` ${systemPrompt}
        You are an AI assistant. You will be asked questions about the given documents, you can only use the given documents for information.  You can use your
        memory to help with context or analysis of the documents and to understand the information and question, but you cant make things up. 
        Provide answers in a conversational manner.
        Dont answer with anything like "Based on the provided context" or "Based on Additional Context"

        Answer like a human would.
        If you don't know the answer, don't try to make up an answer 
        Follow the user's instructions carefully. 
        ALWAYS respond using markdown.
       
        Chat History for context:
        {chat_history}

        The Question to be answered: {question}`
      );

      const prompt = await chatPrompt.format({
        question,
        chat_history: [chatHistory]
      });

      console.log('prompt', prompt);
      const chain = new RetrievalQAChain({
        combineDocumentsChain: loadQARefineChain(model),
        retriever: store.asRetriever()
      });

      const res = await chain.call({
        chainType: 'stuff',
        query: prompt
      });

      chatHistory.push(res.output_text);

      console.log('res--- ', res);
      console.log('chatHistory--- ', chatHistory);

      return res.output_text;

      // const chain = ChatVectorDBQAChain.fromLLM(model, store, {
      //   qaTemplate: prompt
      // });
      // const res = await chain.call({
      //   question,
      //   chat_history: [chatHistory]
      // });

      // chatHistory.push(res.text);

      // console.log('res--- ', res);
      // console.log('chatHistory--- ', chatHistory);

      // return res.text;
    }
  };
};
