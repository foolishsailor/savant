collections = [{'name': 'Coll 1'},{'name': 'Coll 2'},{'name': 'Coll 3'}]

def get_collections():
    return collections

def create_collection(collection):
    collections.append(collection)
    return collection

def delete_collection(name):
    global collections
    collections = [collection for collection in collections if collection['name'] != name]
    return {'message': f'Collection {name} deleted.'}
