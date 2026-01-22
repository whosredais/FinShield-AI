from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

# Initialisation de l'application
app = FastAPI()

# Chargement du modèle entraîné
model = joblib.load('fraud_model.pkl')

# Définition du format des données attendues (JSON)
class TransactionRequest(BaseModel):
    amount: float
    distance: float

@app.get("/")
def home():
    return {"message": "Service de Détection de Fraude IA en ligne"}

@app.post("/predict")
def predict_fraud(transaction: TransactionRequest):
    # Préparation des données pour le modèle
    features = np.array([[transaction.amount, transaction.distance]])
    
    # Prédiction (0 ou 1)
    prediction = model.predict(features)[0]
    
    # Probabilité (pour avoir un score de confiance)
    probability = model.predict_proba(features)[0][1]
    
    is_fraud = bool(prediction == 1)
    
    return {
        "is_fraud": is_fraud,
        "risk_score": round(probability, 4),
        "message": "Transaction suspecte détectée" if is_fraud else "Transaction valide"
    }