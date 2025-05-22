"""
Fisier de initializare a aplicatiei Flask.
"""
from flask import Flask

# Inițializare aplicație Flask
app = Flask(__name__, template_folder='templates', static_folder='../static')

# Import rutele pentru a le inregistra in aplicatie
from inventory.routes import items
