from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import random
import datetime

# -------------------------
# Create FastAPI app
# -------------------------
app = FastAPI(title="Smart Farming API")

# -------------------------
# Add CORS middleware
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Data Simulation Functions
# -------------------------
def simulate_crop_health():
    health = random.choice(["Healthy", "Stressed", "Diseased"])
    score = random.randint(60, 100) if health == "Healthy" else random.randint(30, 70)
    return {"status": health, "score": score}

def simulate_soil_condition():
    moisture = random.uniform(10, 40)  # percentage
    ph = random.uniform(5.5, 8.0)      # pH scale
    nutrients = random.choice(["Low", "Medium", "High"])
    return {"moisture": round(moisture, 2), "pH": round(ph, 2), "nutrients": nutrients}

def simulate_pest_risk():
    risk_level = random.choice(["Low", "Medium", "High"])
    probability = {
        "Low": random.uniform(0, 0.3),
        "Medium": random.uniform(0.3, 0.7),
        "High": random.uniform(0.7, 1.0)
    }[risk_level]
    return {"risk": risk_level, "probability": round(probability, 2)}

# -------------------------
# API Endpoints
# -------------------------
@app.get("/")
def home():
    return {"message": "Welcome to Smart Farming API!"}

@app.get("/crop-health")
def get_crop_health():
    return simulate_crop_health()

@app.get("/soil-condition")
def get_soil_condition():
    return simulate_soil_condition()

@app.get("/pest-risk")
def get_pest_risk():
    return simulate_pest_risk()

@app.get("/farm-data")
def get_farm_data():
    return {
        "timestamp": datetime.datetime.now().isoformat(),
        "crop_health": simulate_crop_health(),
        "soil_condition": simulate_soil_condition(),
        "pest_risk": simulate_pest_risk()
    }

@app.get("/farm-data/history")
def get_history(days: int = Query(7, ge=1, le=30)):
    history = []
    for i in range(days):
        history.append({
            "date": (datetime.datetime.now() - datetime.timedelta(days=i)).strftime("%Y-%m-%d"),
            "crop_health": simulate_crop_health(),
            "soil_condition": simulate_soil_condition(),
            "pest_risk": simulate_pest_risk()
        })
    return {"history": history}
