import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from xgboost import XGBRegressor

df = pd.read_csv("data/DataCoSupplyChainDataset.csv", encoding='latin1')

# selecting useful columns
df = df[['Sales', 'Order Item Quantity', 'Order Profit Per Order', 'Order Item Discount']]

df = df.dropna()

X = df.drop(columns=['Sales'])
y = df['Sales']

X_train,X_test,y_train,y_test = train_test_split(X,y,test_size=0.2,random_state=42)

models = {

"Linear Regression":LinearRegression(),

"Random Forest":RandomForestRegressor(n_estimators=200),

"Gradient Boosting":GradientBoostingRegressor(),

"XGBoost":XGBRegressor()
}

best_model=None
best_r2=-999

print("\nMODEL PERFORMANCE\n")

for name,model in models.items():

    model.fit(X_train,y_train)

    pred=model.predict(X_test)

    mae=mean_absolute_error(y_test,pred)
    rmse=np.sqrt(mean_squared_error(y_test,pred))
    r2=r2_score(y_test,pred)

    print(name)
    print("MAE:",round(mae,2))
    print("RMSE:",round(rmse,2))
    print("R2:",round(r2,3))
    print("----------------")

    if r2>best_r2:
        best_r2=r2
        best_model=model

joblib.dump(best_model,"models/demand_model.pkl")

print("\nBest Model Saved")
print("Best R2:",best_r2)