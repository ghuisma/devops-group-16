import json
from chalice.test import Client
from app import app


def test_login():
    with Client(app) as client:
        # Wrong password
        response = client.http.post('/auth/login',
            headers={'Content-Type': 'application/json'},
            body=json.dumps({
                'username': 'test-user',
                'password': 'testpwd1234'
            })
        )
        assert response.status_code == 401

        response = client.http.post('/auth/login',
            headers={'Content-Type': 'application/json'},
            body=json.dumps({
                'username': 'test-user',
                'password': 'testpwd123'
            })
        )
        assert response.status_code == 200
        assert "token" in response.json_body
        assert response.json_body["token"] not in ("", None)


def test_register():
    with Client(app) as client:
        # Non-matching passwords
        response = client.http.post('/auth/register',
            headers={'Content-Type': 'application/json'},
            body=json.dumps({
                'username': 'test-user-12323523221',
                'password': 'testpwd123',
                'repeat_password': 'testpwd1234'
            })
        )
        assert response.status_code == 400
        assert response.json_body == {
            "Code": "BadRequestError",
            "Message": "Password and password repeat do not match"
        }

        # User already exists
        response = client.http.post('/auth/register',
            headers={'Content-Type': 'application/json'},
            body=json.dumps({
                'username': 'test-user',
                'password': 'testpwd123',
                'repeat_password': 'testpwd123'	
            })
        )
        assert response.status_code == 400
        assert response.json_body == {
            "Code": "BadRequestError",
            "Message": "User with this username already exists"
        }


def test_app_flow():
    with Client(app) as client:
        questions_created = []

        response = client.http.post('/auth/login',
            headers={'Content-Type': 'application/json'},
            body=json.dumps({
                'username': 'test-user',
                'password': 'testpwd123'
            })
        )
        token = response.json_body["token"]

        # List questions empty
        response = client.http.get('/questions')
        assert response.status_code == 401
        response = client.http.get('/questions',
            headers={'Authorization': 'Bearer {}'.format(token)}
        )
        assert response.status_code == 200
        assert response.json_body == []

        # Create question
        response = client.http.post('/questions',
            headers={'Authorization': 'Bearer {}'.format(token), 'Content-Type': 'application/json'},
            body=json.dumps({'question': 'What is the meaning of life?'})
        )
        assert response.status_code == 200
        assert response.json_body["question"] == 'What is the meaning of life?'
        questions_created.append(response.json_body["uid"])

        # List questions nonempty
        response = client.http.get('/questions',
            headers={'Authorization': 'Bearer {}'.format(token)}
        )
        assert response.status_code == 200
        assert len(response.json_body) != 0

        # Get question
        response = client.http.get(
            '/questions/{}'.format(response.json_body[0]["uid"]),
            headers={'Authorization': 'Bearer {}'.format(token)}
        )
        assert response.status_code == 200
        assert response.json_body["question"] == 'What is the meaning of life?'
        assert response.json_body["answers"] == []

        question_id = response.json_body["uid"]

        # Answer question
        response = client.http.post(
            '/answers/{}'.format(question_id),
            headers={'Content-Type': 'application/json'},
            body=json.dumps({'answer': '42'})
        )
        assert response.status_code == 200

        # Get question with answer
        response = client.http.get(
            '/questions/{}'.format(question_id),
            headers={'Authorization': 'Bearer {}'.format(token)}
        )
        assert response.status_code == 200
        assert response.json_body["question"] == 'What is the meaning of life?'
        assert response.json_body["answers"] != []
        assert response.json_body["answers"][0]["answer"] == '42'

        # CLean up
        for question in questions_created:
            response = client.http.delete(
                f'/questions/{question}',
                headers={'Authorization': 'Bearer {}'.format(token)}
            )
