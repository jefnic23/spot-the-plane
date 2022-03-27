from app import db

class Aircraft(db.Model):
    __tablename__ = "aircraft"
    id = db.Column(db.String(), primary_key=True)
    model = db.Column(db.String(), nullable=False)
