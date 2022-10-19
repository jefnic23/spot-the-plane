from api.app import db


class Aircraft(db.Model):
    __tablename__ = "aircraft"
    registration = db.Column(db.String(), primary_key=True)
    manufacturericao = db.Column(db.String(), nullable=False)
    model = db.Column(db.String(), nullable=False)
    typecode = db.Column(db.String(), nullable=False)
    viable = db.Column(db.Boolean, nullable=False, default=True)


class PlaneTypes(db.Model):
    __tablename__ = "planetypes"
    model = db.Column(db.String(), primary_key=True)
    num_planes = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Float, nullable=True)
