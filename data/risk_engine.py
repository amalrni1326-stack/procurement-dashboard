import pandas as pd

def compute_risk():
    # Load the CSV
    df = pd.read_csv('data/supplier_data.csv')
    
    # price_volatility = normalised unit_price within category (0-100)
    df['price_volatility'] = df.groupby('category')['unit_price_usd'].transform(
        lambda x: ((x - x.min()) / (x.max() - x.min())) * 100 if x.max() != x.min() else 0
    )
    
    # spend_concentration = normalised annual_spend across all suppliers (0-100)
    min_spend = df['annual_spend_usd'].min()
    max_spend = df['annual_spend_usd'].max()
    df['spend_concentration'] = ((df['annual_spend_usd'] - min_spend) / (max_spend - min_spend)) * 100 if max_spend != min_spend else 0
    
    # single_source_penalty = 30 if alternatives_count <= 1 else 0
    df['single_source_penalty'] = df['alternatives_count'].apply(lambda x: 30 if x <= 1 else 0)
    
    # Compute risk_score using the exact provided formula
    df['risk_score'] = (df['price_volatility'] * 0.30) + ((100 - df['delivery_reliability_pct']) * 0.25) + (df['spend_concentration'] * 0.25) + (df['single_source_penalty'] * 0.20)
    
    # Classify risk_level based on thresholds
    def classify_risk(score):
        if score > 70:
            return 'HIGH'
        elif score >= 40:
            return 'MEDIUM'
        else:
            return 'LOW'
            
    df['risk_level'] = df['risk_score'].apply(classify_risk)
    
    # Save enriched data
    df.to_csv('data/enriched_supplier_data.csv', index=False)
    
    # Print summary
    print(f"Total suppliers: {len(df)}")
    print(f"Average risk_score: {df['risk_score'].mean():.2f}")
    print("Count per risk_level:")
    print(df['risk_level'].value_counts().to_string())

if __name__ == '__main__':
    compute_risk()
