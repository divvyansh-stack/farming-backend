import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [history, setHistory] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/farm-data/history?days=7")
      .then(res => res.json())
      .then(data => setHistory(data.history))
      .catch(err => console.error("Error fetching history:", err));
  }, []);

  if (!history) return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'80vh', fontSize: '1.3rem'}}>
      Loading...
    </div>
  );

  const labels = history.map(entry => entry.date).reverse();
  const cropHealthScores = history.map(entry => entry.crop_health.score).reverse();
  const soilMoisture = history.map(entry => entry.soil_condition.moisture).reverse();
  const pestProbabilities = history.map(entry => entry.pest_risk.probability).reverse();
  const issues = history.filter(h => h.crop_health.score < 50 || h.pest_risk.probability > 0.7);
  const isMobile = window.innerWidth < 600;

  const data = {
    labels,
    datasets: [
      { label: "Crop Health Score", data: cropHealthScores, borderColor: "green", backgroundColor: "rgba(0,128,0,0.3)", yAxisID: 'y1', tension: 0.3, fill: true },
      { label: "Soil Moisture (%)", data: soilMoisture, borderColor: "blue", backgroundColor: "rgba(0,0,255,0.3)", yAxisID: 'y2', tension: 0.3, fill: true },
      { label: "Pest Risk Probability", data: pestProbabilities, borderColor: "red", backgroundColor: "rgba(255,0,0,0.3)", yAxisID: 'y3', tension: 0.3, fill: true }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 16 } } },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#222',
        titleColor: '#fff',
        bodyColor: '#eee',
        borderColor: '#aaa',
        borderWidth: 1,
      },
    },
    elements: { line: { tension: 0.3 }, point: { radius: 5 } },
    scales: {
      y1: { type: 'linear', position: 'left', min: 0, max: 100, title: { display: true, text: 'Health Score' } },
      y2: { type: 'linear', position: 'right', min: 0, max: 50, grid: { drawOnChartArea:false }, title: { display: true, text: 'Soil Moisture (%)' } },
      y3: { type: 'linear', position: 'right', min: 0, max: 1, grid: { drawOnChartArea:false }, title: { display: true, text:'Pest Risk Probability' } }
    },
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', Arial, sans-serif",
      maxWidth: 1000,
      margin: "40px auto",
      padding: "16px",
      background: "linear-gradient(120deg, #f0f4f9 50%, #e0f7fa 100%)",
      borderRadius: "16px",
      boxShadow: "0 4px 20px #ddd",
      textAlign: "center"
    }}>
      <h1>Farmer Dashboard</h1>
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: isMobile ? "15px" : "30px",
        marginBottom: "30px",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center"
      }}>
        <div style={{ padding:"18px 28px", background:"#e3fcec", borderRadius:"10px", boxShadow:"0 2px 8px #abcebc", color:"#1b4727", minWidth: "150px"}}>
          <h3>{history[0].crop_health.status}</h3>
          <div><strong>Crop Health Score:</strong> {history[0].crop_health.score}</div>
        </div>
        <div style={{ padding:"18px 28px", background:"#ebf4ff", borderRadius:"10px", boxShadow:"0 2px 8px #bdd5ea", color:"#274477", minWidth: "180px"}}>
          <h3>{history[0].soil_condition.nutrients}</h3>
          <div><strong>Soil Moisture:</strong> {history[0].soil_condition.moisture}%</div>
          <div><strong>pH:</strong> {history[0].soil_condition.pH}</div>
        </div>
        <div style={{ padding:"18px 28px", background:"#fff4eb", borderRadius:"10px", boxShadow:"0 2px 8px #eacbbd", color:"#664018", minWidth: "150px"}}>
          <h3>{history[0].pest_risk.risk}</h3>
          <div><strong>Pest Probability:</strong> {history[0].pest_risk.probability}</div>
        </div>
      </div>
      <h3>Last 7 Days Data</h3>
      <Line options={options} data={data} />
      {issues.length > 0 && (
        <div style={{ marginTop:"24px", padding:"16px 24px", background:"#ffeaea", color:"#b20000", borderRadius:"8px", fontWeight:"600"}}>
          ⚠️ Alert: {issues.length} day(s) with poor crop health or high pest risk detected!
        </div>
      )}
    </div>
  );
}

export default App;

