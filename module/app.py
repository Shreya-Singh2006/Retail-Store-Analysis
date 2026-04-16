import streamlit as st
import pandas as pd
import cleaning_module
import analysis_module as am

# Load and clean dataset
df = pd.read_csv("Nike_Sales_cleaned.xls", parse_dates=['Order_Date'])
df = cleaning_module.clean_data(df)   # assuming you have a clean_data() function

st.title("Nike Retail Sales Dashboard")

# Sidebar navigation
option = st.sidebar.selectbox(
    "Choose Analysis",
    (
        "Sales Trend Analysis",
        "Product Line Performance",
        "Top Products",
        "Discount Effectiveness",
        "Profitability Analysis",
        "Customer Segment Analysis",
        "Regional Sales Insights"
    )
)

# Call the right analysis function
if option == "Sales Trend Analysis":
    st.line_chart(am.sales_trend_analysis(df))

elif option == "Product Line Performance":
    st.bar_chart(am.product_line_performance(df))

elif option == "Top Products":
    st.bar_chart(am.top_products(df, n=10))

elif option == "Discount Effectiveness":
    st.line_chart(am.discount_effectiveness(df))

elif option == "Profitability Analysis":
    st.bar_chart(am.profitability_analysis(df))

elif option == "Customer Segment Analysis":
    st.bar_chart(am.customer_segment_analysis(df))

elif option == "Regional Sales Insights":
    st.bar_chart(am.regional_sales_insights(df))