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
        aircraft.to_sql('aircraft', engine, if_exists='append')

        num_planes = aircraft[aircraft.columns[0]].count()  # supposedly faster than just getting len(index)
        planetypes = pd.DataFrame({'model': [model], 'num_planes': [num_planes], 'weight': [np.nan]}, 'viable': True).set_index('model')
        planetypes.to_sql('planetypes', engine, if_exists='append')


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


if __name__ == '__main__':
    # todo: combine these two functions; in generate_tables, first check if table exists and delete if it does
    # todo: write function that prints model: weight for copying into planes.py
    # todo: write function that copies data to production db

    generate_tables()
    generate_weights()
