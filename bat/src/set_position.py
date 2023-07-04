import MF
import sqlite3
import pandas as pd
import numpy as np
import time

def init_db():
    conn = sqlite3.connect("../../api/db.sqlite3", isolation_level=None)   
    c = conn.cursor()
    # c.execute("pragma table_info(backend_app_music)")
    # print(c.fetchall())
    return c, conn

def get_data(c : sqlite3.Cursor): 
    c.execute("SELECT  music_id, views FROM backend_app_music ORDER BY music_id ASC")
    music = pd.DataFrame(c.fetchall(), columns=["music_id", "views"])
    c.execute("SELECT user_id FROM backend_app_appuser ORDER BY user_id ASC")
    user = pd.DataFrame(c.fetchall(), columns=["user_id"])
    c.execute("SELECT user_id_id, music_id_id FROM backend_app_favorite")
    ratings = pd.DataFrame(c.fetchall(), columns=["user_id", "music_id"])
    ratings["rating"] = 1
    return music, user, ratings

def set_position(data: list, c: sqlite3.Cursor) -> None:
    try :
        # floor the position to 2 decimal places
        c.executemany("UPDATE backend_app_music SET position_x=?, position_y=? WHERE music_id=?", data)
    except Exception as e:
        print("Failed to set position to database." + str(e))
    return

def calc_position(rating_matrix: pd.DataFrame, music: pd.DataFrame, max_length: float = 10000, max_views: float = 300000000):
    # np.random.seed(seed=32)
    _, H = MF.NonNegativeMatrixFactorization(rating_matrix)
    # centerize the position by median
    H[0] = H[0] - np.average(H[0])
    H[1] = H[1] - np.average(H[1])
    # the more views, the more centerize
    music["views"] = music["views"]
    # music["views"] = np.log(music["views"] + 1)
    for i in range(len(music)):
        music.loc[i, "views"] = min(music.loc[i, "views"], max_views)
    for i in range(len(music)):
        length = np.sqrt(H[0][i]**2 + H[1][i]**2)
        views = music["views"][i]
        H[0][i] = (H[0][i] / length) + np.random.normal(0, 0.05) 
        H[1][i] = (H[1][i] / length) + np.random.normal(0, 0.05)
        H[0][i] = H[0][i] * (1 - (views / music["views"].max())) * max_length
        H[1][i] = H[1][i] * (1 - (views / music["views"].max())) * max_length
    # floor the position to 2 decimal places
    data = [(float(round(H[0][i], 2)), float(round(H[1][i], 2)),str(music["music_id"][i])) for i in range(len(music))]
    return data, H
    

if __name__ == "__main__":
    
    while True : 
        try :
            # conn = sqlite3.connect("../../api/db.sqlite3", isolation_level=None)
            conn = sqlite3.connect("/code/db.sqlite3", isolation_level=None)   
            c = conn.cursor()
            music, user, ratings = get_data(c)
            rating_matrix = MF.df2sparse(ratings, user, music)
            data, H = calc_position(rating_matrix, music)
            set_position(data,  c)
            conn.commit()
            time.sleep(30)
        except Exception as e:
            print("Failed to set position to database." + str(e))
            time.sleep(30)
        conn.close()
    
    