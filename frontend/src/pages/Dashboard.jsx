// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

const COLORS = ["#00C49F", "#FF8042"];

const Dashboard = () => {
  const [stats, setStats] = useState({
    monthly_counts: [],
    at_risk_counts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5001/api/predictions/stats")
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl">Loading...</span>
      </div>
    );
  }

  // Monthly stats for bar chart
  const monthlyData = stats.monthly_counts;

  // Pie chart data for risk status (At Risk vs Not At Risk)
  const pieData = stats.at_risk_counts.map((entry) => ({
    name: entry['At Risk'] ? 'At Risk' : 'Not At Risk',
    value: entry.Count
  }));

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">📊 Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Monthly Predictions Bar Chart */}
        <div className="bg-white shadow-xl p-4 rounded-2xl">
          <h3 className="font-semibold mb-2">Monthly Predictions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Pie Chart */}
        <div className="bg-white shadow-xl p-4 rounded-2xl">
          <h3 className="font-semibold mb-2">At Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                data={pieData}
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
