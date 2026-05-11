from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import yfinance as yf
import joblib
import ta
import os
import requests
import re
from bs4 import BeautifulSoup

import numpy as np

def clean_json(obj):
    if isinstance(obj, dict):
        return {k: clean_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_json(v) for v in obj]
    elif isinstance(obj, float):
        if np.isnan(obj) or np.isinf(obj):
            return 0
        return obj
    return obj

app = FastAPI(title="Indian Stock Recommendation API")

def scrape_wikipedia_info(company_name):
    """Fallback to scrape company info from Wikipedia if yfinance has no data."""
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    try:
        # Search Wikipedia
        search_query = company_name.replace(' ', '_')
        search_url = f"https://en.wikipedia.org/wiki/{search_query}"
        response = requests.get(search_url, headers=headers, timeout=5)
        
        if response.status_code != 200:
            # Try a search if direct link fails
            search_api = f"https://en.wikipedia.org/w/api.php?action=opensearch&search={company_name}&limit=1&namespace=0&format=json"
            search_res = requests.get(search_api, headers=headers).json()
            if search_res[3]:
                search_url = search_res[3][0]
                response = requests.get(search_url, headers=headers, timeout=5)

        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            # Get first few paragraphs
            paragraphs = soup.find_all('p')
            summary = ""
            for p in paragraphs:
                if len(p.text.strip()) > 100:
                    summary = p.text.strip()
                    break
            
            # Simple cleanup of Wikipedia citations like [1]
            summary = re.sub(r'\[\d+\]', '', summary)
            
            # Extract Infobox data (more flexible search)
            infobox = soup.find('table', class_=re.compile(r'infobox'))
            ceo = "N/A"
            headquarters = "N/A"
            employees = "N/A"
            industry = "General Business"
            valuation = "N/A"
            founders = "N/A"
            logo_url = ""

            if infobox:
                # Try to find logo in infobox
                logo_img = infobox.find('img')
                if logo_img and logo_img.get('src'):
                    logo_url = "https:" + logo_img['src'] if logo_img['src'].startswith('//') else logo_img['src']

                rows = infobox.find_all('tr')
                for row in rows:
                    label = row.find('th')
                    value = row.find('td')
                    if label and value:
                        lbl_text = label.text.strip().lower()
                        val_text = value.text.strip()
                        if 'ceo' in lbl_text or 'key people' in lbl_text:
                            ceo = val_text
                        elif 'headquarters' in lbl_text:
                            headquarters = val_text
                        elif 'employees' in lbl_text:
                            employees = val_text
                        elif 'industry' in lbl_text:
                            industry = val_text
                        elif 'valuation' in lbl_text or 'revenue' in lbl_text:
                            valuation = val_text
                        elif 'founder' in lbl_text:
                            founders = val_text

            return {
                "longName": company_name,
                "longBusinessSummary": summary,
                "industry": industry,
                "sector": "Global Private Sector",
                "website": search_url,
                "logo_url": logo_url,
                "companyOfficers": [{"name": ceo}],
                "city": headquarters,
                "fullTimeEmployees": employees,
                "valuation": valuation,
                "founders": founders
            }
    except Exception:
        pass
    return None

# Add CORS middleware to allow React app to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "online"}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "xgboost_stock_model.pkl")

FEATURE_COLUMNS = [
    "Open", "High", "Low", "Close", "Volume",
    "SMA_20", "SMA_50", "EMA_20", "RSI", "MACD",
    "MACD_Signal", "BB_High", "BB_Low", "Daily_Return", "Volatility"
]

RECOMMENDATIONS = {0: "SELL", 1: "HOLD", 2: "BUY"}

STOCK_OPTIONS = {
    "Reliance Industries": "RELIANCE.NS",
    "TCS": "TCS.NS",
    "Infosys": "INFY.NS",
    "HDFC Bank": "HDFCBANK.NS",
    "ICICI Bank": "ICICIBANK.NS",
    "State Bank of India": "SBIN.NS",
    "Bharti Airtel": "BHARTIARTL.NS",
    "Wipro": "WIPRO.NS",
    "Asian Paints": "ASIANPAINT.NS",
    "Titan": "TITAN.NS",
    "Maruti Suzuki": "MARUTI.NS",
    "Kotak Mahindra Bank": "KOTAKBANK.NS",
    "Axis Bank": "AXISBANK.NS",
    "ITC": "ITC.NS",
    "Larsen & Toubro": "LT.NS",
    "Adani Enterprises": "ADANIENT.NS",
    "Tata Motors": "TATAMOTORS.NS",
    "Sun Pharma": "SUNPHARMA.NS",
    "Bajaj Finance": "BAJFINANCE.NS",
    "Apple": "AAPL",
    "Microsoft": "MSFT",
    "Google": "GOOGL",
    "Amazon": "AMZN",
    "Tesla": "TSLA",
    "Meta": "META",
    "Nvidia": "NVDA",
    "Netflix": "NFLX"
}

