from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import random

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# Temporary storage
parkings = []
bookings = []

# Demo data initialization
def init_demo_data():
    global parkings
    parkings = [
        {
            "id": 1,
            "name": "Anna Nagar Parking",
            "location": "Anna Nagar, Chennai",
            "capacity": 25,
            "available_slots": 15,
            "price": 40,
            "latitude": 13.1695,
            "longitude": 80.2294,
            "demand_level": "high",
            "created_at": datetime.now().isoformat()
        },
        {
            "id": 2,
            "name": "T Nagar Multi Level Garage",
            "location": "T Nagar, Chennai",
            "capacity": 50,
            "available_slots": 20,
            "price": 50,
            "latitude": 13.1423,
            "longitude": 80.2410,
            "demand_level": "medium",
            "created_at": datetime.now().isoformat()
        },
        {
            "id": 3,
            "name": "Velachery Street Parking",
            "location": "Velachery, Chennai",
            "capacity": 15,
            "available_slots": 5,
            "price": 35,
            "latitude": 13.0196,
            "longitude": 80.2424,
            "demand_level": "high",
            "created_at": datetime.now().isoformat()
        },
        {
            "id": 4,
            "name": "Adyar Riverside Lot",
            "location": "Adyar, Chennai",
            "capacity": 30,
            "available_slots": 18,
            "price": 45,
            "latitude": 13.0064,
            "longitude": 80.2427,
            "demand_level": "low",
            "created_at": datetime.now().isoformat()
        }
    ]

init_demo_data()

@app.route('/')
def home():
    return "Flask API Running"

# Add parking
@app.route('/add_parking', methods=['POST'])
def add_parking():
    data = request.get_json()
    name = data.get("name")
    location = data.get("location")
    capacity = data.get("capacity")
    price = data.get("price")
    latitude = data.get("latitude", 13.0827)  # Default to Chennai
    longitude = data.get("longitude", 80.2707)

    # Validation
    if not name or not location or not capacity or not price:
        return jsonify({"error": "All fields are required"}), 400

    try:
        capacity = int(capacity)
        price = float(price)
    except ValueError:
        return jsonify({"error": "Capacity must be a number and price must be valid"}), 400

    new_id = max([p["id"] for p in parkings], default=0) + 1
    new_parking = {
        "id": new_id,
        "name": name,
        "location": location,
        "capacity": capacity,
        "available_slots": capacity,
        "price": price,
        "latitude": latitude,
        "longitude": longitude,
        "demand_level": random.choice(["low", "medium", "high"]),
        "created_at": datetime.now().isoformat()
    }

    parkings.append(new_parking)
    return jsonify({"message": "Parking added successfully", "parking": new_parking}), 201

# Get all parking spots
@app.route('/parking', methods=['GET'])
def get_parkings():
    return jsonify(parkings), 200

# Get parking demand heatmap data
@app.route('/demand_heatmap', methods=['GET'])
def get_demand_heatmap():
    heatmap_data = [
        {
            "location": p["location"],
            "latitude": p["latitude"],
            "longitude": p["longitude"],
            "demand_level": p["demand_level"],
            "intensity": {"low": 0.3, "medium": 0.6, "high": 0.9}[p["demand_level"]]
        } for p in parkings
    ]
    return jsonify(heatmap_data), 200

# Get pricing suggestion
@app.route('/pricing_suggestion', methods=['POST'])
def get_pricing_suggestion():
    data = request.get_json()
    location = data.get("location")
    base_price = data.get("base_price", 40)
    
    # Find parking at this location to check demand
    parking = next((p for p in parkings if p["location"] == location), None)
    
    if not parking:
        return jsonify({"error": "Location not found"}), 404
    
    demand_multiplier = {"low": 0.8, "medium": 1.0, "high": 1.3}[parking["demand_level"]]
    suggested_price = base_price * demand_multiplier
    
    return jsonify({
        "base_price": base_price,
        "demand_level": parking["demand_level"],
        "demand_multiplier": demand_multiplier,
        "suggested_price": round(suggested_price, 2),
        "reason": f"High demand area - surge pricing active" if parking["demand_level"] == "high" else "Standard pricing"
    }), 200

# Book parking spot
@app.route('/book_parking/<int:parking_id>', methods=['POST'])
def book_parking(parking_id):
    data = request.get_json()
    duration = data.get("duration")

    if not duration:
        return jsonify({"error": "Duration is required"}), 400

    parking = next((p for p in parkings if p["id"] == parking_id), None)
    
    if not parking:
        return jsonify({"error": "Parking spot not found"}), 404
    
    if parking["available_slots"] <= 0:
        return jsonify({"error": "No available slots"}), 400

    parking["available_slots"] -= 1
    total_cost = parking["price"] * int(duration)
    
    booking = {
        "id": len(bookings) + 1,
        "parking_id": parking_id,
        "parking_name": parking["name"],
        "duration": int(duration),
        "total_cost": total_cost,
        "booking_time": datetime.now().isoformat(),
        "status": "confirmed"
    }
    
    bookings.append(booking)

    return jsonify({
        "message": "Booking successful",
        "booking": booking,
        "parking": parking,
        "total_cost": total_cost
    }), 200

# Get bookings (with demo payment confirmation)
@app.route('/bookings', methods=['GET'])
def get_bookings():
    return jsonify(bookings), 200

# Demo payment confirmation
@app.route('/payment_confirm', methods=['POST'])
def payment_confirm():
    data = request.get_json()
    booking_id = data.get("booking_id")
    payment_method = data.get("payment_method")
    
    booking = next((b for b in bookings if b["id"] == booking_id), None)
    
    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    
    booking["payment_status"] = "confirmed"
    booking["payment_method"] = payment_method
    booking["payment_time"] = datetime.now().isoformat()
    
    return jsonify({
        "message": "Payment confirmed",
        "booking": booking,
        "transaction_id": f"TXN{booking_id}{random.randint(1000, 9999)}"
    }), 200

# Get analytics data
@app.route('/analytics', methods=['GET'])
def get_analytics():
    total_parkings = len(parkings)
    total_bookings = len(bookings)
    total_revenue = sum(b.get("total_cost", 0) for b in bookings)
    confirmed_bookings = len([b for b in bookings if b.get("payment_status") == "confirmed"])
    
    demand_zones = {
        "high": len([p for p in parkings if p["demand_level"] == "high"]),
        "medium": len([p for p in parkings if p["demand_level"] == "medium"]),
        "low": len([p for p in parkings if p["demand_level"] == "low"])
    }
    
    return jsonify({
        "total_active_parkings": total_parkings,
        "total_bookings": total_bookings,
        "confirmed_bookings": confirmed_bookings,
        "total_revenue": total_revenue,
        "average_booking_value": total_revenue / total_bookings if total_bookings > 0 else 0,
        "demand_zones": demand_zones,
        "total_capacity": sum(p["capacity"] for p in parkings),
        "total_occupied": sum(p["capacity"] - p["available_slots"] for p in parkings)
    }), 200

if __name__ == '__main__':
    app.run(debug=True)