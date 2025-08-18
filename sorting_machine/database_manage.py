
import sqlite3
import hashlib


def connect_to_db():
    try:
        con = sqlite3.connect("../db/annonces.db")
        return(con)
    except:
        print("Error connection db")


class DB: 

    def __init__(self):
        self.db = connect_to_db()
        self.cursor = self.db.cursor()
        self.cursor.execute(
        """CREATE TABLE IF NOT EXISTS offers_hash ( 
            id      INTEGER PRIMARY KEY,
            hash    STRING
        );""")
        self.cursor.execute(
        """CREATE TABLE IF NOT EXISTS offers ( 
            id          INTEGER PRIMARY KEY,
            offer       BLOB
            offer_hash  STRING
        );""")
        print("Data base initialisation: OK")

    def print_table(self):
        print("Start lecture")
        self.cursor.execute("""SELECT name FROM sqlite_master WHERE type= 'table'""")
        data = self.cursor.fetchall()
        if(len(data) > 0):
            print("table:")
            for table in data:
                print("\t", table[0])

    def create_random_table(self):
        self.cursor.execute(
        """CREATE TABLE IF NOT EXISTS random ( 
            id INTEGER PRIMARY KEY,
            i   INTEGER
        );""")
    
    def delete_table(self, name: str):
        self.cursor.execute(
        """DROP TABLE (?);""", name)
    
    #convert binary offer to hash and check the hash table 
    def is_on_db(self, binary_offer: bytes):
        offer_hash = hashlib.sha256()
        offer_hash.update(binary_offer)
        hash = str(offer_hash.hexdigest())
        self.cursor.execute("""SELECT hash FROM offers_hash WHERE hash = ?""",(hash,))
        result = self.cursor.fetchall()
        if(result == 0):
            print(hash)
            print("the offer" + hash +"isn't in DB")
            return(0)
        return(1)