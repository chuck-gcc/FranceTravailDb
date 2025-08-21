import threading
import time
import sqlite3
import json
import hashlib
import os
from sorting_machine.database_manage import DB

def get_offerts_result(filepath):
    with open(filepath,"r") as f:
        try:
            data = json.load(f)
            return(data['resultats'])
        except:
            print("Loading object error")
            return(None)


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
    
def hello(idx):
    time.sleep(0.1)
    processed = 0
    add = 0 
    departement = str(get_department(idx))
    db = DB(departement)
    cursor = db.cursor
    path = "data/"+ departement
    try:
        files_liste = os.listdir(path)
        for file in files_liste:
            result = get_offerts_result(path+'/'+file)
            for offer in result:
                json_offer = json.dumps(offer)                          # convert obj from dict to string
                binary_offer = bytes(json_offer,'utf-8')                # convert the offer string to the bytes
                offer_hash = hashlib.sha256()                           # create hash object using sha256
                offer_hash.update(binary_offer)                         # update the hash object with the binary offer
                hash = str(offer_hash.hexdigest())
                processed += 1  
                if(db.is_on_db(hash) == 0):                           # check the result of the filter
                    db.update_offers_table(binary_offer, hash)          # if not in hash table add to the db
                    add += 1
    except:
        print("Error ", idx)
    db.db.commit()
    
def main():
    
    threads = []
    for x in range(1,101):
        my_thread = threading.Thread(target=hello, args=(x,))
        threads.append(my_thread)

    for thread in threads:
        thread.start()

    for thread in threads:
        thread.join()
    
main()
