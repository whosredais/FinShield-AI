from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

# Initialisation de l'application
app = FastAPI()

# Chargement du modèle entraîné
# Avant : model = joblib.load('fraud_model.pkl')
# Après :
model = joblib.load('real_fraud_model.pkl')

# Définition du format des données attendues (JSON)
class TransactionRequest(BaseModel):
    amount: float
    distance: float

@app.get("/")
def home():
    return {"message": "Service de Détection de Fraude IA en ligne"}

@app.post("/predict")
def predict_fraud(transaction: TransactionRequest):
    # Préparation des données pour le modèle dans le cas des données simulées
    #features = np.array([[transaction.amount, transaction.distance]])

    # On map nos entrées Java vers les colonnes du Dataset Kaggle
    # Java envoie : amount, distance
    # Le modèle attend : Amount, V4
    
    # On considère que 'distance' influence la feature 'V4'
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