# This script handle the operations over DBs

import sys

from utils.DBHelperFunctions import cleanDB

if __name__ == "__main__":

    target_db = sys.argv[1]
    task = sys.argv[2]

    if task == 'clean':
        cleanDB(target_db)

    pass