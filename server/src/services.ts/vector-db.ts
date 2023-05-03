import { OpenAI } from 'langchain/llms/openai';
import { RetrievalQAChain, loadQARefineChain } from 'langchain/chains';
import { Chroma } from 'langchain/vectorstores/chroma';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { StreamingCallbackHandler } from '@/langchain/callbacks/streaming-callback-handler';
import { loader } from '../loaders';
import { PromptTemplate } from 'langchain/prompts';

export const VectorStore = async () => {
  const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: process.env.DEFAULT_OPENAI_MODEL,
    streaming: true,
    verbose: true,
    temperature: 0.5
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

      await store.addDocuments(docs);

      console.log('await docs added');
    },
    clearChatHistory: () => {
      chatHistory.length = 0;
    },
    askQuestion: async (
      question: string,
      store: Chroma,
      systemPrompt: string,
      callback: (token: string) => void
    ) => {
      StreamingCallbackHandler.setStreamCallback(callback);

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

      //Produces multiple answers - need a trigger to replace text as its refining....
      const chain = new RetrievalQAChain({
        combineDocumentsChain: loadQARefineChain(model),
        retriever: store.asRetriever()
      });

      //Produices simple answer
      //const chain = RetrievalQAChain.fromLLM(model, store.asRetriever());

      const res = await chain.call(
        {
          chainType: 'stuff',
          query: prompt
        },
        [new StreamingCallbackHandler()]
      );

      console.log('total output=======', res);
      chatHistory.push(res.output_text);
    }
  };
};
