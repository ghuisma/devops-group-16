import json
from chalice.test import Client
from app import app

def test_nothing():
    with Client(app) as client:
        assert True
