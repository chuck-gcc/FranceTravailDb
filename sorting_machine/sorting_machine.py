import json
import hashlib
import pandas as pd
import sqlite3
import os
import base64

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
    dirpath = "/home/cc/Documents/data_worker/ftdb/data/74/2025-08-17T12:40:07.614Z"
    files_list = get_files_lst(dirpath)
    if(files_list == None or len(files_list) <= 0):
        return
    
    print("Start of reading" ,len(files_list), "files\n", files_list)
    count = 0
    #build the path and get the object json and process the object
    for file in files_list:
        filepath = dirpath + "/" +file
        objs = get_obj_json(filepath)
        if(objs != None):
            for obj in objs:
                print(obj['id'])
                count += 1
    print("voici le compte: " + count)
main()