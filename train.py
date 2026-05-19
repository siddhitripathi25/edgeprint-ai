import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle

# COLUMN NAMES
columns = [
    "x1", "y1",
    "x2", "y2",
    "x3", "y3",
    "x4", "y4",
    "x5", "y5",
    "label"
]

# LOAD CSV
data = pd.read_csv("dataset.csv", names=columns)

# FEATURES
X = data.drop("label", axis=1)

# TARGET
y = data["label"]

# SPLIT
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2
)

# MODEL
model = RandomForestClassifier()

# TRAIN
model.fit(X_train, y_train)

# PREDICT
predictions = model.predict(X_test)

# ACCURACY
accuracy = accuracy_score(y_test, predictions)

print(f"Accuracy: {accuracy*100:.2f}%")

# SAVE MODEL
pickle.dump(model, open("hand_model.pkl", "wb"))

print("Model Saved!")