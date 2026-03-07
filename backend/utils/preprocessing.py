import pandas as pd
from sklearn.preprocessing import LabelEncoder

def load_data(path):
    df = pd.read_csv(path)
    return df


def preprocess_data(df):

    df = df.dropna()

    label = LabelEncoder()

    if 'supplier' in df.columns:
        df['supplier'] = label.fit_transform(df['supplier'])

    if 'route' in df.columns:
        df['route'] = label.fit_transform(df['route'])

    return df