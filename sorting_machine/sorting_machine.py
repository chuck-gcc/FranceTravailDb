import json
import pandas as pd
import os
from database_manage import DB
import hashlib


def get_files_lst(dirpath):
    try:
        files_list = os.listdir(dirpath)
        return files_list
    except:
        return(None)

def get_offerts_result(filepath):
    with open(filepath,"r") as f:
        try:
            data = json.load(f)
            return(data['resultats'])
        except:
            print("Loading object error")
            return(None)


# Building the path liste of file to process
def get_path_liste(dirpath):
    path_liste  = []
    # get the folder list to process
    try:
        folders_list = os.listdir(dirpath)
    except:
        print("No folder to process ")
        return(None)
        #if the folder is empty, delete the folder
    if(len(folders_list) <= 0):
            print("No folder to process ")
            os.rmdir(dirpath)

    #for each folder, get the list of file, build path and push them in path list arr
    # if the folder is empty, delete de folder
    for folder in folders_list:
        files_list = os.listdir(dirpath+'/'+ folder)
        if(len(files_list) <= 0):
            os.rmdir(dirpath+'/'+ folder)
            continue
        print("files list" , files_list)
        for file in files_list:
            path = dirpath+'/'+ folder + '/' + file
            path_liste.append(path)
    
    #assert(len(path_liste) == 4)
    return (path_liste)

 
def add_batch_to_db(path_list, db:DB):
    print(path_list)
    for path in path_list:
        offers = get_offerts_result(path)
        for offer in offers:
            json_offer = json.dumps(offer)
            binary_offer = bytes(json_offer,'utf-8')
            offer_hash = hashlib.sha256()
            offer_hash.update(binary_offer)
            hash = str(offer_hash.hexdigest())
            if(db.is_on_db(binary_offer, hash) == 0): 
                db.update_offers_table(binary_offer, hash)
        os.remove(path)
    

def main(departement):

    #get file list to check
    dirpath = '/home/cc/Documents/data_worker/data/'+ str(departement)
    
    # get the list path of files to process
    path_list = get_path_liste(dirpath)
    if(path_list == None or len(path_list) <= 0):
        return
    
    #connect to the database
    db = DB()
    print("Start of processing" ,len(path_list), "files\n")
    add_batch_to_db(path_list, db)

main(74)