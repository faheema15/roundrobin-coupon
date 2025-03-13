import os
import logging
from datetime import datetime, timedelta
from flask import Flask, render_template, request, session, jsonify
from extensions import db  

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configuration
app.secret_key = os.environ.get("SESSION_SECRET", "default-secret-key")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///coupons.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["CLAIM_TIMEOUT"] = 3600  # 1 hour in seconds

db.init_app(app)

# Import models AFTER db is initialized
from models import Coupon, CouponClaim

# Track the last reset date (global)
LAST_RESET_DATE = None

def reset_coupons_daily():
    global LAST_RESET_DATE
    today = datetime.utcnow().date()

    if LAST_RESET_DATE != today:
        try:
            logger.info(f"Resetting coupons for a new day: {today}")
            # Reset all coupons to unclaimed
            Coupon.query.update({Coupon.claimed: False})
            db.session.commit()

            LAST_RESET_DATE = today
            logger.info("Coupons successfully reset.")
        except Exception as e:
            logger.error(f"Failed to reset coupons: {str(e)}")
            db.session.rollback()

@app.before_request
def before_request():
    if not session.get('session_id'):
        session['session_id'] = os.urandom(16).hex()

    #Call reset daily function before each request
    reset_coupons_daily()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/claim-coupon', methods=['POST'])
def claim_coupon():
    ip_address = request.remote_addr
    session_id = session.get('session_id')
    
    ip_claim = CouponClaim.query.filter_by(ip_address=ip_address).order_by(CouponClaim.claimed_at.desc()).first()
    if ip_claim:
        time_diff = datetime.utcnow() - ip_claim.claimed_at
        if time_diff < timedelta(seconds=app.config["CLAIM_TIMEOUT"]):
            remaining_time = app.config["CLAIM_TIMEOUT"] - int(time_diff.total_seconds())
            return jsonify({
                'success': False,
                'message': f'Please wait {remaining_time//60} minutes and {remaining_time%60} seconds before claiming another coupon'
            })

    session_claim = CouponClaim.query.filter_by(session_id=session_id).order_by(CouponClaim.claimed_at.desc()).first()
    if session_claim:
        time_diff = datetime.utcnow() - session_claim.claimed_at
        if time_diff < timedelta(seconds=app.config["CLAIM_TIMEOUT"]):
            remaining_time = app.config["CLAIM_TIMEOUT"] - int(time_diff.total_seconds())
            return jsonify({
                'success': False,
                'message': f'Please wait {remaining_time//60} minutes and {remaining_time%60} seconds before claiming another coupon'
            })

    unclaimed_coupon = Coupon.query.filter_by(claimed=False).first()
    if not unclaimed_coupon:
        return jsonify({
            'success': False,
            'message': 'No coupons available at the moment'
        })

    try:
        claim = CouponClaim(
            coupon_id=unclaimed_coupon.id,
            ip_address=ip_address,
            session_id=session_id
        )
        unclaimed_coupon.claimed = True
        db.session.add(claim)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Successfully claimed coupon: {unclaimed_coupon.code}'
        })
    except Exception as e:
        logger.error(f"Error claiming coupon: {str(e)}")
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'An error occurred while claiming the coupon'
        })

with app.app_context():
    db.create_all()
    
    if not Coupon.query.first():
        coupons = [
            Coupon(code=f"COUPON{i}", claimed=False)
            for i in range(1, 101)
        ]
        db.session.bulk_save_objects(coupons)
        db.session.commit()
