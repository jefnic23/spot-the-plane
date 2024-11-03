import os
import re

import pandas as pd
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from sqlalchemy import create_engine


def db_engine():
    load_dotenv()
    USER = os.getenv("USER")
    PSWD = os.getenv("PSWD")
    HOST = os.getenv("HOST")
    PORT = os.getenv("PORT")
    NAME = os.getenv("NAME")
    return create_engine(f"postgresql://{USER}:{PSWD}@{HOST}:{PORT}/{NAME}")


def get_data():
    url = "https://www.aviationquotations.com/quotes.html"
    content = requests.get(url).content
    soup = BeautifulSoup(content, "html.parser")

    # there's a quote missing the appropriate classname
    parent = soup.find(class_="containerfpage")
    missing = parent.select("p:nth-child(356)")
    missing[0]["class"] = "quote"

    quotes = soup.find_all(class_=["quote", "dash"])
    data = {"quote": [], "author": []}
    for quote, author in zip(quotes[::2], quotes[1::2]):
        if len(quote.text.strip()) <= 250:
            data["quote"].append(quote.text.strip())
            data["author"].append(re.split("[,—]", author.text)[0].strip())
    return pd.DataFrame(data, columns=data.keys())


def populate_table():
    engine = db_engine()
    data = get_data()
    data.to_sql("quotes", engine, if_exists="replace")


if __name__ == "__main__":
    populate_table()
