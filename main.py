from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
import json
from pydantic import BaseModel
from dotenv import load_dotenv
load_dotenv()

from utils import refine_claim, syntesize_claim

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_methods = ["*"],
    allow_headers = ["*"],
)

GOOGLE_API_KEY = os.getenv("GOOGLE_FACT_API")
FACT_CHECK_URL = "https://factchecktools.googleapis.com/v1alpha1/claims:search"

class FactCheckRequest(BaseModel):
    text: str
    # category: str = "C2"

async def call_google_api(claims: list, category: str, query: str):
    params = {
        "query": claims,
        "key": GOOGLE_API_KEY,
        "languageCode": 'pt-BR'
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(FACT_CHECK_URL, params = params)

    data = response.json()
    print(f'GOOGLE FACT CHECK DEBUG >> {json.dumps(data, indent=2)}')
    if data is None:
        return {
            "raw_claim": query,
            "claims": claims,
            "category": category.upper(),
            "google_fact_check_response": data
        }
    return data

@app.get("/ping")
async def health_check():
    return {"status": "working... pong!"}

@app.post("/check")
async def check_fact(payload: FactCheckRequest):
    query = payload.text

    if not query or query.strip() == "":
        raise HTTPException(status_code = 400, detail = "empty or wrong query")
        
    refined_query = await refine_claim(query)
    print(F'DEBUG REFINING QUERY >> {refined_query}')
    

    claims = refined_query.get("claims", []) # type: ignore
    category = refined_query.get("category", "").lower() # type: ignore
    
    if category == "c1":
        return refined_query
    
    if category in ["c1", "c2", "c3"]:
        search_results = await call_google_api(claims, category, query)
        print(search_results)
        google_results = search_results.get("claims", []) if isinstance(search_results, dict) else search_results
        final_veridict = syntesize_claim(payload.text, google_results, category)
        print(f'FINAL VERIDICT >> {final_veridict}')
              
        return final_veridict
    elif category == "dev_mode":
        print(f'dev mode. \n > {refined_query}')
    else:
        print(f'categoria desconhecida. {payload.text} ')

    return refined_query