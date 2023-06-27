import MF
import sqlite3
import pandas as pd
import numpy as np
import typing as Tuple

def init_db():
    conn = sqlite3.connect("../../api/db.sqlite3", isolation_level=None)   
    c = conn.cursor()
    # c.execute("pragma table_info(backend_app_music)")
    # print(c.fetchall())
    return c, conn

def get_data(c : sqlite3.Cursor): 
    c.execute("SELECT  music_id FROM backend_app_music ORDER BY music_id ASC")
    music = pd.DataFrame(c.fetchall(), columns=["music_id"])
    c.execute("SELECT user_id FROM backend_app_appuser ORDER BY user_id ASC")
    user = pd.DataFrame(c.fetchall(), columns=["user_id"])
    c.execute("SELECT user_id_id, music_id_id FROM backend_app_favorite")
    ratings = pd.DataFrame(c.fetchall(), columns=["user_id", "music_id"])
    ratings["rating"] = 1
    return music, user, ratings

# def set_position(H: np.ndarray, music: pd.DataFrame, c: sqlite3.Cursor, conn: sqlite3.Connection):
#     try :
#         # floor the position to 2 decimal places
#         data = [(round(H[0][i], 2), round(H[1][i], 2), music["music_id"][i]) for i in range(len(music))]
#         c.executemany("UPDATE backend_app_music SET position_x=?, position_y=? WHERE music_id=?", data)
#     except Exception as e:
#         print("Failed to set position to database." + str(e))
#     return
    

if __name__ == "__main__":
    conn = sqlite3.connect("../../api/db.sqlite3", isolation_level=None)   
    c = conn.cursor()
    music, user, ratings = get_data(c)
    rating_matrix = MF.df2sparse(ratings, user, music)
    W, H = MF.NonNegativeMatrixFactorization(rating_matrix)
    data = [(float(round(H[0][i], 5)), float(round(H[1][i], 5)), int(music["music_id"][i])) for i in range(len(music))]
    c.executemany("UPDATE backend_app_music SET position_x=?, position_y=? WHERE music_id=?", data)
    c.close()