# Inventar Produse - Aplicație Flask cu REST API

Aceasta este o aplicație web Flask care implementează un REST API pentru gestionarea unui inventar de produse. Aplicația permite efectuarea tuturor operațiilor CRUD (Create, Read, Update, Delete) asupra produselor din inventar, cu datele stocate într-un fișier JSON.

## Autor

**Podut Petru**

## Caracteristici

- **API REST Complet:**
  - `GET /items` - Listează toate produsele
  - `GET /items/<id>` - Obține detaliile unui produs specific
  - `POST /items` - Adaugă un produs nou
  - `PUT /items/<id>` - Actualizează un produs existent
  - `DELETE /items/<id>` - Șterge un produs

- **Persistență JSON:**
  - Datele sunt stocate în fișierul `inventory/data/items.json`
  - Fișierul se încarcă la pornirea serverului
  - Fișierul se actualizează după fiecare modificare

- **Interfață Web:**
  - Afișarea produselor într-un tabel
  - Formular pentru adăugare/editare produse
  - Confirmare pentru operațiile de ștergere
  - Căutare și filtrare produse
  - Feedback vizual prin notificări

## Structura proiectului

```
inventory_app/
├── run.py                  # Script pentru pornirea aplicației
├── README.md               # Documentația proiectului
├── requirements.txt        # Dependențele Python
├── .gitignore             # Fișiere ignorate de Git
├── inventory/              # Pachetul principal al aplicației
│   ├── __init__.py         # Inițializare aplicație Flask
│   ├── routes/
│   │   ├── __init__.py     # Face ca directorul să fie un pachet Python
│   │   └── items.py        # Rutele API pentru produse
│   ├── data/
│   │   └── items.json      # Fișierul JSON pentru stocare
│   └── templates/
│       └── index.html      # Template pentru interfața web
└── static/
    └── script.js           # Script JavaScript pentru frontend
```

---

# 🪟 INSTALARE PENTRU WINDOWS

## Pasul 1: Creează mediul virtual
```powershell
python -m venv venv
```

## Pasul 2: Activează mediul virtual
```powershell
venv\Scripts\activate
```

## Pasul 3: Instalează Flask
```powershell
pip install Flask
```

## Pasul 4: Rulează aplicația ▶️
```powershell
python run.py
```

## Configurare PyCharm pentru Windows:
1. **Run** → **Edit Configurations**
2. **"+"** → **Python**
3. **Name:** `Flask - Windows`
4. **Script path:** `run.py`
5. **Python interpreter:** `.\venv\Scripts\python.exe`
6. **Working directory:** Root folder proiect
7. **Environment variables:**
   ```
   FLASK_ENV=development
   FLASK_DEBUG=1
   ```
8. **Apply** → **OK**

### Test rapid Windows:
```powershell
# Testează API-ul
Invoke-RestMethod -Uri "http://localhost:5000/items" -Method GET
```

---

# 🐧 INSTALARE PENTRU LINUX

## Pasul 1: Instalează Python (dacă nu este instalat)
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

## Pasul 2: Creează mediul virtual
```bash
python3 -m venv venv
```

## Pasul 3: Activează mediul virtual
```bash
source venv/bin/activate
```

## Pasul 4: Instalează Flask
```bash
pip install Flask
```

## Pasul 5: Rulează aplicația ▶️
```bash
python run.py
```

## Configurare PyCharm pentru Linux:
1. **Run** → **Edit Configurations**
2. **"+"** → **Python**
3. **Name:** `Flask - Linux`
4. **Script path:** `run.py`
5. **Python interpreter:** `./venv/bin/python`
6. **Working directory:** Root folder proiect
7. **Environment variables:**
   ```
   FLASK_ENV=development
   FLASK_DEBUG=1
   ```
8. **Apply** → **OK**

### Test rapid Linux:
```bash
# Testează API-ul
curl http://localhost:5000/items
```

---

# 🍎 INSTALARE PENTRU macOS

## Pasul 1: Instalează Python (dacă nu este instalat)
```bash
# Opțiunea 1: Cu Homebrew (recomandat)
brew install python3

# Opțiunea 2: Downloadează de pe python.org
```

## Pasul 2: Creează mediul virtual
```bash
python3 -m venv venv
```

## Pasul 3: Activează mediul virtual
```bash
source venv/bin/activate
```

## Pasul 4: Instalează Flask
```bash
pip install Flask
```

## Pasul 5: Rulează aplicația ▶️
```bash
python run.py
```

## Configurare PyCharm pentru macOS:
1. **Run** → **Edit Configurations**
2. **"+"** → **Python**
3. **Name:** `Flask - macOS`
4. **Script path:** `run.py`
5. **Python interpreter:** `./venv/bin/python`
6. **Working directory:** Root folder proiect
7. **Environment variables:**
   ```
   FLASK_ENV=development
   FLASK_DEBUG=1
   ```
8. **Apply** → **OK**

### Test rapid macOS:
```bash
# Testează API-ul
curl http://localhost:5000/items
```

---

# 🚀 ACCESEAZĂ APLICAȚIA

După rulare, aplicația va fi disponibilă la:
```
http://localhost:5000
```

Pentru a opri aplicația, apasă `Ctrl+C` în terminal.

---

# 🎮 CONFIGURĂRI RAPIDE PYCHARM

## Windows - Run Configuration
```
Name: Flask - Windows
Script: run.py
Interpreter: .\venv\Scripts\python.exe
Env vars: FLASK_ENV=development, FLASK_DEBUG=1
```

## Linux - Run Configuration
```
Name: Flask - Linux  
Script: run.py
Interpreter: ./venv/bin/python
Env vars: FLASK_ENV=development, FLASK_DEBUG=1
```

## macOS - Run Configuration
```
Name: Flask - macOS
Script: run.py
Interpreter: ./venv/bin/python
Env vars: FLASK_ENV=development, FLASK_DEBUG=1
```

---

# 🔧 COMENZI QUICK START

## Windows (PowerShell)
```powershell
python -m venv venv; .\venv\Scripts\activate; pip install Flask; python run.py
```

## Linux/macOS (Bash)
```bash
python3 -m venv venv && source venv/bin/activate && pip install Flask && python run.py
```

---

# 📦 FIȘIERE NECESARE

## requirements.txt
```
Flask==3.0.0
Werkzeug==3.0.1
```

## .gitignore
```
venv/
__pycache__/
*.pyc
.env
.idea/
.vscode/
```

---

# 🎯 REZULTAT

După configurare, în PyCharm vei avea în dropdown-ul de Run:
- **Flask - Windows** 🪟
- **Flask - Linux** 🐧  
- **Flask - macOS** 🍎

Selectează configurarea potrivită pentru sistemul tău și apasă **Play (▶️)**!
