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


def main():
    engine = db_engine()
    df = get_aircraft_data()

    for model, typecode in tqdm(typecodes.items()):
        aircraft = df[df['typecode'].str.contains(typecode, na=False)].dropna()
        aircraft["typecode"] = model  # override typecode column with model name, to normalize data
        aircraft.to_sql('aircraft', engine, if_exists='append')

        num_planes = aircraft[aircraft.columns[0]].count()  # supposedly faster than just getting len(index)
        planetypes = pd.DataFrame({'model': [model], 'num_planes': [num_planes], 'weight': [np.nan]}).set_index('model')
        planetypes.to_sql('planetypes', engine, if_exists='append')


if __name__ == "__main__":
    main()


##########

# todo: group df by typcode and sort by count

# todo: write code to generate distribution
# def beta(a, b, size):
#     e = np.random.beta(a, b, size=size)
#     return [round(n,3) for n in e]

# df = pd.read_csv('top_types.csv', index_col='typecode')
# x = beta(3, 3, 15)
# x.sort(reverse=True)
# i = df.index

# for n, index in enumerate(i):
#     print(f"'{i[n]}': {x[n]},")

##########
