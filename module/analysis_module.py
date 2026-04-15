import pandas as pd
import matplotlib.pyplot as plt

# 1. Sales Trend Analysis (Revenue Over Time)
def sales_trend_analysis(df):
    df['Month'] = df['Order_Date'].dt.to_period('M')
    monthly_sales = df.groupby('Month')['Revenue_Calc'].sum()
    return monthly_sales

# 2. Product Line Performance Analysis
def product_line_performance(df):
    line_perf = df.groupby('Product_Line')['Revenue_Calc'].sum().sort_values(ascending=False)
    return line_perf

# 3. Top Products Analysis
def top_products(df, n=10):
    top_products = df.groupby('Product_Name')['Units_Sold'].sum().sort_values(ascending=False).head(n)
    return top_products

# 4. Discount Effectiveness Analysis
def discount_effectiveness(df):
    disc_eff = df.groupby('Discount')['Revenue_Calc'].sum()
    return disc_eff

# 5. Profitability Analysis
def profitability_analysis(df):
    profit = df.groupby('Product_Line')['Profit_Calc'].sum().sort_values(ascending=False)
    return profit

# 6. Customer Segment Analysis
def customer_segment_analysis(df):
    seg_perf = df.groupby('Customer_Segment')['Revenue_Calc'].sum().sort_values(ascending=False)
    return seg_perf

# 7. Regional Sales Insights
def regional_sales_insights(df):
    region_perf = df.groupby('Region')['Revenue_Calc'].sum().sort_values(ascending=False)
    return region_perf