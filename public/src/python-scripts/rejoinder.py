import sys
import os
import pandas as pd
import numpy as np
from utils.File import File
from cloudant.client import Cloudant
from concurrent.futures import ProcessPoolExecutor, as_completed
from dotenv import load_dotenv


load_dotenv(verbose=True)

def read_rejoinders(id_list, out_path):

    user = os.getenv("USER")
    password = os.getenv("PASSWORD")
    url = os.getenv("URL")
    db_name = os.getenv("REJOINDER_DB")
    client = Cloudant(user, password, url=url, connect=True, auto_renew=True)

    # Open rejoinder DB
    rejoinder_db = client[db_name]
    df_list = []
    export = File(to_save=out_path + '\\result.xlsx')
    for id in id_list:
        doc = rejoinder_db[id]
        df_list.append(doc)
    for d in df_list:
        export.append_df_to_excel(pd.DataFrame([d]), d['sheet'], **{'index':False})
        #export.data = pd.DataFrame(df_list)
    #export.save()
        

if __name__ == "__main__":
    out_path = sys.argv[1]
    id_list = sys.argv[2].split(',')
    print(out_path)
    read_rejoinders(id_list, out_path)
    pass