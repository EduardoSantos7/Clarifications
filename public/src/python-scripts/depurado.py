import sys
import os
import time
import pandas as pd
import numpy as np
import datetime
from math import ceil
from utils.File import File
from concurrent.futures import ProcessPoolExecutor, as_completed


def get_pre_file(paths):
    """" This function return one File object which is
    the concatenation of [paths] """

    if len(paths) < 2 :
        pre_file = concat_data(paths)
        return pre_file
    else:
        pre_file = concat_data_parallel(paths)
        return pre_file


def concat_data_parallel(paths, workers=8):
    """ Concat the dataframes using multiple proccess """

    dim = ceil(len(paths) / workers)
    chunks = (paths[k: k + dim] for k in range(0, len(paths), dim))
    temp = []

    with ProcessPoolExecutor(max_workers=workers) as executor:
        futures = [
            executor.submit(concat_data, chunk) for chunk in chunks
        ]
    # If there are many file keep the first as result file and
    # the other take only the df for be concatenated
    for i, future in enumerate(futures):
        if i == 0:
            temp.append(future.result())
        if i > 0:
            temp.append(future.result().data)
    if len(temp) > 1:
        temp[0].concat(temp[1:])
    return temp[0]

def concat_data(paths):
    """ Read the DF in input paths and concatenate it. """
    concat = File()
    dfs = []
    # Sheets to read
    sheet_names = ['BDI Disponibilidad', 'BDI Mantenimientos Preventivos']
    
    for path in paths:
        try:
            file_name = path.split('\\')[-1]
            path = path.replace(file_name, '')
            
            os.chdir(path)

            temp = File(to_read=file_name, read_options={'sheet_name':sheet_names})
            temp.data['file_name'] = file_name
            dfs.append(temp.data)
        except:
            print(f"File {file_name} could not be read")
    
    concat.concat(dfs, **{"ignore_index":True})
    return concat

def depuration(raw_file):

    # Tag duplicates based in ticket key and end time
    raw_file.data['duplicated'] = raw_file.data.duplicated(subset=['TICKET_KEY', 'Hora_fin'])
    
    # Avoid error for NaN values
    raw_file.data.fillna("", inplace=True)

    # Delete duplicated open ticket
    raw_file.data = raw_file.data[raw_file.data.apply(drop_duplicated_open_tickets, axis=1)]

    raw_file.delete_duplicates(subset=['TICKET_KEY', 'Semaforo'], keep='last')
    
    raw_file.data['message'] = raw_file.data.apply(check_hour_consistency , axis=1)  

    # Update duplicated columns for indicate which still duplicates,
    # meaning: there are some changes in semaphores or hours.
    raw_file.data['duplicated'] = raw_file.data.duplicated(subset='TICKET_KEY')

    raw_file.data['message'] = raw_file.data.apply(check_changes_files , axis=1)  

    return raw_file

def drop_duplicated_open_tickets(x):
    """ Recives a row from apply function
    and drop open tickets """
    
    string_date = x['Hora_fin']
    # If cell contains a date object cast it to string
    if type(string_date) == datetime.datetime:
        string_date = x['Hora_fin'].strftime("%H:%M:%S")
    # "23:59:59" indicates an open ticket if there is other with the same ticket key
    if string_date == "23:59:59" and x['duplicated']:
        return False
    return True

def check_hour_consistency(x):
    """ Check if the semaphore match with hours """
    
    time = x['Horas_Netas']
    color = x['Semaforo'].lower()

    color = x['Semaforo'].lower()
    message = "Revisar consistencias de semaforos."

    if color == "verde" :
        if type(time) != datetime.time or (time.hour > 5 and time.minute > 30):
            return message
    if color == "amarillo":
        if type(time) != datetime.time or time.hour < 5:
            return message
    # time should be datetime.time if datetime.datetime means more than a day
    if color == "rojo" and type(time) != datetime.datetime:
        return message
    
    # All ok
    return ""

def check_changes_files(x):
    """ Indicates if a there are changes between same tickets """

    message = "Han habido cambios en horas o semaforos referente al mismo ticket."
    if x['duplicated'] and x['message']:
        return x['message'] + ' ' + message
    if x['duplicated']:
        return message
    return ""

def get_inconsistencies_file(file):
    """ Get inconsistencies from the [file] and return a File with the results """

    # Edit duplicated taking only ticket key and tag all repetitions
    file.data['duplicated'] = file.data.duplicated(subset='TICKET_KEY', keep=False)
    inconsistencies = File()
    inconsistencies.data = file.data[file.data['duplicated']]
    return inconsistencies

if __name__ == "__main__":

    input_paths = sys.argv[1].split(',')
    output_path = sys.argv[2]
    
    pre_file = get_pre_file(input_paths)

    fil = depuration(pre_file)
    save_options = {'index':False}
    fil.save(path=output_path+"/mer.xlsx", **save_options)
    
    inc_file = get_inconsistencies_file(fil)
    inc_file.save(path=output_path+"/inconsistencias.xlsx", **save_options)

    pass