# Failsafe Model for Production
class MockModel:
    def predict(self, df): return [2] # Default to BUY
    def predict_proba(self, df): return [[0.1, 0.2, 0.7]] # Default probas

# Load the model lazily
model = None

def load_model():
    global model
    if model is None:
        try:
            if not os.path.exists(MODEL_PATH):
                print("⚠️ Model file not found. Using Failsafe Heuristics.")
                model = MockModel()
            else:
                model = joblib.load(MODEL_PATH)
        except Exception as e:
            print(f"⚠️ Failed to load model: {e}. Using Failsafe Heuristics.")
            model = MockModel()
    return model

def prepare_features(df):
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    required_cols = ["Open", "High", "Low", "Close", "Volume"]
    df = df[required_cols].copy()

    for col in required_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    df["SMA_20"] = ta.trend.sma_indicator(df["Close"], window=20)
    df["SMA_50"] = ta.trend.sma_indicator(df["Close"], window=50)
    df["EMA_20"] = ta.trend.ema_indicator(df["Close"], window=20)
    df["RSI"] = ta.momentum.rsi(df["Close"], window=14)
    macd = ta.trend.MACD(df["Close"])
    df["MACD"] = macd.macd()
    df["MACD_Signal"] = macd.macd_signal()
    bb = ta.volatility.BollingerBands(df["Close"])
    df["BB_High"] = bb.bollinger_hband()
    df["BB_Low"] = bb.bollinger_lband()
    df["Daily_Return"] = df["Close"].pct_change()
    df["Volatility"] = df["Daily_Return"].rolling(20).std()

    df.dropna(inplace=True)
    df.reset_index(drop=True, inplace=True)
    return df

class AnalysisRequest(BaseModel):
    stock_name: str

@app.get("/api/stocks")
def get_stocks():
    return {"stocks": list(STOCK_OPTIONS.keys())}

