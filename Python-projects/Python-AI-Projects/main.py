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
# import pandas as pd
# import numpy as np
# from sklearn.model_selection import train_test_split
# from sklearn.tree import DecisionTreeClassifier
# from sklearn.metrics import accuracy_score

# #  setting the dataset & Load the dataset
# dataset = pd.read_csv("train.csv")

# # Setting the data and cleaning the data
# dataset["Age"].fillna(dataset["Age"].median(), inplace=True)
# dataset.drop(columns=["Cabin"], inplace=True)
# dataset.dropna(subset=["Embarked"], inplace=True)
# dataset["Sex"] = dataset["Sex"].map({"male": 0, "female": 1})
# dataset["Embarked"] = dataset["Embarked"].map({"S": 0, "C": 1, "Q": 2})

# # Setting the futures
# features = ["Pclass", "Sex", "Age", "SibSp", "Parch", "Fare", "Embarked"]
# x_axis = dataset[features]
# y_axis = dataset["Survived"]

# # Truing the modules
# X_train, X_test, y_train, y_test = train_test_split(x_axis, y_axis, test_size=0.2, random_state=42
#                                                     )
# model = DecisionTreeClassifier()
# model.fit(X_train, y_train)

# # Checking the accuracy & setting the prediction
# predictions = model.predict(X_test)
# print(f"Accuracy score: {accuracy_score(y_test, predictions) * 100}%")

# new_passanger = np.array([[3, 1, 22, 1, 1, 7.25, 0]])
# prediction = model.predict(new_passanger)
# if prediction[0] == 1:
#     print("This passenger would have survived ")
# else:
#     print("This passenger would NOT survived ")


# House Price Prediction
import pandas as pd
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

# Setting the Data
data = pd.read_csv('train.csv')

print(f"Data loaded: {data.shape}")

# Setting the values and colums
num_cols = data.select_dtypes(include='number').columns
data[num_cols] = data[num_cols].fillna(data[num_cols].median())
cat_cols = data.select_dtypes(include='str').columns
data[cat_cols] = data[cat_cols].fillna(data[cat_cols].mode().iloc[0])

data = pd.get_dummies(data , drop_first=True)

# Setting the x and y-axis for our data
x_axis = data.drop("SalePrice", axis=1)
y_axis = data["SalePrice"]
X_train, X_test, y_train, y_test = train_test_split(x_axis, y_axis, test_size=0.2, random_state=42)

# training our AI
model = XGBRegressor(n_estimators=500, learning_rate=0.05, max_depth=6, random_state=42)
model.fit(X_train, y_train)

# Agglutinating the house prices
y_pred = model.predict(X_test)
print(f"MAE: ${mean_absolute_error(y_test, y_pred)}:,0f")
print(f"R²:   {r2_score(y_test, y_pred):.4f}")
# Predicting the house prices
sample = X_test.iloc[0:1]
predicting_price = model.predict(sample)
print(f"Predicting price: ${predicting_price[0]:,.0f}")

# Creating the custom prices
custom_house = X_test.iloc[0:1].copy()
custom_house['GrLivArea'] = 12000
custom_house['OverallQual'] = 10
custom_house['TotRmsAbvGrd'] = 12
custom_house['YearBuilt'] = 2024
custom_house['GarageCars'] = 3
price = model.predict(custom_house)
print(f"Your House Predicted Price: ${price[0]:,.0f}")

# See first 5 predictions vs actual prices
for i in range(10):
    sample = X_test.iloc[i:i+1]
    pred = model.predict(sample)[0]
    actual = y_test.iloc[i]
    print(f"House {i+1} → Predicted: ${pred:,.0f}  |  Actual: ${actual:,.0f}")

# Saving the model
joblib.dump(model, 'house_price_model.pkl')
print("Model saved!")