import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    if os.environ.get('FLASK_ENV') == 'development':
        DB_URI = 'DEV_DB'
    else:
        DB_URI = 'DATABASE_URL'

    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get(DB_URI).replace('postgres://', 'postgresql://')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    