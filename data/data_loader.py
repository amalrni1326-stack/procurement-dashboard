import csv

def get_all_suppliers():
    """Loads enriched_supplier_data.csv and returns all rows as a list of Python dicts."""
    with open('data/enriched_supplier_data.csv', 'r') as f:
        reader = csv.DictReader(f)
        return list(reader)
