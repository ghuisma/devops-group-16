import json
from chalice.test import Client
from app import app

def test_index():
    with Client(app) as client:
        # Test get
        response = client.http.get('/')
        assert response.json_body == {'hello': 'world!'}
        # Test post
        response = client.http.post(
            '/',
            headers={'Content-Type':'application/json'},
            body=json.dumps({'example':'json'})
        )
        assert response.json_body == {'example': 'json'}
