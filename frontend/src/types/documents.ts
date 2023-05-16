interface Metadata {
  [key: string]: any;
}

export interface Document {
  embedding?: any;
  document: string;
  metadata?: Metadata;
}

export type DocumentsObject = Record<string, Document[]>;
