import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout, BatchNormalization
from tensorflow.keras.callbacks import EarlyStopping

# Load dataset
df = pd.read_csv("data/DataCoSupplyChainDataset.csv", encoding="latin1")

df.columns = df.columns.str.strip()

features = [
    "Order Item Quantity",
    "Order Item Product Price",
    "Order Item Discount",
    "Sales",
    "Product Category Id",
    "Benefit per order"
]

df = df[features]

df = df.dropna()

target_index = features.index("Sales")

# Scaling
scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(df)

# Larger sequence window
window = 20

X = []
y = []

for i in range(len(scaled_data) - window):
    X.append(scaled_data[i:i+window])
    y.append(scaled_data[i+window][target_index])

X = np.array(X)
y = np.array(y)

# Train/Test split
split = int(len(X)*0.8)

X_train = X[:split]
X_test = X[split:]

y_train = y[:split]
y_test = y[split:]

# Deep LSTM Model
model = Sequential()

model.add(LSTM(256, return_sequences=True, input_shape=(window, X.shape[2])))
model.add(BatchNormalization())
model.add(Dropout(0.3))

model.add(LSTM(128, return_sequences=True))
model.add(Dropout(0.3))

model.add(LSTM(64))
model.add(Dropout(0.2))

model.add(Dense(64, activation="relu"))
model.add(Dense(1))

model.compile(
    optimizer="adam",
    loss="mse"
)

early_stop = EarlyStopping(
    monitor="val_loss",
    patience=5,
    restore_best_weights=True
)

model.fit(
    X_train,
    y_train,
    epochs=40,
    batch_size=64,
    validation_split=0.1,
    callbacks=[early_stop]
)

pred = model.predict(X_test)

# Reverse scaling
dummy_test = np.zeros((len(y_test), len(features)))
dummy_test[:,target_index] = y_test

dummy_pred = np.zeros((len(pred), len(features)))
dummy_pred[:,target_index] = pred.flatten()

y_test_rescaled = scaler.inverse_transform(dummy_test)[:,target_index]
pred_rescaled = scaler.inverse_transform(dummy_pred)[:,target_index]

# Metrics
mae = mean_absolute_error(y_test_rescaled, pred_rescaled)
rmse = np.sqrt(mean_squared_error(y_test_rescaled, pred_rescaled))
r2 = r2_score(y_test_rescaled, pred_rescaled)

print("\nLSTM MODEL PERFORMANCE")
print("MAE:", mae)
print("RMSE:", rmse)
print("R2 Score:", r2)

plt.figure()
plt.plot(y_test_rescaled[:200], label="Actual Sales")
plt.plot(pred_rescaled[:200], label="Predicted Sales")
plt.legend()
plt.title("Demand Forecasting LSTM")
plt.show()

model.save("models/lstm_demand_model.h5")

print("\nLSTM Demand Model Saved")