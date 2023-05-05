import documents, { DocumentRoutes } from './documents';

export default ({ router, vectorStore, store }: DocumentRoutes) =>
  documents({ router, vectorStore, store });
