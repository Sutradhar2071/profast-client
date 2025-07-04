import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const TrackPackage = () => {
  const [trackingId, setTrackingId] = useState("");
  const [parcel, setParcel] = useState(null);
  const [error, setError] = useState("");

  const axiosSecure = useAxiosSecure();

  const handleSearch = async () => {
    if (!trackingId) return;
    try {
      setError("");
      const res = await axiosSecure.get(`/track/${trackingId}`);
      setParcel(res.data);
    } catch (err) {
      setParcel(null);
      setError("❌ Parcel not found with this tracking ID.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">🔍 Track Your Parcel</h2>

      <input
        type="text"
        value={trackingId}
        onChange={(e) => setTrackingId(e.target.value)}
        placeholder="Enter your tracking ID"
        className="input input-bordered w-full"
      />
      <button onClick={handleSearch} className="btn btn-primary w-full">
        Track
      </button>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {parcel && (
        <div className="bg-base-100 p-4 rounded mt-4 border">
          <h3 className="font-bold text-lg">📦 {parcel.title}</h3>
          <p>
            <strong>Status:</strong>{" "}
            <span className="badge">{parcel.status}</span>
          </p>
          <p>
            <strong>Type:</strong> {parcel.type}
          </p>
          <p>
            <strong>Tracking ID:</strong> {parcel.trackingId}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(parcel.creation_date).toLocaleString()}
          </p>
          <p>
            <strong>From:</strong> {parcel.senderRegion} ➡{" "}
            {parcel.receiverRegion}
          </p>
        </div>
      )}
    </div>
  );
};

export default TrackPackage;
