from flask import Flask
from config import Config
from flask_talisman import Talisman
from flask_seasurf import SeaSurf
from flask_sqlalchemy import SQLAlchemy
from flask_bootstrap import Bootstrap5

app = Flask(__name__)
app.config.from_object(Config)
Talisman(app, content_security_policy=None)
csrf = SeaSurf(app)
db = SQLAlchemy(app)
bootstrap = Bootstrap5(app)

from app import routes, models
