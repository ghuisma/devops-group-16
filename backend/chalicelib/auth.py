import hashlib
import hmac
import datetime
from uuid import uuid4

import jwt
from chalice.app import UnauthorizedError


def get_jwt_token(username, password, record, secret):
    actual = hashlib.pbkdf2_hmac(
        record['hash'],
        password.encode('utf-8'),
        record['salt'].value,
        record['rounds']
    )
    expected = record['hashed'].value
    if hmac.compare_digest(actual, expected):
        now = datetime.datetime.utcnow()
        unique_id = str(uuid4())
        payload = {
            'sub': username,
            'iat': now,
            'nbf': now,
            'jti': unique_id,
        }
        return jwt.encode(payload, secret, algorithm='HS256')
    raise UnauthorizedError('Invalid username or password')


def decode_jwt_token(token, secret):
    token = token.replace("Bearer ", "")
    return jwt.decode(token, secret, algorithms=['HS256'])
