import json
import pandas as pd
import os
from database_manage import DB
import hashlib


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
    #get the list of file, build path and push them in path list arr
    #for folder in folders_list:
    try:
        files_list = os.listdir(dirpath)
    except:
        print("open folder Error ", dirpath)
        return(None)
    if(len(files_list) <= 0):
        print("Nothing to process")
        return (None)
    #print("files list" , files_list)
    for file in files_list:
        path = dirpath+'/' + file
        path_liste.append(path)
    #assert(len(path_liste) == 4)
    return (path_liste)


# Processing the path liste of file
def process_batch_path(path_list, db:DB):

    #two variable for table
    processed = 0
    add = 0 

    for path in path_list:
        # for each path, get the result object to process
        offers = get_offerts_result(path)

        #result processing
        for offer in offers:
            json_offer = json.dumps(offer)                      # convert obj from dict to string
            binary_offer = bytes(json_offer,'utf-8')            # convert the offer string to the bytes
            offer_hash = hashlib.sha256()                       # create hash object using sha256
            offer_hash.update(binary_offer)                     # update the hash object with the binary offer
            hash = str(offer_hash.hexdigest())                  # convert hash obj to str hexadigest
            processed += 1                                      # update the processed counter
            if(db.is_on_db(binary_offer, hash) == 0):           # check the hash table offers
                db.update_offers_table(binary_offer, hash)      # if not in hash table add to the db
                add += 1                                        # update the add offert counter
        os.remove(path)                                         #remove file

    db.update_extraction_table(processed,add, db.department)                                                                                                                           #update extraction table
    

def get_department(idx):
    if(idx < 1):
        return
    elif(idx > 0 and idx < 10):
        return("0"+str(idx))
    elif(idx > 9 and idx < 96):
        return(str(idx))
    elif(idx > 95 and idx < 200):
        return(str(idx + 875))
    elif(idx == 200):
        return("2A")
    elif(idx == 201):
        return("2B")


def main():

    i = 1
    is_corse = 0
    print("start of machine")
    while i <= 101:
        
        if(i == 20):
            if(is_corse == 0):
                departement: str = get_department(200)
            elif (is_corse == 1):
                departement = get_department(201)
                print(departement)
        else:
            if(i == 975 - 875):
                i+=1
                continue
            else:
                departement = get_department(i)
        #get file list to check
        dirpath = '/home/cc/Documents/france_travail_worker/data/'+ departement
        
        # get the list path of files to process
        path_list = get_path_liste(dirpath)
        if(path_list == None or len(path_list) <= 0):
            i+=1
            continue
        
        #connect to the database
        db = DB(str(departement))
        #print("Start of processing" ,len(path_list), "files\n")
        process_batch_path(path_list, db)
        if(i == 20 and is_corse == 0):
            is_corse = 1
            continue
        i+=1
    print("Machine off")

main()