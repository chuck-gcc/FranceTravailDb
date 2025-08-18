import json
import hashlib
import pandas as pd
import os
import base64
import database_manage

def get_files_lst(dirpath):
    try:
        files_list = os.listdir(dirpath)
        return files_list
    except:
        return(None)

def get_obj_json(filepath):
    with open(filepath,"r") as f:
        try:
            data = json.load(f)
            return(data['resultats'])
        except:
            print("Loading object error")
            return(None)



def main():

    #get file list to check
    dirpath = "/home/cc/Documents/data_worker/ftdb/data/74/2025-08-18T13:46:44.631Z"
    files_list = get_files_lst(dirpath)
    if(files_list == None or len(files_list) <= 0):
        return
    
    #connect to the database
    db = database_manage.DB()
    db.create_random_table()
    db.print_table()
    

    print("Start of reading" ,len(files_list), "files\n", files_list)
    # count = 0
    # #build the path and get the object json and process the object
    # for file in files_list:
    #     filepath = dirpath + "/" +file
    #     objs = get_obj_json(filepath)
    #     if(objs != None):
    #         json_str = json.dumps(objs[0])
    #         h = json_str.encode("utf-8")
    #         print(type(h))
    #         d = h.decode("utf-8")
    #         print(d[0])
    #         # for i in h:
    #         #     print("voici le compte: " , i)  
                
    #         count += 1

main()