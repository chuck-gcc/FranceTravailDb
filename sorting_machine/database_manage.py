
import sqlite3

def connect_to_db():
    try:
        con = sqlite3.connect("annonces.db")
        return(con)
    except:
        print("Error connection db")



class DB:

    def __init__(self):
        self.db = connect_to_db()
        self.cursor = self.db.cursor()
        self.cursor.execute(
        """CREATE TABLE IF NOT EXISTS annonces_hash ( 
            id INTEGER PRIMARY KEY,
            hash BLOB
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
    
    def delete_table(self, name):
        self.cursor.execute(
        """DROP TABLE VALUE(?);""", name)