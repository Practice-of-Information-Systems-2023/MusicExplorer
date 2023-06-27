import MF
import sqlite3

def get_data():
    conn = sqlite3.connect(MF.db_path)
    c = conn.cursor()
    c.execute("SELECT * FROM position")
    data = c.fetchone()
    conn.close()
    return data