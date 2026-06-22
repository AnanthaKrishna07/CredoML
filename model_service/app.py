import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Initialize FastAPI application
app = FastAPI(
    title="Credit Risk ML Service",
    description="Production-grade internal inference engine using Joblib parsing mechanics.",
    version="1.0.0"
)

# 1. Load the pre-trained model binary securely on startup using joblib
MODEL_PATH = "assets/loan_prediction_model.pkl"

try:
    # Swapped pickle.load out for joblib.load for structural tree arrays
    model = joblib.load(MODEL_PATH)
    print(f"--- SUCCESS: Machine Learning Model loaded successfully from {MODEL_PATH} ---")
except FileNotFoundError:
    print(f"--- ERROR: Model file not found at {MODEL_PATH}. Check your folder structure! ---")
    model = None
except Exception as e:
    print(f"--- ERROR: Failed to load model binary via Joblib: {str(e)} ---")
    model = None


# 2. Define the exact input payload schema using Pydantic for data validation
class ApplicantData(BaseModel):
    credit_score: int
    annual_income: float
    loan_amount: float
    debt_to_income_ratio: float
    employment_duration_years: int


@app.get("/")
def health_check():
    """
    Health check endpoint to ensure Node.js can communicate with this service.
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model binary remains unavailable.")
    return {"status": "healthy", "service": "credit-risk-model-service"}


@app.post("/predict")
def predict_risk(data: ApplicantData):
    """
    Inference endpoint. Receives parsed applicant data from Node.js,
    runs the prediction via scikit-learn, and returns the underwriting decision.
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Inference engine uninitialized. Model file missing.")
        
    try:
        # Convert incoming JSON payload to match the DataFrame structure your model expects.
        input_features = pd.DataFrame([{
            'CreditScore': data.credit_score,
            'AnnualIncome': data.annual_income,
            'LoanAmount': data.loan_amount,
            'DebtToIncomeRatio': data.debt_to_income_ratio,
            'EmploymentDuration': data.employment_duration_years
        }])
        
        # Run inference (0 = Denied, 1 = Approved)
        prediction = model.predict(input_features)[0]
        
        # Extract classification probabilities if your model supports it
        try:
            probabilities = model.predict_proba(input_features)[0]
            confidence = float(probabilities[prediction])
        except (AttributeError, IndexError):
            # Fallback if your specific model doesn't support probability estimates
            confidence = 1.0 

        return {
            "approved": int(prediction), 
            "confidence_score": round(confidence, 4)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference Engine failure: {str(e)}")