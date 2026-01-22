import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# 1. Génération de données synthétiques (pour le MVP)
# On simule 1000 transactions
np.random.seed(42)
n_samples = 1000

# Features : [montant, distance_domicile]
# Si la transaction est frauduleuse (1), le montant et la distance sont souvent plus élevés
X = np.random.rand(n_samples, 2) 
y = np.zeros(n_samples)

# On introduit un biais pour simuler la fraude :
# Si (montant élevé ET distance élevée), c'est probablement une fraude
for i in range(n_samples):
    amount = np.random.randint(10, 1000) # Montant entre 10 et 1000
    distance = np.random.randint(1, 100) # Distance entre 1 et 100km
    
    X[i] = [amount, distance]
    
    # Règle simple pour créer des "fraudes" dans nos données d'entraînement
    if amount > 800 and distance > 50:
        y[i] = 1 # Fraude
    else:
        y[i] = 0 # Légitime

# 2. Entraînement du modèle
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

clf = RandomForestClassifier()
clf.fit(X_train, y_train)

# 3. Évaluation rapide
y_pred = clf.predict(X_test)
print(f"Précision du modèle : {accuracy_score(y_test, y_pred) * 100:.2f}%")

# 4. Sauvegarde du modèle (Le "Cerveau")
joblib.dump(clf, 'fraud_model.pkl')
print("Modèle sauvegardé sous 'fraud_model.pkl'")