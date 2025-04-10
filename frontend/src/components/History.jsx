import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";

const History = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [predictions, setPredictions] = useState([]);
  const [sortBy, setSortBy] = useState("date_desc");

  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/predictions/${user.sub}`);
        setPredictions(res.data);
      } catch (err) {
        console.error("Failed to fetch predictions:", err);
      }
    };

    fetchHistory();
  }, [user, isAuthenticated, isLoading]);

  const sortedPredictions = [...predictions].sort((a, b) => {
    switch (sortBy) {
      case "date_asc":
        return new Date(a.timestamp) - new Date(b.timestamp);
      case "date_desc":
        return new Date(b.timestamp) - new Date(a.timestamp);
      case "risk_asc":
        return a.stroke_risk - b.stroke_risk;
      case "risk_desc":
        return b.stroke_risk - a.stroke_risk;
      default:
        return 0;
    }
  });

  const featureLabels = {
    chest_pain: "Chest Pain",
    shortness_of_breath: "Shortness of Breath",
    irregular_heartbeat: "Irregular Heartbeat",
    fatigue_weakness: "Fatigue & Weakness",
    dizziness: "Dizziness",
    swelling_edema: "Swelling (Edema)",
    pain_neck_jaw_shoulder_back: "Pain in Neck/Jaw/Shoulder/Back",
    excessive_sweating: "Excessive Sweating",
    persistent_cough: "Persistent Cough",
    nausea_vomiting: "Nausea/Vomiting",
    high_blood_pressure: "High Blood Pressure",
    chest_discomfort_activity: "Chest Discomfort (Activity)",
    cold_hands_feet: "Cold Hands/Feet",
    snoring_sleep_apnea: "Snoring/Sleep Apnea",
    anxiety_feeling_doom: "Anxiety/Feeling of Doom",
    age: "Age"
  };

  if (!isAuthenticated) {
    return <p className="text-center mt-10 text-gray-600">Please log in to view your history.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">📖 Prediction History</h1>

      <div className="flex justify-end mb-4">
        <select
          className="input"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="risk_desc">Highest Risk</option>
          <option value="risk_asc">Lowest Risk</option>
        </select>
      </div>

      {predictions.length === 0 ? (
        <p className="text-center text-gray-500">No predictions found yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedPredictions.map((prediction, index) => (
            <motion.div
              key={index}
              className="card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <h2 className="text-lg font-semibold mb-2 text-blue-600">
                Prediction #{index + 1}
              </h2>
              <p><strong>Stroke Risk:</strong> {prediction.stroke_risk_percent}%</p>
              <p><strong>At Risk:</strong> {prediction.at_risk ? "Yes" : "No"}</p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                {Object.entries(featureLabels).map(([key, label]) => (
                  <div key={key} className="flex justify-between">
                    <span>{label}:</span>
                    <span className="font-medium">{prediction[key]}</span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs text-gray-500">
                <strong>Submitted:</strong> {new Date(prediction.created_at).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
