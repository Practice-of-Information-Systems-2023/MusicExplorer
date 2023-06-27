import MF
import sqlite3
import pandas as pd
import numpy as np

def init_db() -> sqlite3.Cursor:
    conn = sqlite3.connect("../data/db.sqlite3")
    c = conn.cursor()    
    c.execute("SELECT * FROM backend_app_favorite")
    print(c.fetchall())
    return c

def get_data(c : sqlite3.Cursor): 
    c.execute("SELECT  music_id FROM backend_app_music")
    music = pd.DataFrame(c.fetchall(), columns=["music_id"])
    c.execute("SELECT user_id FROM backend_app_appuser")
    user = pd.DataFrame(c.fetchall(), columns=["user_id"])
    c.execute("SELECT * FROM backend_app_favorite")
    ratings = pd.DataFrame(c.fetchall(), columns=["user_id", "music_id"])
    ratings["rating"] = 1
    return music, user, ratings

def set_position(H: np.ndarray, music: pd.DataFrame, c: sqlite3.Cursor):
    try :
        for i, row in music.iterrows():
            music_id = row["music_id"]
            c.execute("UPDATE music SET position_x = ?, position_y = ? WHERE music_id = ?", (H[0][i], H[1][i], music_id))    
    except Exception as e:
        print("Failed to set position to database." + str(e))
    return
    

if __name__ == "__main__":
    c = init_db()
    music, user, ratings = get_data(c)
    rating_matrix = MF.df2sparse(ratings, user, music)
    W, H = MF.NonNegativeMatrixFactorization(rating_matrix)
    set_position(H, music, c)
    c.close()