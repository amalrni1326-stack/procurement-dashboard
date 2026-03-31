import os
import pandas as pd
import subprocess
from fastapi import APIRouter, HTTPException, File, UploadFile

router = APIRouter()

DATA_SOURCE = os.path.join(os.path.dirname(__file__), "..", "..", "data", "enriched_supplier_data.csv")

def load_data():
    try:
        # Also try relative to working dir if the above fails
        if not os.path.exists(DATA_SOURCE):
            fallback_source = "../data/enriched_supplier_data.csv"
            if os.path.exists(fallback_source):
                return pd.read_csv(fallback_source)
            else:
                raise FileNotFoundError
        return pd.read_csv(DATA_SOURCE)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Data source file not found. Ensure '../data/enriched_supplier_data.csv' exists.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading data: {str(e)}")

@router.get("/suppliers")
def get_suppliers():
    df = load_data()
    return df.to_dict(orient="records")

@router.get("/risk-flags")
def get_risk_flags():
    df = load_data()
    if 'risk_level' not in df.columns:
        raise HTTPException(status_code=500, detail="Column 'risk_level' not found in dataset.")
    high_risk = df[df['risk_level'] == 'HIGH']
    return high_risk.to_dict(orient="records")

@router.get("/spend-summary")
def get_spend_summary():
    df = load_data()
    if 'category' not in df.columns or 'annual_spend_usd' not in df.columns:
        raise HTTPException(status_code=500, detail="Missing grouping columns in dataset.")
    spend_by_cat = df.groupby('category')['annual_spend_usd'].sum().to_dict()
    return spend_by_cat

@router.get("/savings-opportunities")
def get_savings_opportunities():
    df = load_data()
    if 'unit_price_usd' not in df.columns or 'category' not in df.columns:
        raise HTTPException(status_code=500, detail="Missing required columns for savings opportunities.")
    
    # Calculate median unit_price_usd for each category directly into a new series
    medians = df.groupby('category')['unit_price_usd'].median().rename('median_unit_price')
    
    # Merge medians back
    df = df.merge(medians, on='category', how='left')
    
    # Filter for > 20% above median
    opportunities = df[df['unit_price_usd'] > 1.20 * df['median_unit_price']].copy()
    
    # Calculate pct_above_median
    opportunities['pct_above_median'] = ((opportunities['unit_price_usd'] - opportunities['median_unit_price']) / opportunities['median_unit_price']) * 100
    opportunities['pct_above_median'] = opportunities['pct_above_median'].round(2)
    
    # Clean up
    opportunities = opportunities.drop(columns=['median_unit_price'])
    
    return opportunities.to_dict(orient="records")

@router.get("/kpis")
def get_kpis():
    df = load_data()
    total_suppliers = len(df)
    total_spend_usd = df['annual_spend_usd'].sum() if 'annual_spend_usd' in df.columns else 0
    
    high_risk_count = 0
    if 'risk_level' in df.columns:
        high_risk_count = len(df[df['risk_level'] == 'HIGH'])
        
    savings_opportunity_pct = 0.0
    if 'unit_price_usd' in df.columns and 'category' in df.columns:
        medians = df.groupby('category')['unit_price_usd'].median().rename('median_unit_price')
        df_temp = df.merge(medians, on='category', how='left')
        opportunities_count = len(df_temp[df_temp['unit_price_usd'] > 1.20 * df_temp['median_unit_price']])
        if total_suppliers > 0:
            savings_opportunity_pct = round((opportunities_count / total_suppliers) * 100, 2)
            
    return {
        "total_suppliers": total_suppliers,
        "total_spend_usd": float(total_spend_usd),
        "high_risk_count": high_risk_count,
        "savings_opportunity_pct": float(savings_opportunity_pct)
    }

@router.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    # Define absolute paths
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__))) # Project root
    data_dir = os.path.join(base_dir, "data")
    dest_path = os.path.join(data_dir, "supplier_data.csv")
    engine_path = os.path.join(data_dir, "risk_engine.py")
    
    if not os.path.exists(data_dir):
        os.makedirs(data_dir, exist_ok=True)
        
    try:
        # Save the uploaded file
        with open(dest_path, "wb") as f:
            content = await file.read()
            f.write(content)
            
        # Run risk_engine.py
        # It expects to be run from the project root due to hardcoded 'data/...' inside the script
        result = subprocess.run(
            ["python", "data/risk_engine.py"],
            cwd=base_dir,
            capture_output=True,
            text=True,
            check=True
        )
        
        return {
            "message": "File uploaded and data processed successfully",
            "engine_output": result.stdout
        }
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Risk engine failed: {e.stderr}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
