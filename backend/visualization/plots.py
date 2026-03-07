import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv("data/demand_forecasting_dataset.csv")

plt.figure()
sns.histplot(df['future_demand'],kde=True)
plt.title("Demand Distribution")
plt.show()

plt.figure()
sns.scatterplot(x=df['price'],y=df['future_demand'])
plt.title("Price vs Demand")
plt.show()

plt.figure()
sns.heatmap(df.corr(),annot=True)
plt.title("Feature Correlation")
plt.show()