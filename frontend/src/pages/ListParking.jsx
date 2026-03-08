import { useState, useEffect } from "react";
import axios from "axios";

function ListParking() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  const [suggestedDemand, setSuggestedDemand] = useState(null);

  // Fetch parking list from backend on page load
  useEffect(() => {
    fetchParkings();
  }, []);

  const fetchParkings = () => {
    axios.get("http://localhost:5000/parking")
      .then(res => setParkings(res.data))
      .catch(err => {
        console.error("Error fetching parkings:", err);
        setError("Failed to load parkings");
      });
  };

  const fetchPriceSuggestion = (loc) => {
    if (!loc.trim()) {
      setSuggestedPrice(null);
      setSuggestedDemand(null);
      return;
    }
    axios.post("http://localhost:5000/pricing_suggestion", { location: loc })
      .then(res => {
        setSuggestedPrice(res.data.suggested_price);
        setSuggestedDemand(res.data.demand_level);
      })
      .catch(err => console.error("Error fetching price suggestion:", err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!name.trim() || !location.trim() || !capacity || !price) {
      setError("Please fill all fields");
      return;
    }

    if (isNaN(capacity) || capacity <= 0) {
      setError("Capacity must be a positive number");
      return;
    }

    if (isNaN(price) || price <= 0) {
      setError("Price must be a positive number");
      return;
    }

    setLoading(true);
    axios.post("http://localhost:5000/add_parking", { 
      name: name.trim(), 
      location: location.trim(), 
      capacity: parseInt(capacity),
      price: parseFloat(price)
    })
      .then(res => {
        setSuccess("Parking added successfully!");
        setParkings([...parkings, res.data.parking]);
        setName("");
        setLocation("");
        setCapacity("");
        setPrice("");
        setTimeout(() => setSuccess(""), 3000);
      })
      .catch(err => {
        setError(err.response?.data?.error || "Error adding parking");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Parking Management
          </h1>
          <p className="text-lg text-gray-600">
            List your parking spaces and start earning
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg text-red-700 flex items-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg text-green-700 flex items-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Parking</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Parking Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Parking Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Downtown Garage"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 123 Main Street"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      fetchPriceSuggestion(e.target.value);
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Spaces
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 10"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    min="1"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price Per Hour (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 50"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    step="0.01"
                    min="0.01"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* AI Price Suggestion */}
                {suggestedPrice && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-amber-900 mb-1">
                          🤖 AI Price Suggestion
                        </p>
                        <p className="text-2xl font-bold text-amber-700">₹{suggestedPrice.toFixed(2)}/hr</p>
                        <p className="text-xs text-amber-600 mt-1">
                          Based on <span className="font-semibold capitalize">{suggestedDemand}</span> demand in this area
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrice(suggestedPrice.toString())}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {loading ? "Adding..." : "Add Parking Space"}
                </button>
              </form>
            </div>
          </div>

          {/* Parking List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Active Listings
                </h2>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                  {parkings.length}
                </span>
              </div>

              {parkings.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m0-6H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2z" />
                  </svg>
                  <p className="mt-4 text-gray-500 font-medium">No parking spaces listed yet</p>
                  <p className="text-gray-400 text-sm">Add your first parking space using the form on the left</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {parkings.map((p) => (
                    <div 
                      key={p.id} 
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                          <p className="text-gray-500 text-sm mt-1">
                            📍 {p.location}
                          </p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                          ₹{parseFloat(p.price).toFixed(2)}/hr
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-gray-600 text-sm">Total Spaces</p>
                          <p className="text-xl font-bold text-gray-900">{p.capacity}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Available</p>
                          <p className="text-xl font-bold text-green-600">{p.available_slots || p.capacity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ListParking;