import pandas as pd

# 1. Sales Trend Analysis (Monthly Revenue)
def sales_trend_analysis(df):
    if not pd.api.types.is_datetime64_any_dtype(df['Order_Date']):
        df['Order_Date'] = pd.to_datetime(df['Order_Date'], errors='coerce')

    df['Month'] = df['Order_Date'].dt.to_period('M')
    monthly_sales = df.groupby('Month')['Revenue_Calc'].sum()

    return monthly_sales


# 2. Product Line Performance
def product_line_performance(df):
    return df.groupby('Product_Line')['Revenue_Calc'].sum().sort_values(ascending=False)


# 3. Top Selling Products
def top_products(df, n=10):
    return df.groupby('Product_Name')['Units_Sold'].sum().sort_values(ascending=False).head(n)


# 4. Discount Effectiveness (using bins)
def discount_effectiveness(df):
    df['Discount_Bin'] = pd.cut(
        df['Discount_Applied'],
        bins=[0, 10, 20, 30, 50, 100]
    )
    return df.groupby('Discount_Bin')['Revenue_Calc'].sum()


# 5. Profitability Analysis
def profitability_analysis(df):
    return df.groupby('Product_Line')['Profit_Recalc'].sum().sort_values(ascending=False)


# 6. Regional Sales Insights
def regional_sales_insights(df):
    return df.groupby('Region')['Revenue_Calc'].sum().sort_values(ascending=False)


# 7. Sales Channel Analysis (NEW - replaces invalid function)
def sales_channel_analysis(df):
    return df.groupby('Sales_Channel')['Revenue_Calc'].sum().sort_values(ascending=False)


# 8. Overall KPIs (VERY IMPORTANT for dashboard)
def overall_kpis(df):
    total_revenue = df['Revenue_Calc'].sum()
    total_profit = df['Profit_Recalc'].sum()
    total_units = df['Units_Sold'].sum()

    return {
        "Total Revenue": total_revenue,
        "Total Profit": total_profit,
        "Total Units Sold": total_units
    }