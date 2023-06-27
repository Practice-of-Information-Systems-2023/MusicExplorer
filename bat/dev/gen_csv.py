# generate random csv file
import random
import pandas as pd
import numpy as np

rating_col_name = ["user_id", "music_id", "rating"]
user_col_name = ["user_id" ,"genre_id","age","gender"]
music_col_name = ["music_id","views","good","bad","comment_count"]

def gen_rating_csv(file_name):
    num_rating = 5000
    df = pd.DataFrame(columns=rating_col_name)
    for i in range(num_rating):
        df.loc[i] = [random.randint(0, 99), random.randint(0, 149), 1]
    for i in range(150):
        for _ in range(5):
            df.loc[num_rating+i] = [random.randint(0, 99), i, 1]
    for i in range(100):
        for _ in range(5):
            df.loc[num_rating+150+i] = [i, random.randint(0, 149), 1]
    print(df)
    df.to_csv(file_name, index=False)
    
def gen_user_csv(file_name):
    num_user = 100
    df = pd.DataFrame(columns=user_col_name)
    for i in range(num_user):
        df.loc[i] = [i, random.randint(0, 10), random.randint(15, 80), random.randint(0, 2)]
    
    print(df)
    df.to_csv(file_name, index=False)
    
def gen_music_csv(file_name):
    num_music = 150
    df = pd.DataFrame(columns=music_col_name)
    for i in range(num_music//3):
        df.loc[i] = [i, int(random.gauss(10000, 3000)), int(random.gauss(500, 200)), int(random.gauss(500, 200)), int(random.gauss(500, 200))]
    for i in range(num_music//3, num_music//3*2):
        df.loc[i] = [i, int(random.gauss(50000, 50000)), int(random.gauss(1000, 200)), int(random.gauss(1300, 600)), int(random.gauss(1000, 300))]
    for i in range(num_music//3*2, num_music):
        df.loc[i] = [i, int(random.gauss(10000, 5000)), int(random.gauss(2000, 1000)), int(random.gauss(300, 100)), int(random.gauss(900, 400))]
    print(df)
    df.to_csv(file_name, index=False)

if __name__ == "__main__":
    gen_rating_csv("../data/rating.csv")
    gen_user_csv("../data/user.csv")
    gen_music_csv("../data/music.csv")
     