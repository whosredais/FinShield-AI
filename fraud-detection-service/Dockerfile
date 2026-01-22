# On part d'une version légère de Python
FROM python:3.9-slim

# On crée un dossier de travail
WORKDIR /app

# On copie les requirements et on installe
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# On copie tout le reste (le code + le modèle .pkl)
COPY . .

# On ouvre le port 8000
EXPOSE 8000

# La commande de démarrage
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]