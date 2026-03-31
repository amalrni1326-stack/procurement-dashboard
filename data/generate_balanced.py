import pandas as pd
import random

suppliers_high = [
    ["TechCorp", "IT Hardware", 1000000, 5000.0, 30.0, 1, "", ""],
    ["SteelWorks", "Raw Materials", 950000, 4000.0, 35.0, 1, "", ""],
    ["RapidFreight", "Logistics", 900000, 4500.0, 25.0, 1, "", ""],
    ["BuildRight", "Facilities", 850000, 4900.0, 40.0, 1, "", ""]
]

suppliers_medium = [
    ["MetaSys", "IT Hardware", 600000, 3500.0, 45.0, 2, "", ""],
    ["ITPro", "IT Hardware", 550000, 3400.0, 50.0, 3, "", ""],
    ["DataDrive", "IT Hardware", 650000, 3600.0, 40.0, 2, "", ""],
    ["MarketMakers", "Marketing", 620000, 4000.0, 48.0, 3, "", ""],
    ["MetalCo", "Raw Materials", 580000, 3200.0, 55.0, 2, "", ""],
    ["TrustLogistics", "Logistics", 590000, 3300.0, 52.0, 2, "", ""],
    ["ClearFacilities", "Facilities", 610000, 3450.0, 42.0, 2, "", ""],
    ["BrandBoost", "Marketing", 630000, 3700.0, 49.0, 3, "", ""],
    ["IronOreInc", "Raw Materials", 570000, 3100.0, 54.0, 2, "", ""],
    ["CloudNet", "IT Hardware", 660000, 3800.0, 45.0, 2, "", ""]
]

suppliers_low = [
    ["GlobalLogistics", "Logistics", 150000, 500.0, 95.0, 5, "", ""],
    ["OfficePlus", "Facilities", 85000, 100.0, 99.0, 5, "", ""],
    ["AdVantage", "Marketing", 120000, 200.0, 96.0, 4, "", ""],
    ["ServerFarm", "IT Hardware", 90000, 150.0, 98.0, 4, "", ""],
    ["CodeSoft", "IT Hardware", 100000, 50.0, 99.5, 6, "", ""],
    ["PCWorld", "IT Hardware", 150000, 120.0, 97.0, 4, "", ""],
    ["FastShip", "Logistics", 260000, 600.0, 94.0, 4, "", ""],
    ["CleanSweep", "Facilities", 55000, 60.0, 97.5, 5, "", ""],
    ["SEOStars", "Marketing", 95000, 180.0, 93.0, 4, "", ""],
    ["CopperCorp", "Raw Materials", 80000, 65.0, 96.0, 5, "", ""],
    ["NetSys", "IT Hardware", 70000, 90.0, 94.5, 3, "", ""],
    ["TechGadget", "IT Hardware", 120000, 120.0, 89.0, 5, "", ""],
    ["MoveIt", "Logistics", 180000, 480.0, 92.0, 4, "", ""],
    ["SpaceManage", "Facilities", 72000, 110.0, 96.0, 3, "", ""],
    ["AdAgency", "Marketing", 110000, 220.0, 95.0, 4, "", ""],
    ["LeadGen", "Marketing", 85000, 150.0, 92.5, 5, "", ""]
]

data = suppliers_high + suppliers_medium + suppliers_low
random.shuffle(data)

df = pd.DataFrame(data, columns=['supplier_name', 'category', 'annual_spend_usd', 'unit_price_usd', 'delivery_reliability_pct', 'alternatives_count', 'risk_score', 'risk_level'])

df.to_csv('data/supplier_data.csv', index=False)
print("Generated balanced supplier_data.csv with requested variance.")
