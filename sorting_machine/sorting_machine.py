import json
import pandas as pd
import os
from database_manage import DB

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
    folders_list = os.listdir(dirpath)
    if(len(folders_list) <= 0):
        print("No folder to process ")
        #if the folder is empty, delete the folder
        os.rmdir(dirpath)
        return(None)
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

 
def add_to_db(path_list, db:DB):
    print(path_list)
    for path in path_list:
        offers = get_offerts_result(path)
        for offer in offers:
            json_offer = json.dumps(offer)
            binary_offer = bytes(json_offer,'utf-8')
            if(db.is_on_db(binary_offer) == 0):
                db.cursor.execute(""" INSERT INTO offers (hash) VALUES (?)""", (binary_offer,))
                db.db.commit()
                print("offer add")
    


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
    add_to_db(path_list,db)
    

    # path = path_list[0]
    # jobj = get_obj_json(path)
    # json_data = json.dumps(jobj[0])
    # binary_data = bytes(json_data, 'utf-8')
    # hash_data = hashlib.sha256()
    # hash_data.update(binary_data)

    # db.cursor.execute(""" INSERT INTO offers (hash) VALUES (?)""", (binary_data,))
    # db.db.commit()
    # db.cursor.execute(""" SELECT hash FROM offers""")
    # d  = bytes(db.cursor.fetchone()[0]).decode('utf-8')
    # hash_data2 = hashlib.sha256(db.cursor.fetchone()[0])
    # data = json.loads(d)
    
    
    
    #print(hash_data.hexdigest())
    # count = 0
    #print(hash_data2.hexdigest())

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

main(74)