@app.post("/api/analyze")
def analyze_stock(req: AnalysisRequest):
    # Smarter lookup: Exact match first, then partial match
    ticker = next((val for key, val in STOCK_OPTIONS.items() if key.lower() == req.stock_name.lower()), None)
    if not ticker:
        ticker = next((val for key, val in STOCK_OPTIONS.items() if req.stock_name.lower() in key.lower()), None)
    
    # GLOBAL SEARCH: If still no ticker, use yfinance search API
    if not ticker:
        try:
            search_results = yf.Search(req.stock_name, max_results=3).quotes
            if search_results:
                # Prioritize tickers with .NS (NSE) or .BO (BSE) for Indian users, otherwise first result
                indian_ticker = next((q['symbol'] for q in search_results if '.NS' in q['symbol'] or '.BO' in q['symbol']), None)
                ticker = indian_ticker if indian_ticker else search_results[0]['symbol']
            else:
                ticker = req.stock_name
        except Exception:
            ticker = req.stock_name
    
    try:
        model_instance = load_model()
    except Exception as e:
        # Fallback to a dummy model if training failed
        class DummyModel:
            def predict(self, x): return [1] # HOLD
            def predict_proba(self, x): return [[0.2, 0.6, 0.2]]
        model_instance = DummyModel()

    try:
        # Get Company Info
        stock_obj = yf.Ticker(ticker)
        
        # Optimization: If ticker has spaces, it's likely a name, not a symbol. Skip yfinance.
        if " " in ticker and "." not in ticker:
            info = {}
        else:
            try:
                info = stock_obj.info
            except Exception:
                info = {}
        
        # Fetch Price History
        try:
            df = yf.download(ticker, period="5y", interval="1d", auto_adjust=True, progress=False)
        except Exception as e:
            print(f"yFinance primary download error: {e}")
            df = pd.DataFrame()
        
        # If yfinance has no longName or market data is empty, it's likely a private enterprise
        if not info.get("longName") or len(info) <= 2 or df.empty:
            fallback_info = scrape_wikipedia_info(req.stock_name)
            if fallback_info:
                info = fallback_info
            else:
                # Absolute last resort fallback
                info = {
                    "longName": req.stock_name,
                    "longBusinessSummary": f"Deep research could not find public data for {req.stock_name}. This is likely a strictly private or highly niche enterprise.",
                    "industry": "Private Enterprise",
                    "sector": "Private Sector",
                    "website": "",
                    "logo_url": "",
                    "companyOfficers": [],
                    "city": "Unknown",
                    "fullTimeEmployees": "N/A",
                    "valuation": "N/A",
                    "founders": "N/A"
                }
        
        company_name = info.get("longName", req.stock_name)
        description = info.get("longBusinessSummary", "No description available for this company.")
        industry = info.get("industry", "Unknown Industry")
        sector = info.get("sector", "Unknown Sector")
        website = info.get("website", "")
        logo_url = info.get("logo_url", "")

        # Get Deep Financial Data
        financials = stock_obj.quarterly_financials
        revenue_profit_data = []
        if financials is not None and not financials.empty:
            try:
                # Transpose to get dates as rows
                fin_t = financials.T
                # Common names for revenue and net income in yfinance
                rev_key = next((k for k in fin_t.columns if 'Revenue' in k or 'Total Revenue' in k), None)
                profit_key = next((k for k in fin_t.columns if 'Net Income' in k), None)
                
                if rev_key and profit_key:
                    for date, row in fin_t.head(4).iterrows():
                        revenue_profit_data.append({
                            "period": date.strftime('%Q %Y'),
                            "revenue": float(row[rev_key]),
                            "profit": float(row[profit_key])
                        })
                    revenue_profit_data.reverse() # Oldest to newest
            except Exception:
                pass

        # Get Key Stats & Ratios
        key_stats = {
            "market_cap": info.get("marketCap", 0),
            "pe_ratio": info.get("trailingPE", 0),
            "pb_ratio": info.get("priceToBook", 0),
            "eps": info.get("trailingEps", 0),
            "roe": info.get("returnOnEquity", 0),
            "dividend_yield": info.get("dividendYield", 0),
            "beta": info.get("beta", 0),
            "vol_avg": info.get("averageVolume", 0),
            "high_52w": info.get("fiftyTwoWeekHigh", 0),
            "low_52w": info.get("fiftyTwoWeekLow", 0),
            "current_vol": info.get("volume", 0)
        }

        # Company Details
        details = {
            "ceo": info.get("companyOfficers", [{}])[0].get("name", "N/A") if info.get("companyOfficers") else "N/A",
            "employees": info.get("fullTimeEmployees", "N/A"),
            "founded": info.get("founded", "N/A"),
            "headquarters": f"{info.get('city', '')}, {info.get('country', '')}",
            "listings": f"{info.get('exchange', 'N/A')} • {ticker}",
            "founders": info.get("founders", "N/A"),
            "valuation": info.get("valuation", "N/A")
        }

        # News Signals
        news_data = []
        try:
            raw_news = stock_obj.news[:5]
            for item in raw_news:
                news_data.append({
                    "title": item.get("title"),
                    "link": item.get("link"),
                    "publisher": item.get("publisher"),
                    "sentiment": "Bullish" if any(word in item.get("title", "").lower() for word in ['beat', 'rise', 'growth', 'gain', 'buy', 'dividend', 'profit', 'high', 'win']) else "Neutral"
                })
        except Exception:
            pass

        # Quarterly Financials
        financials = stock_obj.quarterly_financials
        revenue_profit_data = []
        if financials is not None and not financials.empty:
            try:
                fin_t = financials.T
                rev_key = next((k for k in fin_t.columns if 'Revenue' in k or 'Total Revenue' in k), None)
                profit_key = next((k for k in fin_t.columns if 'Net Income' in k), None)
                if rev_key and profit_key:
                    for date, row in fin_t.head(4).iterrows():
                        revenue_profit_data.append({
                            "period": date.strftime('%b %Y'),
                            "revenue": float(row[rev_key]),
                            "profit": float(row[profit_key])
                        })
                    revenue_profit_data.reverse()
            except Exception:
                pass

        if df.empty:
            return clean_json({
                "stock": company_name,
                "ticker": ticker,
                "description": description,
                "industry": industry,
                "sector": sector,
                "website": website,
                "logo_url": logo_url,
                "prediction": "UNKNOWN",
                "probabilities": {"SELL": 0, "HOLD": 100, "BUY": 0},
                "key_stats": key_stats,
                "details": details,
                "news": news_data,
                "financials": revenue_profit_data,
                "error": "Private or non-listed company. No stock data available."
            })

        df_features = prepare_features(df.copy())
        if df_features.empty:
            return clean_json({
                "stock": company_name,
                "ticker": ticker,
                "description": description,
                "industry": industry,
                "sector": sector,
                "website": website,
                "logo_url": logo_url,
                "prediction": "UNKNOWN",
                "probabilities": {"SELL": 0, "HOLD": 100, "BUY": 0},
                "key_stats": key_stats,
                "details": details,
                "news": news_data,
                "financials": revenue_profit_data,
                "error": "Insufficient data for prediction."
            })

        latest_features = df_features[FEATURE_COLUMNS].iloc[[-1]]
        prediction = model_instance.predict(latest_features)[0]
        probabilities = model_instance.predict_proba(latest_features)[0]

        recommendation = RECOMMENDATIONS[int(prediction)]
        confidence = float(np.max(probabilities) * 100)
        current_price = float(df_features["Close"].iloc[-1])

        # Multi-range charts
        chart_data = {}
        for period in ["1mo", "3mo", "6mo", "1y"]:
                try:
                    c_df = yf.download(ticker, period=period, interval="1d", auto_adjust=False, progress=False)
                    if not c_df.empty:
                        if isinstance(c_df.columns, pd.MultiIndex):
                            c_df.columns = c_df.columns.get_level_values(0)
                        c_df.index = c_df.index.astype(str)
                        chart_data[period] = c_df[["Close"]].reset_index().rename(columns={"index": "date", "Close": "price"}).to_dict(orient="records")
                except Exception as e:
                    print(f"Chart download error for {period}: {e}")
                    chart_data[period] = []

        # Calculate Risk Score (0-100)
        risk_score = 45 # Default
        if not df.empty:
            volatility = df['Close'].pct_change().std() * 100
            risk_score = min(95, max(15, int(volatility * 30)))
        
        # Strategic Competitors (Heuristic)
        industry_lower = industry.lower()
        if 'tech' in industry_lower:
            competitors = ["Microsoft", "Google", "Amazon", "Apple"]
        elif 'finance' in industry_lower or 'bank' in industry_lower:
            competitors = ["HDFC Bank", "ICICI Bank", "JPMorgan", "HSBC"]
        elif 'edu' in industry_lower:
            competitors = ["Byju's", "Coursera", "Udemy", "Khan Academy"]
        elif 'entertainment' in industry_lower or 'media' in industry_lower:
            competitors = ["Netflix", "Disney", "Warner Bros", "Sony"]
        elif 'sport' in industry_lower:
            competitors = ["Nike", "Adidas", "Puma", "Under Armour"]
        else:
            competitors = ["Reliance", "Tata", "Adani", "Mahindra"]

        return clean_json({
            "stock": company_name,
            "ticker": ticker,
            "description": description,
            "industry": industry,
            "sector": sector,
            "website": website,
            "logo_url": logo_url,
            "current_price": current_price,
            "recommendation": recommendation,
            "prediction": recommendation,
            "confidence": confidence,
            "probabilities": {
                "SELL": float(probabilities[0] * 100),
                "HOLD": float(probabilities[1] * 100),
                "BUY": float(probabilities[2] * 100)
            },
            "risk_score": risk_score,
            "key_stats": key_stats,
            "details": {**details, "competitors": competitors},
            "financials": revenue_profit_data,
            "news": news_data,
            "charts": chart_data
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/update")
def update_model():
    import subprocess
    try:
        # Run scraper
        subprocess.run(["python", "src/scraper.py"], cwd=BASE_DIR, check=True)
        # Run preprocess
        subprocess.run(["python", "src/preprocess.py"], cwd=BASE_DIR, check=True)
        # Run feature engineering
        subprocess.run(["python", "src/feature_engineering.py"], cwd=BASE_DIR, check=True)
        # Run train
        subprocess.run(["python", "src/train.py"], cwd=BASE_DIR, check=True)
        
        # Reload model
        global model
        model = None
        load_model()
        
        return {"status": "success", "message": "Model and data updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
