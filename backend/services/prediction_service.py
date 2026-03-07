import joblib
import pandas as pd

demand_model = joblib.load("models/demand_model.pkl")
delay_model = joblib.load("models/delay_model.pkl")


def predict_demand(data):

    df = pd.DataFrame([data])

    prediction = demand_model.predict(df)

    return prediction.tolist()


def predict_delay(data):

    df = pd.DataFrame([data])

    # Feature engineering (same as training)
    df["price_after_discount"] = df["Order Item Product Price"] * (1 - df["Order Item Discount"])

    df["revenue_per_item"] = df["Sales"] / (df["Order Item Quantity"] + 1)

    df["profit_ratio"] = df["Benefit per order"] / (df["Sales"] + 1)

    prediction = delay_model.predict(df)

    return prediction.tolist()