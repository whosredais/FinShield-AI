import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib

print("⏳ Chargement du dataset Kaggle (ça peut prendre quelques secondes)...")
# 1. Chargement des données réelles
df = pd.read_csv('creditcard.csv')

# 2. Préparation des données
# Pour notre démo Java, on utilise seulement 2 features :
# - Amount : Le montant réel
# - V4 : Une feature anonyme qu'on utilisera comme proxy pour la "Distance"
X = df[['Amount', 'V4']]
y = df['Class'] # 0 = Ok, 1 = Fraude

print(f"📊 Données chargées : {len(df)} transactions.")
print("   Répartition :", y.value_counts().to_dict())

# 3. Séparation Entraînement / Test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Entraînement (On limite la profondeur pour que le fichier ne soit pas trop lourd)
print("🚀 Démarrage de l'entraînement du modèle...")
clf = RandomForestClassifier(
    n_estimators=100, 
    max_depth=10, 
    class_weight='balanced', # Important car il y a peu de fraudes
    random_state=42,
    n_jobs=-1 # Utilise tous les coeurs du CPU
)
clf.fit(X_train, y_train)

# 5. Score
score = clf.score(X_test, y_test)
print(f"✅ Modèle entraîné avec succès ! Précision globale : {score:.4f}")

# 6. Sauvegarde
model_filename = 'real_fraud_model.pkl'
joblib.dump(clf, model_filename)
print(f"💾 Cerveau sauvegardé sous '{model_filename}'")