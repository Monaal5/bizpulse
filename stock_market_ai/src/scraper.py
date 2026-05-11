import yfinance as yf
import pandas as pd
import os

stocks = [
    "RELIANCE.NS",
    "TCS.NS",
    "INFY.NS",
    "HDFCBANK.NS",
    "ICICIBANK.NS",
    "SBIN.NS",
    "ITC.NS",
    "LT.NS",
    "AXISBANK.NS",
    "KOTAKBANK.NS",
    "BHARTIARTL.NS",
    "ASIANPAINT.NS",
    "MARUTI.NS",
    "TITAN.NS",
    "WIPRO.NS"
]

os.makedirs("data", exist_ok=True)

for stock in stocks:
    print(f"Downloading {stock}...")
    
    df = yf.download(
        stock,
        start="2015-01-01",
        end="2026-01-01",
        auto_adjust=True
    )

    filename = f"data/{stock.replace('.NS', '')}.csv"
    df.to_csv(filename)

    print(f"Saved: {filename}")

print("All stock data downloaded successfully.")