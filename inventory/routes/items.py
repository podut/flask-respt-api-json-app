"""
Definirea rutelor pentru API-ul REST ce gestioneaza produsele.
Implementeaza toate operatiile CRUD prin metodele HTTP corespunzatoare.
"""
import os
import json
from flask import request, jsonify, render_template
from inventory import app

##Calea catre fisierul JSON care stocheaza datele
DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'items.json')

# Asiguram ca directorul data exista
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

def load_data():
    """
    Încarcă datele din fișierul JSON.
    Dacă fișierul nu există, returnează o listă goală.
    """
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        else:
            # Dacă fișierul nu există, creează-l cu o listă goală
            save_data([])
            return []
    except Exception as e:
        print(f"Eroare la încărcarea datelor: {e}")
        return []

def save_data(data):
    """
    Salvează datele în fișierul JSON.
    """
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        return True
    except Exception as e:
        print(f"Eroare la salvarea datelor: {e}")
        return False

def get_next_id(items):
    """
    Genereaza un nou ID pentru un produs.
    """
    return max([item.get('id', 0) for item in items], default=0) + 1

# Ruta principala - afiseaza interfata web
@app.route('/')
def index():
    """
    Ruta principala care serveste template-ul HTML pentru interfata.
    """
    return render_template('index.html')

# Ruta pentru listarea tuturor produselor
@app.route('/items', methods=['GET'])
def get_items():
    """
    GET /items - Returneaza toate produsele.
    """
    items = load_data()
    return jsonify(items), 200

# Ruta pentru obtinerea unui produs specific dupa ID
@app.route('/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    """
    GET /items/<id> - Returneaza un produs specific dupa ID.
    """
    items = load_data()
    item = next((item for item in items if item.get('id') == item_id), None)
    
    if item:
        return jsonify(item), 200
    else:
        return jsonify({"error": "Produsul nu a fost gasit"}), 404

# Ruta pentru adaugarea unui nou produs
@app.route('/items', methods=['POST'])
def add_item():
    """
    POST /items - Adauga un nou produs.
    """
    # Preia datele din corpul cererii
    data = request.get_json()
    
    # Validare simpla
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Date invalide"}), 400
    
    # Incarca datele existente
    items = load_data()
    
    # Genereaza un nou ID
    new_id = get_next_id(items)
    
    # Creeaza noul produs
    new_item = {
        'id': new_id,
        **data
    }
    
    # Adauga produsul la lista
    items.append(new_item)
    
    # Salveaza lista actualizata
    if save_data(items):
        return jsonify(new_item), 201
    else:
        return jsonify({"error": "Eroare la salvarea datelor"}), 500

# Ruta pentru actualizarea unui produs existent
@app.route('/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    """
    PUT /items/<id> - Actualizeaza un produs existent.
    """
    # Preia datele din corpul cererii
    data = request.get_json()
    
    # Validare simpla
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Date invalide"}), 400
    
    # Incarca datele existente
    items = load_data()
    
    # Cauta produsul dupa ID
    item_index = next((index for index, item in enumerate(items) if item.get('id') == item_id), None)
    
    if item_index is None:
        return jsonify({"error": "Produsul nu a fost gasit"}), 404
    
    # Actualizeaza produsul, pastrand ID-ul
    items[item_index] = {
        'id': item_id,
        **data
    }
    
    # Salveaza lista actualizata
    if save_data(items):
        return jsonify(items[item_index]), 200
    else:
        return jsonify({"error": "Eroare la salvarea datelor"}), 500

# Ruta pentru stergerea unui produs
@app.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    """
    DELETE /items/<id> - Sterge un produs.
    """
    # Incarca datele existente
    items = load_data()
    
    # Cauta produsul dupa ID
    item_index = next((index for index, item in enumerate(items) if item.get('id') == item_id), None)
    
    if item_index is None:
        return jsonify({"error": "Produsul nu a fost gasit"}), 404
    
    # Sterge produsul din lista
    deleted_item = items.pop(item_index)
    
    # Salveaza lista actualizata
    if save_data(items):
        return jsonify({"message": f"Produsul cu ID-ul {item_id} a fost sters", "item": deleted_item}), 200
    else:
        return jsonify({"error": "Eroare la salvarea datelor"}), 500
