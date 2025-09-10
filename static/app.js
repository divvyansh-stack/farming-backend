import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/farm-data")   // ✅ Correct endpoint
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div style={{ fontFamily: "Arial", textAlign: "center", marginTop: "50px" }}>
      <h1>Farmer Dashboard</h1>
      <h3>Backend Data:</h3>
      <pre style={{ textAlign: "left", display: "inline-block", background: "#eee", padding: "10px", borderRadius: "5px" }}>
        {data ? JSON.stringify(data, null, 2) : "Loading..."}
      </pre>
    </div>
  );
}

export default App;
