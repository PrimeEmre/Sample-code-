#Iris Flower Classifier
# from sklearn.datasets import load_iris
# from sklearn.model_selection import train_test_split
# from sklearn.tree import DecisionTreeClassifier
# from sklearn.metrics import accuracy_score
# import numpy as np

# # loding data
# iris = load_iris()
# x = iris.data
# y = iris.target

# # training the AI
# X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

# model = DecisionTreeClassifier()
# model.fit(X_train, y_train)
# predictions = model.predict(X_test)
# print(f"Accuracy: {accuracy_score(y_test, predictions) * 100:.2f}%")

# # predicting new flower
# new_flower = np.array([[1.2, 4.6, 1.1, 7.5]])
# prediction = model.predict(new_flower)
# print(f"Predicted species: {iris.target_names[prediction][0]}")

# Titanic Survival Prediction
# setting the modules
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

#  setting the dataset & Load the dataset
dataset = pd.read_csv("train.csv")

# Setting the data and cleaning the data
dataset["Age"].fillna(dataset["Age"].median(), inplace=True)
dataset.drop(columns=["Cabin"], inplace=True)
dataset.dropna(subset=["Embarked"], inplace=True)
dataset["Sex"] = dataset["Sex"].map({"male": 0, "female": 1})
dataset["Embarked"] = dataset["Embarked"].map({"S": 0, "C": 1, "Q": 2})

# Setting the futures
features = ["Pclass", "Sex", "Age", "SibSp", "Parch", "Fare", "Embarked"]
x_axis = dataset[features]
y_axis = dataset["Survived"]

# Truing the modules
X_train, X_test, y_train, y_test = train_test_split(x_axis, y_axis, test_size=0.2, random_state=42
                                                    )
model = DecisionTreeClassifier()
model.fit(X_train, y_train)

# Checking the accuracy & setting the prediction
predictions = model.predict(X_test)
print(f"Accuracy score: {accuracy_score(y_test, predictions) * 100}%")

new_passanger = np.array([[3, 1, 22, 1, 1, 7.25, 0]])
prediction = model.predict(new_passanger)
if prediction[0] == 1:
    print("This passenger would have survived ")
else:
    print("This passenger would NOT survived ")

