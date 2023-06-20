import numpy as np
import pandas as pd
from lightfm.datasets import fetch_movielens
from lightfm.evaluation import precision_at_k, auc_score

data = fetch_movielens(min_rating=5.0)
print(repr(data['train']))
print(repr(data['test']))

from lightfm import LightFM

model = LightFM(loss='warp', no_components=30, learning_rate=0.05)
model.fit(data['train'], epochs=50, num_threads=2, verbose=True)

print("Train precision: %.2f" % precision_at_k(model, data['train'], k=5).mean())
print("Test precision: %.2f" % precision_at_k(model, data['test'], k=5).mean())

print("Train AUC: %.2f" % auc_score(model, data['train']).mean())
print("Test AUC: %.2f" % auc_score(model, data['test']).mean())