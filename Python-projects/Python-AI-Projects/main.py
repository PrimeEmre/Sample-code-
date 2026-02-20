
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
import numpy as np
import pandas as pd

# loding data
iris = load_iris()

# Addicng tables
table = pd.DataFrame(iris.data, columns=iris.feature_names)
table['species'] = iris.target

print(table.head())

