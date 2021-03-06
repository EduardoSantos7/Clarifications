# This script implements helper functions to interact with DBs
# Some of this are implemented in python for a unexpected errors with NodeJS lib.

import re
import os
from cloudant.client import Cloudant
from dotenv import load_dotenv


load_dotenv(verbose=True)

# Compile a pattern to match design documents
pattern = re.compile('_design*')

USERNAME = os.getenv("USER")
PASSWORD = os.getenv("PASSWORD")
URL = os.getenv("URL")

client = Cloudant(USERNAME, PASSWORD, url=URL)

def cleanDB(db_name):
    """
    Delete the docs in a db except design docs.
    """
    # Connect to the server
    client.connect()
    # Open the target db
    target_db = client[db_name]
    # Check if the base exists
    if target_db.exists():
        # Get all of the documents from my_database
        for document in target_db:
            # Look for all documents which do not match _design/
            if not pattern.match(document['_id']):
                document.delete()
 
    # Disconnect from the server
    client.disconnect()

def getDB(db_name):
    """
    Return all the document in a DB
    """
    # Connect to the server
    client.connect()
    # Open the target db
    target_db = client[db_name]
    # Dcoument list
    document_list = []
    # Check if the base exists
    if target_db.exists():
        # Get all of the documents from my_database
        for document in target_db:
            # Look for all documents which do not match _design/
            if not pattern.match(document['_id']):
                document_list.append(document)
    return document_list
    # Disconnect from the server
    client.disconnect()

