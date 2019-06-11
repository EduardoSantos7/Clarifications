# This script handle the operations over DBs

import sys
import datetime
import pandas as pd

from utils.File import File
from utils.DBHelperFunctions import cleanDB, getDB

if __name__ == "__main__":

    target_db = sys.argv[1]
    task = sys.argv[2]

    if task == 'clean':
        cleanDB(target_db)
    elif task == 'download':
        document_list = getDB(target_db)
        df = pd.DataFrame(document_list)
        doc_name = f"{target_db}_document_{datetime.datetime.now().strftime('%m_%d_%Y_%H_%M')}.xlsx"
        df.to_excel(doc_name)


    pass