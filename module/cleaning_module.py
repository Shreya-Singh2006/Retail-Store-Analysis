import pandas as pd
import numpy as np

def clean_retail_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """
    General cleaning function for retail datasets.
    Handles duplicates, categorical standardization, missing values,
    recalculates Revenue and Profit.
    """

    # 1. Remove duplicates
    if 'Order_ID' in df.columns:
        df = df.drop_duplicates(subset=['Order_ID'])

    # 2. Standardize categorical values
    if 'Gender_Category' in df.columns:
        df['Gender_Category'] = df['Gender_Category'].astype(str).str.strip().str.title()

    if 'Sales_Channel' in df.columns:
        df['Sales_Channel'] = df['Sales_Channel'].astype(str).str.strip().str.title()

    if 'Product_Line' in df.columns:
        df['Product_Line'] = df['Product_Line'].astype(str).str.strip().str.title()

    # 3. Fix Region typos (case-insensitive)
    if 'Region' in df.columns:
        region_map = {
            "bengaluru": "Bangalore",
            "banglore": "Bangalore",
            "hyd": "Hyderabad",
            "hyderbad": "Hyderabad"
        }
        df['Region'] = df['Region'].astype(str).str.strip().str.lower()
        df['Region'] = df['Region'].replace(region_map).str.title()

    # 4. Handle Size
    if 'Size' in df.columns:
        df['Size'] = df['Size'].fillna("Unknown").astype(str).str.strip()

    # 5. Units_Sold
    if 'Units_Sold' in df.columns:
        df['Units_Sold'] = pd.to_numeric(df['Units_Sold'], errors='coerce').fillna(0)
        df = df[df['Units_Sold'] >= 0]

    # 6. MRP (fill using product-specific mode, fallback median)
    if 'MRP' in df.columns and 'Product_Name' in df.columns:
        df['MRP'] = pd.to_numeric(df['MRP'], errors='coerce')

        mrp_map = df.groupby('Product_Name')['MRP'].agg(
            lambda x: x.mode().iloc[0] if not x.mode().empty else np.nan
        )

        df['MRP'] = df.apply(
            lambda row: mrp_map[row['Product_Name']] if pd.isna(row['MRP']) else row['MRP'],
            axis=1
        )

        df['MRP'] = df['MRP'].fillna(df['MRP'].median())

    # 7. Discount_Applied
    if 'Discount_Applied' in df.columns:
        df['Discount_Applied'] = pd.to_numeric(df['Discount_Applied'], errors='coerce').fillna(0)
        df['Discount_Applied'] = df['Discount_Applied'].clip(0, 100)

    # 8. Revenue (recalculate)
    if {'Units_Sold', 'MRP', 'Discount_Applied'}.issubset(df.columns):
        df['Revenue_Calc'] = df['Units_Sold'] * df['MRP'] * (1 - df['Discount_Applied'] / 100)

    # 9. Order_Date
    if 'Order_Date' in df.columns:
        df['Order_Date'] = pd.to_datetime(df['Order_Date'], errors='coerce')
        df = df.dropna(subset=['Order_Date'])

    # 10. Profit (recalculate with assumed margin)
    if 'Revenue_Calc' in df.columns:
        cost_percentage = 0.7  # assume 70% cost, 30% margin
        df['Profit_Recalc'] = df['Revenue_Calc'] * (1 - cost_percentage)
        df['Profit_Recalc'] = df['Profit_Recalc'].fillna(0)

    return df