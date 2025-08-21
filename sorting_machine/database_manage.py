
import sqlite3
import datetime
import json
from datetime import datetime, date, time, timezone

def connect_to_db():
    try:
        con = sqlite3.connect("db/annonces.db")
        return(con)
    except:
        print("Error connection db")


class DB: 
    def __init__(self, department):
        self.ask = 0
        self.date = ""
        self.department = department
        self.db = connect_to_db()
        self.cursor = self.db.cursor()
        self.cursor.execute(
        """CREATE TABLE IF NOT EXISTS offers_hash ( 
            id          INTEGER PRIMARY KEY,
            hash        STRING,
            date        STRING
        );""")
        self.cursor.execute(
        """CREATE TABLE IF NOT EXISTS offers ( 
            id          INTEGER PRIMARY KEY,
            offer_hash  STRING,
            offer       BLOB,
            date        STRING
        );""")
        self.cursor.execute(
        """CREATE TABLE IF NOT EXISTS extraction_table ( 
            id              INTEGER PRIMARY KEY,
            offer_process   INTEGER,
            offer_add       INTEGER,
            departement      STRING,
            date            STRING
        );""")
        #print("Data base initialisation: OK")

    def print_master_table(self):
        print("Start lecture")
        self.cursor.execute("""SELECT name FROM sqlite_master WHERE type= 'table'""")
        data = self.cursor.fetchall()
        if(len(data) > 0):
            print("table:")
            for table in data:
                print("\t", table[0])

    
    def delete_table(self, name: str):
        self.cursor.execute(
        """DROP TABLE (?);""", name)
    
    #convert binary offer to hash and check the hash table 
    def is_on_db(self, hash: str):
        
        self.cursor.execute("""SELECT hash FROM offers_hash WHERE hash = ?""",(hash,))
        self.ask += 1
        #print("Ask table ", self.ask, " departement ", self.department)
        result = self.cursor.fetchall()
        if(len(result) == 0):
            #print(hash)
            return(0)
        return(1)

    def get_hash_table(self):
        self.cursor.execute("""SELECT hash FROM offers_hash""")
        result = self.cursor.fetchall()
        return(result)


    def update_hash_table(self, hash: str, date:str):
        self.cursor.execute(""" INSERT INTO offers_hash (hash,date) VALUES (?, ?) """, (hash,date,))
        #print("UPDATE hash table")
    

    def update_offers_table(self, binary_offer: bytes, hash: str):
        self.set_date()
        self.update_hash_table(hash, self.date)
        self.cursor.execute("""INSERT INTO offers (offer, offer_hash, date) VALUES (?,?,?)""", (binary_offer,hash,self.date,))
        print("UPDATE offerts table")
    
    def update_extraction_table(self, process, add, department):
        self.set_date()
        self.cursor.execute("""INSERT INTO extraction_table (offer_process, offer_add, departement, date) VALUES(?,?,?,?)""", (process, add, self.department,self.date,))
        print("extraction table  update processed :", process," add: ", add)
        self.db.commit()

    def set_date(self):
        date = datetime.now(timezone.utc)
        formated_date = date.replace(microsecond=0)
        self.date = formated_date
        #print(type(formated_date.isoformat()))