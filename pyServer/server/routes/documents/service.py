documents = []

def get_documents():
    return documents

def create_document(document):
    documents.append(document)
    return document

def delete_document(id):
    global documents
    documents = [document for document in documents if document['id'] != id]
    return {'message': f'Document {id} deleted.'}
