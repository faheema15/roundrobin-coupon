Round-Robin Coupon Distribution System

A web application that distributes coupons to guests in a round-robin fashion with built-in abuse prevention mechanisms.

🔗 **Live Demo**: [https://roundrobin-coupon.onrender.com/](https://roundrobin-coupon.onrender.com/)

---

## 📝 Overview

This application allows users to claim coupons **without requiring a login or account creation**. The system implements **multiple layers of protection** to prevent users from claiming multiple coupons within a restricted time frame, ensuring fair distribution among all users.

---

## 🚀 Features

- 🔄 **Sequential Coupon Distribution**: Coupons are assigned in a round-robin manner
- 👤 **Guest Access**: No login or account creation required
- 🕛 **Daily Reset**: All coupons are reset to unclaimed status each day
- 🔐 **Abuse Prevention**:
  - 🌐 IP address tracking to prevent multiple claims from the same network
  - 🍪 Session tracking via cookies to prevent multiple claims from the same browser
  - ⏳ Enforced cool-down period between claims (1 hour by default)
- 💡 **Clear User Feedback**: Informative messages about remaining wait time before the next claim

---

## 💻 System Requirements

- 🐍 Python 3.7 or higher
- ⚙️ Flask
- 🗄️ SQLAlchemy
- 🗃️ SQLite (for development)

---

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/faheema15/roundrobin-coupon.git
   cd roundrobin-coupon
   ```

2. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the application:
   ```bash
   python main.py
   ```

   ➡️ **Note**: The SQLite database (`coupons.db`) will be automatically created in the `instance` folder the first time you run the application. The database will be pre-populated with **100 coupon codes**.

---

## 🗂️ Project Structure

```
coupon-claim/
├── instance/
│   └── coupons.db          # SQLite database (auto-created)
├── static/
│   ├── css/                # CSS files
│   ├── images/             # Image resources
│   └── js/
│       └── main.js         # Client-side JavaScript
├── templates/
│   ├── base.html           # Base template
│   └── index.html          # Main application page
├── app.py                  # Main application logic
├── extensions.py           # Flask extensions
├── main.py                 # Entry point for running the application
├── models.py               # Database models
├── Procfile                # For deployment (e.g., Heroku/Render)
└── requirements.txt        # Project dependencies
```

---

## 🗄️ Database Models

The application uses two main models:

1. **Coupon** 🎟️  
   Stores available coupon codes
   - `id`: Primary key
   - `code`: Unique coupon code
   - `claimed`: Boolean flag indicating if the coupon has been claimed

2. **CouponClaim** 📝  
   Records when and by whom coupons are claimed
   - `id`: Primary key
   - `coupon_id`: Foreign key to Coupon
   - `ip_address`: IP address of the claim
   - `session_id`: Browser session identifier
   - `claimed_at`: Timestamp of the claim

---

## 🛠️ Usage

1. Start the application:
   ```bash
   python main.py
   ```

2. Open your web browser 🌐 and go to:  
   `http://localhost:5000`

3. Click the **"Claim Coupon"** button to receive a coupon 🎉

---

## 🛡️ Abuse Prevention Implementation

The application implements multiple layers of protection:

1. **IP Address Tracking** 🌐  
   - Records the IP address of each user when they claim a coupon  
   - Prevents users from the same IP address from claiming multiple coupons within the cooldown period  
   - Implemented in the `/claim-coupon` route in `app.py`

2. **Cookie/Session Tracking** 🍪  
   - Creates a unique session ID for each browser instance  
   - Stores the session ID in the user's browser as a cookie  
   - Prevents the same browser from claiming multiple coupons  
   - Implemented using Flask's session management

3. **Time Restrictions** ⏱️  
   - Enforces a one-hour (configurable) waiting period between claims  
   - Calculates and displays the remaining wait time to users  
   - Configured via the `CLAIM_TIMEOUT` parameter in `app.py`

4. **Daily Reset** 🔄  
   - All coupons are reset to an unclaimed state at the beginning of each day  
   - Implemented in the `reset_coupons_daily` function that runs before each request

---

## 🚀 Deployment

### Deployment to Render 🌐

1. Create an account on [Render](https://render.com/) if you don't have one
2. From the Render dashboard, click **"New"** and select **"Web Service"**
3. Connect your GitHub repository or use the **"Public Git repository"** option
4. Configure your web service:
   - **Name**: `roundrobin-coupon`
   - **Runtime**: Python 3
   - **Build Command**:  
     ```bash
     pip install -r requirements.txt
     ```
   - **Start Command**:  
     ```bash
     gunicorn main:app
     ```
5. Set environment variables:  
   - Go to **Advanced** > **Add Environment Variable**  
   - Add `SESSION_SECRET` with a secure value 🔑
6. Click **"Create Web Service"**

---

## 🧪 Testing

You can test the application's abuse prevention mechanisms by:

1. 🕒 Trying to claim multiple coupons within the cooldown period  
2. 🌐 Trying to claim from different browsers on the same IP  
3. 🧹 Clearing cookies and attempting to claim again  
4. 🌍 Using a VPN to change your IP and attempting to claim again

---

## ⚙️ Configuration Options

The following settings can be adjusted in `app.py`:

- `CLAIM_TIMEOUT` ⏱️: Time in seconds between allowed claims (default: `3600` seconds)  
- `SESSION_SECRET` 🔑: Secret key for securing session cookies  
- `SQLALCHEMY_DATABASE_URI` 🗃️: Database connection string  

---
