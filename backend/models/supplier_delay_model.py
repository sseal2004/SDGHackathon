import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report

from xgboost import XGBClassifier

# Load dataset
df = pd.read_csv("data/DataCoSupplyChainDataset.csv", encoding="latin1")

df.columns = df.columns.str.strip()

# Target
df["late_delivery"] = df["Days for shipping (real)"] > df["Days for shipment (scheduled)"]

# Remove leakage
df = df.drop(["Days for shipping (real)", "Days for shipment (scheduled)"], axis=1)

# Feature Engineering
df["price_after_discount"] = df["Order Item Product Price"] * (1 - df["Order Item Discount"])
df["revenue_per_item"] = df["Sales"] / (df["Order Item Quantity"] + 1)
df["profit_ratio"] = df["Benefit per order"] / (df["Sales"] + 1)

features = [
    "Order Item Quantity",
    "Order Item Discount",
    "Order Item Product Price",
    "Sales",
    "Benefit per order",
    "price_after_discount",
    "revenue_per_item",
    "profit_ratio",
    "Shipping Mode",
    "Market",
    "Customer Segment",
    "Order Region",
    "Order Country",
    "Product Category Id"
]

df = df[features + ["late_delivery"]]

df = df.dropna()

X = df.drop("late_delivery", axis=1)
y = df["late_delivery"]

num_cols = [
    "Order Item Quantity",
    "Order Item Discount",
    "Order Item Product Price",
    "Sales",
    "Benefit per order",
    "price_after_discount",
    "revenue_per_item",
    "profit_ratio",
    "Product Category Id"
]

cat_cols = [
    "Shipping Mode",
    "Market",
    "Customer Segment",
    "Order Region",
    "Order Country"
]

preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), num_cols),
        ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols)
    ]
)

model = XGBClassifier(
    n_estimators=1200,
    max_depth=12,
    learning_rate=0.02,
    subsample=0.9,
    colsample_bytree=0.9,
    gamma=0.5,
    min_child_weight=2,
    reg_lambda=2,
    reg_alpha=1,
    eval_metric="logloss",
    random_state=42
)

pipeline = Pipeline([
    ("prep", preprocessor),
    ("model", model)
])

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    stratify=y,
    random_state=42
)

pipeline.fit(X_train, y_train)

pred = pipeline.predict(X_test)

accuracy = accuracy_score(y_test, pred)

print("\nML Model Accuracy:", accuracy)
print("\nClassification Report:\n", classification_report(y_test, pred))

joblib.dump(pipeline, "models/delay_model.pkl")

print("\nHigh Accuracy ML Model Saved")