interface Metadata {
  [key: string]: any;
}

export interface Document {
  embedding?: any;
  document: string;
  metadata?: Metadata;
}

export interface DocumentLoaderErrors {
  error: string;
  item: string;
}

export type DocumentsObject = Record<string, Document[]>;
