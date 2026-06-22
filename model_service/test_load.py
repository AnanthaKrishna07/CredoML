# model_service/test_load.py
import joblib
import traceback

try:
    print("Attempting to open and load file using joblib...")
    model = joblib.load("assets/loan_prediction_model.pkl")
    print("\n🎉 SUCCESS! Model loaded cleanly using Joblib.")
    print(f"Model Type: {type(model)}")
except Exception as e:
    print("\n!!! JOBLIB LOADING FAILED !!!")
    print(f"Error Message: {str(e)}")
    print("\nFull Stack Trace:")
    traceback.print_exc()