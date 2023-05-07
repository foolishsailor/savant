import { OpenAI } from 'langchain/llms/openai';
import { RetrievalQAChain, loadQARefineChain } from 'langchain/chains';
import { Chroma } from 'langchain/vectorstores/chroma';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { StreamingCallbackHandler } from '@/langchain/callbacks/streaming-callback-handler';
import { loader } from '../loaders';
import { PromptTemplate } from 'langchain/prompts';
import { ChromaClient, Collection } from 'chromadb';
import { processDocumentsIntoObjects } from '@/utils/parse';
import { Document } from 'langchain/dist/document';

export interface DocumentsObjectInterface {
  metadata?: Record<string, unknown>;
  embedding?: Record<string, unknown>;
  document: string;
  id: string;
}

export interface DocumentsInterface {
  ids: string[];
  embeddings?: any[];
  documents: string[];
  metadatas?: any[];
}

export class VectorStore {
  private static store: Chroma | null;

  client: ChromaClient;
  model: OpenAI;
  chatHistory: string[];

  constructor() {
    this.client = new ChromaClient();
    this.model = new OpenAI(
      {
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: process.env.DEFAULT_OPENAI_MODEL,
        streaming: true,
        verbose: true,
        temperature: 0.5
      },
      { organization: process.env.OPENAI_ORG_ID }
    );

    this.chatHistory = [];
  }

  async setCreateChromaStore(name: string) {
    VectorStore.store = new Chroma(
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      {
        collectionName: name
      }
    );
  }

  async listCollections() {
    const collections = await this.client.listCollections();
    return collections;
  }

  async deleteCollection(name: string) {
    const result = await this.client.deleteCollection(name);
    return result;
  }

  async getCollection(name: string) {
    return await this.client.getCollection(name);
  }

  async getDocuments(
    collection: Collection,
    query?: object
  ): Promise<Record<string, DocumentsObjectInterface[]>> {
    const documents = await collection.get(undefined, query);

    return documents.error ? {} : processDocumentsIntoObjects(documents);
  }

  async addDocuments(file: Express.Multer.File) {
    const docs = await loader(file);

    if (VectorStore.store) await VectorStore.store.addDocuments(docs);

    return docs;
  }

  async deleteDocuments(collectionName: string, filename: string) {
    const collection = await this.client.getCollection(collectionName);

    await collection.delete(undefined, { filename });

    const documents = await collection.get();

    return documents.error ? {} : processDocumentsIntoObjects(documents);
  }

  clearChatHistory() {
    this.chatHistory.length = 0;
  }

  async askQuestion(
    question: string,
    systemPrompt: string,
    queryType: 'simple' | 'refine',
    temperature: number,
    callback: (token: string) => void
  ) {
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
      chat_history: [this.chatHistory]
    });

    if (VectorStore.store && queryType === 'refine') {
      const chain = new RetrievalQAChain({
        combineDocumentsChain: loadQARefineChain(this.model),
        retriever: VectorStore.store.asRetriever()
      });

      const res = await chain.call(
        {
          chainType: 'stuff',
          query: prompt,
          temperature
        },
        [new StreamingCallbackHandler()]
      );

      this.chatHistory.push(res.output_text);
    } else {
      if (VectorStore.store) {
        const chain = RetrievalQAChain.fromLLM(
          this.model,
          VectorStore.store.asRetriever()
        );

        const res = await chain.call(
          {
            chainType: 'stuff',
            query: prompt,
            temperature
          },
          [new StreamingCallbackHandler()]
        );

        this.chatHistory.push(res.text);
      }
    }
  }
}
