from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import random

app = FastAPI(title="SkillSight AI Real-Time Engine", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Real-world NCO / NSQF Aligned Dataset simulation
initial_records = [
    {"state": "Maharashtra", "district": "Pune", "sector": "Electric Vehicles", "trade": "EV Battery Management Specialist", "current_demand": 1450, "current_supply": 900, "forecasted_demand_6m": 1950},
    {"state": "Maharashtra", "district": "Mumbai", "sector": "IT & Cloud", "trade": "Full Stack Cloud Engineer", "current_demand": 4200, "current_supply": 3800, "forecasted_demand_6m": 4900},
    {"state": "Karnataka", "district": "Bengaluru", "sector": "AI & Data", "trade": "AI/ML Deployment Engineer", "current_demand": 5100, "current_supply": 4100, "forecasted_demand_6m": 6400},
    {"state": "Karnataka", "district": "Mysuru", "sector": "Advanced Manufacturing", "trade": "CNC Precision Machinist", "current_demand": 850, "current_supply": 1100, "forecasted_demand_6m": 900},
    {"state": "Tamil Nadu", "district": "Chennai", "sector": "Automotive", "trade": "Mechatronics Technician", "current_demand": 2300, "current_supply": 1900, "forecasted_demand_6m": 2800},
    {"state": "Tamil Nadu", "district": "Coimbatore", "sector": "Textiles & Apparel", "trade": "Advanced Garment Technologist", "current_demand": 1200, "current_supply": 1750, "forecasted_demand_6m": 1250},
    {"state": "Uttar Pradesh", "district": "Noida", "sector": "Electronics", "trade": "Semiconductor Assembly Operator", "current_demand": 3100, "current_supply": 1800, "forecasted_demand_6m": 4100},
    {"state": "Gujarat", "district": "Ahmedabad", "sector": "Green Energy", "trade": "Solar PV Installer Technician", "current_demand": 2400, "current_supply": 1500, "forecasted_demand_6m": 3200}
]

df = pd.DataFrame(initial_records)

@app.get("/")
def home():
    return {"status": "Active", "message": "SkillSight AI Live Intelligence Pipeline is online."}

@app.get("/api/dashboard-summary")
def get_dashboard_summary():
    # Dynamic real-time fluctuation simulation to show live data updates
    total_demand = int(df["current_demand"].sum() + random.randint(-10, 10))
    total_supply = int(df["current_supply"].sum())
    
    return {
        "total_demand": total_demand,
        "total_supply": total_supply,
        "net_gap": total_demand - total_supply,
        "critical_shortages": int((df["forecasted_demand_6m"] - df["current_supply"] > 500).sum()),
        "saturated_trades": int((df["current_supply"] > df["current_demand"]).sum())
    }

@app.get("/api/districts")
def get_district_data(state: str = None, district: str = None):
    filtered_df = df.copy()
    if state:
        filtered_df = filtered_df[filtered_df["state"].str.lower() == state.lower()]
    if district:
        filtered_df = filtered_df[filtered_df["district"].str.lower() == district.lower()]
    
    results = []
    for _, row in filtered_df.iterrows():
        gap = row["current_demand"] - row["current_supply"]
        forecast_gap = row["forecasted_demand_6m"] - row["current_supply"]
        
        if gap > 400:
            status = "Critical Shortage"
            recommendation = f"Urgent: Increase PMKVY/ITI training seats by +{int(forecast_gap * 0.45)} for {row['trade']} in {row['district']}."
        elif gap < -100:
            status = "Saturated / Oversupply"
            recommendation = f"Policy Action: Freeze or divert seat allocations for {row['trade']} to high-growth trades."
        else:
            status = "Balanced Market"
            recommendation = f"Maintain stable seat allocation for {row['trade']}."

        results.append({
            "state": row["state"],
            "district": row["district"],
            "sector": row["sector"],
            "trade": row["trade"],
            "current_demand": row["current_demand"],
            "current_supply": row["current_supply"],
            "gap": gap,
            "forecasted_demand_6m": row["forecasted_demand_6m"],
            "status": status,
            "recommendation": recommendation
        })
        
    return results