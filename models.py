from datetime import datetime
from extensions import db  

class Coupon(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    claimed = db.Column(db.Boolean, default=False)
    claims = db.relationship('CouponClaim', backref='coupon', lazy=True)

class CouponClaim(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    coupon_id = db.Column(db.Integer, db.ForeignKey('coupon.id'), nullable=False)
    ip_address = db.Column(db.String(45), nullable=False)
    session_id = db.Column(db.String(32), nullable=False)
    claimed_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
