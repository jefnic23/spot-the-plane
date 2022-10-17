import numpy as np
import pandas as pd

from typecodes import typecodes

url = 'https://opensky-network.org/datasets/metadata/aircraftDatabase.csv'
df = pd.read_csv(url)


for typecode in typecodes:
    model = df[df['model'].str.contains(typecode, na=False)][['registration', 'manufacturericao', 'model', 'typecode']].dropna()
    # todo: append to local db
    # model.to_sql()


##########


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