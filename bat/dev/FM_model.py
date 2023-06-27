import FM_dataset
from lightfm.datasets import fetch_movielens
import lightfm as lf
import log as lg
import scipy.sparse as sparse
import numpy as np
import pandas as pd
import seaborn as sns


def fm_exe(ratings : sparse.coo_matrix, user_features : sparse.csr_matrix, music_features : sparse.csr_matrix)-> np.float32:
    user_l2 = 0.001
    music_l2 = 0.001
    logger = lg.init_logger()
    model = lf.LightFM(loss='warp', no_components=2, user_alpha=user_l2, item_alpha=music_l2)
    logger.info("start training")
    model.fit(ratings, user_features=user_features, item_features=music_features, epochs=30, num_threads=2, verbose=True)
    logger.info("finish training")
    item_biases, item_embeddings = model.get_item_representations()
    return item_biases, item_embeddings


if __name__ == "__main__":
    df_rating = pd.read_csv("./rating.csv", header=0)
    df_user = pd.read_csv("./user.csv", header=0)
    df_music = pd.read_csv("./music.csv", header=0)
    interaction, user_features, music_features = FM_dataset.df2dataset(df_rating, df_user, df_music)
    item_biases, item_embeddings = fm_exe(interaction, user_features, music_features)
    # item_biases, item_embeddings = sample_movie_lens()
    # show item_embeddings in 2-Dvector space
    # sns.set()
    # sns.scatterplot(x=item_embeddings[:,0], y=item_embeddings[:,1])
    
    print(item_biases)
    print(item_embeddings)