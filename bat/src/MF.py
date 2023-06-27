# simple matrix factorization
from scipy.sparse.csr import csr_matrix
from sklearn.decomposition import NMF
import pandas as pd
import numpy as np
from typing import Tuple

def df2sparse(X: pd.DataFrame, user: pd.DataFrame, music: pd.DataFrame) -> csr_matrix:
    for col in X.columns:
        X[col] = X[col].astype("int64")
    print(X.dtypes)
    return csr_matrix((X["rating"], (X["user_id"], X["music_id"])), shape=(user.shape[0], music.shape[0]))
    

def NonNegativeMatrixFactorization(X: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
    model = NMF(n_components=2, init="nndsvd", random_state=1, 
                max_iter=500, solver='mu', alpha_H=0.1, alpha_W=0.1, l1_ratio=0, verbose=1 )
    W = model.fit_transform(X)
    H = model.components_
    return W, H

if __name__ == "__main__":
    df_rating = pd.read_csv("../data/rating.csv", header=0)
    df_user = pd.read_csv("../data/user.csv", header=0)
    df_music = pd.read_csv("../data/music.csv", header=0)
    rating_matrix = df2sparse(df_rating, df_user, df_music)
    print(rating_matrix.shape)
    W, H = NonNegativeMatrixFactorization(rating_matrix)
    print(W.shape, H.shape)
    
    
