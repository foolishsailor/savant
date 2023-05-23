// import {
//   DocumentsInterface,
//   DocumentsObjectInterface
// } from '@/services/vector-store';

// export const processDocumentsIntoObjects = (
//   documents: DocumentsInterface
// ): DocumentsObjectInterface[] => {
//   return documents.documents
//     .map((document, i) => {
//       return {
//         metadata: documents.metadatas ? documents.metadatas[i] : {},
//         embedding: documents.embeddings ? documents.embeddings[i] : {},
//         document,
//         id: documents.ids[i]
//       };
//     })
//     .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
// };

import {
  DocumentsInterface,
  DocumentsObjectInterface
} from '@/services/vector-store';
import { GetResponse } from 'chromadb/dist/main/types';

export const processDocumentsIntoObjects = (
  documents: GetResponse
): Record<string, DocumentsObjectInterface[]> => {
  const objects: Record<string, DocumentsObjectInterface[]> = {};

  documents.documents.forEach((document, i) => {
    const metadata = documents.metadatas[i] || undefined;
    const embedding = documents.embeddings ? documents.embeddings[i] : {};
    const id = documents.ids[i];
    const filename = metadata?.filename as string;
    const documentString = document as string;
    if (!objects[filename]) {
      objects[filename] = [];
    }

    objects[filename].push({
      metadata,
      embedding,
      document: documentString,
      id
    });
  });

  return objects;
};

export default processDocumentsIntoObjects;
