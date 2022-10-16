from flask import Flask
from api.config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_talisman import Talisman


db = SQLAlchemy()


def create_app(config_class=Config):
    app = Flask(__name__, static_folder='../build', static_url_path='/')
    app.config.from_object(config_class)


    # extensions
    db.init_app(app)


    # blueprints
    from api.game import bp
    app.register_blueprint(bp) 


    @app.route('/')
    def index():
        return app.send_static_file('index.html')


    return app
