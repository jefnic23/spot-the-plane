from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

# from api.config import Config

db = Session()


def create_app():
    app = FastAPI()
    app.mount('/', StaticFiles(directory='build/'), name='static')
    # app.config.from_object(config_class)
    

    # blueprints
    from api.routes import router
    app.include_router(router)


    @app.get('/')
    def index():
        return app.send_static_file('index.html')


    return app
