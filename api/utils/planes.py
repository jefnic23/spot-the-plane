import os
import random
import time

import numpy as np
import pandas as pd
import requests
from dotenv import load_dotenv
from sqlalchemy import create_engine, Boolean, Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
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

    aircraft = pd.read_sql('aircraft', dev, index_col='registration')
    # planetypes = pd.read_sql('planetypes', dev, index_col='model')
    # quotes = pd.read_sql('quotes', dev, index_col='index')

    aircraft.to_sql('aircraft', prod, if_exists='replace')
    # planetypes.to_sql('planetypes', prod, if_exists='replace')
    # quotes.to_sql('quotes', prod, if_exists='replace')


def check_plane_viability():
    # planespotters.net api
    BASE_URL = 'https://api.planespotters.net/pub/photos/reg/'
    HEADERS  = {'user-agent': 'spottheplane'}

    BASE = declarative_base()
    class Aircraft(BASE):
        __tablename__ = "aircraft"
        registration = Column(String(), primary_key=True)
        manufacturericao = Column(String(), nullable=False)
        model = Column(String(), nullable=False)
        typecode = Column(String(), nullable=False)
        viable = Column(Boolean, nullable=False, default=True)

    engine = db_engine()
    
    with Session(engine) as session:
        with session.begin():
            rows = session.query(Aircraft).filter_by(typecode = "DC-3").all()
            for row in tqdm(rows):
                url = f'{BASE_URL}{row.registration}'
                res = requests.get(url, headers=HEADERS)
                if res.status_code not in [200, 201]:
                    res.raise_for_status()
                else:
                    if not res.json()['photos']:
                        row.viable = False
                time.sleep(random.uniform(1, 3)) 
            session.commit()
        

if __name__ == '__main__':
    transfer_data()
