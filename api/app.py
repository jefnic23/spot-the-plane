from flask import Flask
from api.config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_talisman import Talisman

db = SQLAlchemy()
talisman = Talisman()


def create_app(config_class=Config):
    app = Flask(__name__, static_folder='../build', static_url_path='/')
    app.config.from_object(config_class)

    # extensions
    db.init_app(app)
    talisman.init_app(app, content_security_policy=None)

    # blueprints
    from api.game import bp
    app.register_blueprint(bp)    

    return app
