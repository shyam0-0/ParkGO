import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function FindParking() {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [showMap, setShowMap] = useState(true);
  const [mapCenter] = useState([13.0827, 80.2707]); // Chennai center
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookingCost, setBookingCost] = useState(0);

  useEffect(() => {
    fetchParkingSpots();
    fetchHeatmapData();
  }, []);

  const fetchParkingSpots = () => {
    axios.get("http://localhost:5000/parking")
      .then(response => {
        setParkingSpots(response.data);
        setFilteredSpots(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching parking data:", error);
        setError("Failed to load parking spots");
        setLoading(false);
      });
  };

  const fetchHeatmapData = () => {
    axios.get("http://localhost:5000/demand_heatmap")
      .then(response => setHeatmapData(response.data))
      .catch(error => console.error("Error fetching heatmap:", error));
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchLocation(value);

    if (value === "") {
      setFilteredSpots(parkingSpots);
    } else {
      const filtered = parkingSpots.filter(spot =>
        spot.name.toLowerCase().includes(value) ||
        spot.location.toLowerCase().includes(value)
      );
      setFilteredSpots(filtered);
    }
  };

  const handleBooking = (spot) => {
    setError("");
    setBookingSuccess("");

    if (!duration || duration <= 0) {
      setError("Please enter a valid duration in hours");
      return;
    }

    if (spot.available_slots <= 0) {
      setError("No available slots at this location");
      return;
    }

    // Calculate cost and show payment modal
    const cost = spot.price * parseInt(duration);
    setCurrentBooking(spot);
    setBookingCost(cost);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = (paymentMethod, cardDetails) => {
    if (!currentBooking) return;
    
    setError("");
    
    // First create booking
    axios.post(`http://localhost:5000/book_parking/${currentBooking.id}`, { duration: parseInt(duration) })
      .then(res => {
        const bookingId = res.data.booking.id;
        
        // Then process payment
        axios.post("http://localhost:5000/payment_confirm", {
          booking_id: bookingId,
          payment_method: paymentMethod,
          amount: bookingCost
        })
        .then(paymentRes => {
          const txnId = paymentRes.data.transaction_id;
          setBookingSuccess(
            `✅ Payment successful! Booking confirmed!\nTransaction ID: ${txnId}`
          );
          setShowPaymentModal(false);
          setSelectedSpot(null);
          setDuration("");
          setTimeout(() => setBookingSuccess(""), 5000);
          fetchParkingSpots();
        })
        .catch(err => {
          setError("Payment failed: " + (err.response?.data?.error || "Unknown error"));
        });
      })
      .catch(err => {
        setError("Booking failed: " + (err.response?.data?.error || "Unknown error"));
      });
  };

  const getDemandColor = (level) => {
    return {
      low: "#10b981",
      medium: "#f59e0b",
      high: "#ef4444"
    }[level] || "#gray";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Find Parking Near You
          </h1>
          <p className="text-xl text-gray-600">
            Discover and book available parking spaces in real-time with live demand heatmaps
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 rounded-lg text-red-700 flex items-start gap-3">
            <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {bookingSuccess && (
          <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 rounded-lg text-green-700 flex items-start gap-3">
            <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{bookingSuccess}</span>
          </div>
        )}

        {/* Toggle View Buttons */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setShowMap(true)}
            className={`px-6 py-2 rounded-lg font-semibold transition ${showMap ? "bg-blue-600 text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
          >
            📍 Map View
          </button>
          <button
            onClick={() => setShowMap(false)}
            className={`px-6 py-2 rounded-lg font-semibold transition ${!showMap ? "bg-blue-600 text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
          >
            📋 List View
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search by Location or Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Anna Nagar, Downtown..."
                  value={searchLocation}
                  onChange={handleSearch}
                  className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                />
              </div>
              <div className="flex items-end">
                <button 
                  onClick={() => {
                    fetchParkingSpots();
                    fetchHeatmapData();
                  }}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-105"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map View */}
        {showMap && (
          <div className="mb-8 rounded-xl shadow-xl overflow-hidden">
            {loading ? (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600">Loading map...</p>
                </div>
              </div>
            ) : (
              <MapContainer center={mapCenter} zoom={13} style={{ height: "500px", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                
                {/* Demand Heatmap Circles */}
                {heatmapData.map((data, idx) => (
                  <Circle
                    key={`heatmap-${idx}`}
                    center={[data.latitude, data.longitude]}
                    radius={500}
                    pathOptions={{
                      color: getDemandColor(data.demand_level),
                      fillColor: getDemandColor(data.demand_level),
                      fillOpacity: data.intensity * 0.3,
                      weight: 2
                    }}
                  >
                    <Popup>
                      <div className="text-sm">
                        <strong>Demand: {data.demand_level.toUpperCase()}</strong>
                      </div>
                    </Popup>
                  </Circle>
                ))}

                {/* Parking Markers */}
                {(filteredSpots.length > 0 ? filteredSpots : parkingSpots).map((spot) => (
                  <Marker
                    key={spot.id}
                    position={[spot.latitude, spot.longitude]}
                    onClick={() => setSelectedSpot(spot)}
                  >
                    <Popup className="w-64">
                      <div className="w-64">
                        <h3 className="font-bold text-sm mb-2">{spot.name}</h3>
                        <p className="text-xs text-gray-600 mb-2">📍 {spot.location}</p>
                        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                          <div className="text-center">
                            <p className="text-gray-600">Available</p>
                            <p className="font-bold text-green-600">{spot.available_slots}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">Total</p>
                            <p className="font-bold">{spot.capacity}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">₹/hr</p>
                            <p className="font-bold text-blue-600">{spot.price}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedSpot(spot)}
                          className="w-full bg-blue-600 text-white text-xs font-semibold py-2 rounded hover:bg-blue-700 transition"
                        >
                          Book Now
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
        )}

        {/* Demand Legend */}
        {showMap && (
          <div className="mb-8 bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-900 mb-4">📊 Demand Heatmap Legend</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-400 rounded-full border-2 border-green-600"></div>
                <span className="text-gray-700 font-medium">Low Demand</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-600"></div>
                <span className="text-gray-700 font-medium">Medium Demand</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-400 rounded-full border-2 border-red-600"></div>
                <span className="text-gray-700 font-medium">High Demand</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">Higher demand areas show surge pricing (up to 30% increase)</p>
          </div>
        )}

        {/* List View */}
        {!showMap && (
          <>
            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-700">
                Found <span className="text-blue-600">{filteredSpots.length || parkingSpots.length}</span> parking spot{(filteredSpots.length || parkingSpots.length) !== 1 ? "s" : ""}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600 font-medium">Loading parking spots...</p>
                </div>
              </div>
            ) : filteredSpots.length === 0 && searchLocation ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.528 9.99h2.242c.978 0 1.767.79 1.767 1.768v.264a8.973 8.973 0 01-2.09 5.677l-.016.02a8.986 8.986 0 01-3.09 2.412.75.75 0 11-.562-1.4 7.486 7.486 0 002.574-2.007 7.474 7.474 0 001.74-4.722v-.244c0-.42-.341-.76-.761-.76h-2.242a.75.75 0 010-1.5zm-11.056 0c-.978 0-1.768.79-1.768 1.768v.244a7.474 7.474 0 001.74 4.722 7.486 7.486 0 002.574 2.007.75.75 0 01-.563 1.4 8.986 8.986 0 01-3.09-2.412l-.016-.02a8.973 8.973 0 01-2.09-5.677v-.264c0-.978.79-1.768 1.768-1.768h2.242a.75.75 0 010 1.5H6.472z" />
                </svg>
                <h3 className="mt-4 text-xl font-bold text-gray-900">No Parking Found</h3>
                <p className="text-gray-600 mt-2">Try searching with different keywords</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(filteredSpots.length > 0 ? filteredSpots : parkingSpots).map((spot) => (
                  <div key={spot.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105 overflow-hidden">
                    {/* Card Header - Color based on demand */}
                    <div className={`h-32 flex items-center justify-center text-white ${spot.demand_level === "high" ? "bg-gradient-to-r from-red-500 to-red-600" : spot.demand_level === "medium" ? "bg-gradient-to-r from-yellow-500 to-yellow-600" : "bg-gradient-to-r from-green-500 to-green-600"}`}>
                      <div className="text-center">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 3a2 2 0 00-2 2v6h6V5a2 2 0 00-2-2H5zm6 0a2 2 0 00-2 2v6h6V5a2 2 0 00-2-2h-2zm0 13a1 1 0 100-2 1 1 0 000 2z" />
                        </svg>
                        <p className="font-bold text-sm">Demand: {spot.demand_level.toUpperCase()}</p>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{spot.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {spot.location}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-4 py-4 border-y border-gray-100">
                        <div className="text-center">
                          <p className="text-gray-600 text-xs font-medium">Available</p>
                          <p className="text-xl font-bold text-green-600">{spot.available_slots}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600 text-xs font-medium">Total</p>
                          <p className="text-xl font-bold text-gray-900">{spot.capacity}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600 text-xs font-medium">Price/hr</p>
                          <p className="text-xl font-bold text-blue-600">₹{parseFloat(spot.price).toFixed(0)}</p>
                        </div>
                      </div>

                      {/* Action Button */}
                      {spot.available_slots > 0 && (
                        <button
                          onClick={() => setSelectedSpot(spot)}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
                        >
                          Book Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Booking Modal */}
        {selectedSpot && !showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-in">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Book {selectedSpot.name}
                </h2>
                <p className="text-gray-600 mt-1">{selectedSpot.location}</p>
              </div>

              {/* Booking Details */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-700">Price per hour:</span>
                  <span className="font-bold">₹{parseFloat(selectedSpot.price).toFixed(2)}</span>
                </div>
                
                {duration && (
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-gray-700">Total cost ({duration}hr):</span>
                    <span className="font-bold text-lg text-blue-600">
                      ₹{(selectedSpot.price * duration).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Duration Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Enter hours"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedSpot(null);
                    setDuration("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleBooking(selectedSpot)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Payment Modal */}
        {showPaymentModal && currentBooking && (
          <PaymentModal
            booking={currentBooking}
            amount={bookingCost}
            duration={duration}
            onPaymentSuccess={handlePaymentConfirm}
            onCancel={() => {
              setShowPaymentModal(false);
              setSelectedSpot(null);
              setDuration("");
            }}
          />
        )}
      </div>
    </div>
  );
}

// Payment Modal Component
function PaymentModal({ booking, amount, duration, onPaymentSuccess, onCancel }) {
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    if (!cardName.trim() || cardNumber.length < 10) {
      alert("Please enter valid card details");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess(paymentMethod, { cardNumber, cardName });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
        
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h2>
        <p className="text-gray-600 mb-6">Secure payment for {booking.name}</p>

        {/* Amount Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
          <div className="flex justify-between mb-3">
            <span className="text-gray-700">Booking Amount:</span>
            <span className="font-bold">₹{parseFloat(booking.price).toFixed(2)} × {duration} hr</span>
          </div>
          <div className="flex justify-between border-t border-blue-200 pt-3">
            <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
            <span className="text-2xl font-bold text-blue-600">₹{amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Payment Method
          </label>
          <div className="space-y-2">
            {["credit", "debit", "upi", "wallet"].map(method => (
              <label key={method} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="ml-3 font-medium text-gray-700 capitalize">
                  {method === "credit" && "💳 Credit Card"}
                  {method === "debit" && "🏧 Debit Card"}
                  {method === "upi" && "📱 UPI"}
                  {method === "wallet" && "👛 Digital Wallet"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Card Details */}
        {(paymentMethod === "credit" || paymentMethod === "debit") && (
          <div className="mb-6 space-y-3">
            <input
              type="text"
              placeholder="Cardholder Name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').slice(0, 16))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="MM/YY"
                maxLength="5"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="CVV"
                maxLength="3"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-xs text-blue-800">
            🔒 <strong>Secure Payment:</strong> This is a demo payment. No real transaction will occur.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              `Pay ₹${amount.toFixed(2)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FindParking;