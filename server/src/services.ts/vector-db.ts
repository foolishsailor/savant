import { OpenAI } from 'langchain/llms/openai';
import { RetrievalQAChain, loadQARefineChain } from 'langchain/chains';
import { Chroma } from 'langchain/vectorstores/chroma';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { BaseCallbackHandler } from 'langchain/callbacks';
import { loader } from '../loaders';
import { PromptTemplate } from 'langchain/prompts';
import {
  AgentAction,
  AgentFinish,
  ChainValues,
  LLMResult
} from 'langchain/schema';

//Help from here
//https://github.com/menloparklab/langchain-cohere-qdrant-doc-retrieval/blob/main/app.py
//https://github.com/hwchase17/langchainjs/blob/main/examples/src/chains/chat_vector_db_chroma.ts
//https://docs.trychroma.com/integrations

let customCallback: ((token: string) => void) | null = null;

class MyCallbackHandler extends BaseCallbackHandler {
  name = 'MyCallbackHandler';

  async handleChainStart(chain: { name: string }) {
    console.log(`===== Entering new ${chain.name} chain...`);
  }

  async handleChainEnd(_output: ChainValues) {
    console.log('===== Finished chain.', _output);
  }

  async handleAgentAction(action: AgentAction) {
    console.log('===== action', action.log);
  }

  async handleToolEnd(output: string) {
    console.log('===== Tool End', output);
  }

  async handleText(text: string) {
    console.log('handleText', text);
  }

  async handleAgentEnd(action: AgentFinish) {
    console.log('Agent action end', action.log);
  }

  async handleLLMEnd(output: LLMResult) {
    console.log('LLM end', JSON.stringify(output));
  }

  async handleLLMNewToken(token: string) {
    console.log('token', token);
    customCallback && customCallback(token);
  }
}

export const VectorStore = async () => {
  console.log('openAIApiKey', process.env.OPENAI_API_KEY);
  console.log(
    'process.env.DEFAULT_OPENAI_MODEL',
    process.env.DEFAULT_OPENAI_MODEL
  );

  const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: process.env.DEFAULT_OPENAI_MODEL,
    streaming: true,
    verbose: false
    //callbacks: [new MyCallbackHandler()]
  });
  const chatHistory: string[] = [];

  return {
    setCallback: (callback: (token: string) => void) => {
      customCallback = callback;
    },
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

      // //Produces multiple answers - need a trigger to replace text as its refining....
      // const chain = new RetrievalQAChain({
      //   combineDocumentsChain: loadQARefineChain(model),

      //   retriever: store.asRetriever()
      // });

      //Produices simple answer
      const chain = RetrievalQAChain.fromLLM(model, store.asRetriever());

      const res = await chain.call(
        {
          chainType: 'stuff',
          query: prompt
        },
        [new MyCallbackHandler()]
      );
      console.log('total output=======', res);
      chatHistory.push(res.output_text);
    }
  };
};
