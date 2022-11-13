import os

import numpy as np
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine
from tqdm import tqdm

from typecodes import typecodes


def db_engine():
    load_dotenv()
    USER = os.getenv('USER')
    PSWD = os.getenv('PSWD')
    HOST = os.getenv('HOST')
    PORT = os.getenv('PORT')
    NAME = os.getenv('NAME')
    return create_engine(f'postgresql://{USER}:{PSWD}@{HOST}:{PORT}/{NAME}')


def get_aircraft_data():
    url = 'https://opensky-network.org/datasets/metadata/aircraftDatabase.csv'
    return pd.read_csv(url, index_col='registration', usecols=['registration', 'manufacturericao', 'model', 'typecode'])


def generate_tables():
    engine = db_engine()
    df = get_aircraft_data()

    for model, typecode in tqdm(typecodes.items()):
        aircraft = df[df['typecode'].str.contains(typecode, na=False)].dropna()
        aircraft["typecode"] = model  # override typecode column with model name, to normalize data
        aircraft['viable'] = True
        aircraft.to_sql('aircraft', engine, if_exists='append')

        num_planes = aircraft[aircraft.columns[0]].count()  # supposedly faster than just getting len(index)
        planetype = pd.DataFrame({'model': [model], 'num_planes': [num_planes], 'weight': [np.nan]}).set_index('model')
        planetype.to_sql('planetypes', engine, if_exists='append')


def generate_weights():
    engine = db_engine()

    df = pd.read_sql('planetypes', engine, index_col='model')
    df.sort_values(by='num_planes', ascending=False, inplace=True)
    weights = [round(n,3) for n in np.random.uniform(0.34, 0.89, len(df.index))]
    weights.sort(reverse=True)
    df['weight'] = weights

    df.to_sql('planetypes', engine, if_exists='replace')

    for index, row in df.iterrows():
        print(f"'{index}': {row['weight']}{',' if index != df.index[-1] else ''}")


def transfer_data():
    dev = db_engine()
    prod = create_engine(os.getenv('PROD'))

    # aircraft = pd.read_sql('aircraft', dev, index_col='registration')
    # planetypes = pd.read_sql('planetypes', dev, index_col='model')
    quotes = pd.read_sql('quotes', dev, index_col='index')

    # aircraft.to_sql('aircraft', prod, if_exists='replace')
    # planetypes.to_sql('planetypes', prod, if_exists='replace')
    quotes.to_sql('quotes', prod, if_exists='replace')
