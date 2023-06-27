import pandas as pd
import lightfm as lf
import log as lg
from lightfm.data import Dataset

user_feature = ["genre_id","age","gender"]
category_user_feature = ["genre_id","gender"]
music_feature = ["views","good","bad","comment_count"]
category_music_feature = []
logger = lg.init_logger()

def df2id_map(df : pd.DataFrame, id_col_name : str, col_name: list, category_feature: list):
    id_map = []
    built_feature = []
    for _, row in df.iterrows():
        map = {}
        for col in col_name:
            if col in category_feature:
                map[col + str(row[col])] = 1 
                built_feature.append(col + str(row[col])) if col + str(row[col]) not in built_feature else None
            else:
                map[col] = row[col]
                built_feature.append(col) if col not in built_feature else None
        id_map.append((row[id_col_name], map))
    return id_map, built_feature

def df2dataset(df_rating:pd.DataFrame ,df_user: pd.DataFrame, df_music: pd.DataFrame):
    ds = Dataset(user_identity_features=True, item_identity_features=True)
    user_map, built_user_feature = df2id_map(df_user, "user_id", user_feature, category_user_feature)
    music_map, built_music_feature = df2id_map(df_music, "music_id", music_feature, category_music_feature)
    ds.fit((row["user_id"] for _, row in df_user.iterrows()),(row["music_id"] for _, row in df_music.iterrows()),
              user_features = built_user_feature,
                item_features= built_music_feature
           )
    interaction, weights = ds.build_interactions((row["user_id"], row["music_id"]) for _, row in df_rating.iterrows())
    user_features = ds.build_user_features(user_map, normalize=False)
    music_features = ds.build_item_features(music_map, normalize=False)
    # print(interaction)
    # print(weights)
    # print(user_features.shape)
    # print(user_features)
    # print(music_features.shape)
    # print(music_features)
    # logger.info("interaction.shape: {}".format(interaction.shape))
    # logger.info("user_features" + str(built_user_feature))
    # logger.info("user_features.shape: {}".format(user_features.shape))
    # logger.info("music_features" + str(built_music_feature))
    # logger.info("music_features.shape: {}".format(music_features.shape))
    return interaction, user_features, music_features

if __name__ == "__main__":
    df_rating = pd.read_csv("../data/rating.csv", header=0)
    df_user = pd.read_csv("../data/user.csv", header=0)
    df_music = pd.read_csv("../data/music.csv", header=0)
    df2dataset(df_rating, df_user, df_music)