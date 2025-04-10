import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const fields = [
  "chest_pain",
  "shortness_of_breath",
  "irregular_heartbeat",
  "fatigue_weakness",
  "dizziness",
  "swelling_edema",
  "pain_neck_jaw_shoulder_back",
  "excessive_sweating",
  "persistent_cough",
  "nausea_vomiting",
  "high_blood_pressure",
  "chest_discomfort_activity",
  "cold_hands_feet",
  "snoring_sleep_apnea",
  "anxiety_feeling_doom",
];

export default function Predict() {
  const [formData, setFormData] = useState({
    age: "",
    ...fields.reduce((acc, field) => ({ ...acc, [field]: 0 }), {})
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? parseInt(value) : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/predict", formData, {
        withCredentials: true
      });
      setResult(response.data);
    } catch (error) {
      console.error("Prediction failed:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-3xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-4">Stroke Risk Prediction</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col">
          Age
          <input type="number" name="age" value={formData.age} onChange={handleChange} className="input" />
        </label>
        {fields.map((field) => (
          <label key={field} className="flex flex-col capitalize">
            {field.replace(/_/g, " ")}
            <select name={field} value={formData[field]} onChange={handleChange} className="input">
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </label>
        ))}
        <button type="submit" className="col-span-full bg-black text-white py-2 rounded-xl mt-4">
          Predict
        </button>
      </form>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 border rounded-xl bg-white shadow"
        >
          <h2 className="text-xl font-semibold">Prediction Result</h2>
          <p className="mt-2 text-green-600">
            Stroke Risk: {result.stroke_risk_percent}%<br />
            At Risk: {result.at_risk ? "Yes" : "No"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
