import os
import json
import getpass
import argparse
import hashlib
import hmac
import base64

import boto3
from boto3.dynamodb.types import Binary


class UserDB(object):
    def get_table_name(self, stage):
        with open(os.path.join('.chalice', 'config.json')) as f:
            data = json.load(f)
        return data['stages'][stage]['environment_variables']['USERS_TABLE_NAME']
    
    def encode_password(self, password, salt=None):
        if salt is None:
            salt = os.urandom(32)
        rounds = 100000
        hashed = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, rounds)
        return {
            'hash': 'sha256',
            'salt': salt,
            'rounds': rounds,
            'hashed': hashed,
        }

    def create_user(self, username=None, password=None, email="", first_name="", last_name=""):
        pass

    def list_users(self):
        pass

    def get_user(self, username):
        pass

    def test_password(self, username=None, password=None):
        pass


class DynamoUserDB(UserDB):
    def __init__(self, stage=None):
        self._cli = False
        if stage is None:
            table_name = os.environ.get('USERS_TABLE_NAME')
        else:
            table_name = self.get_table_name(stage)
            self._cli = True
        self._table = boto3.resource('dynamodb').Table(table_name)

    def create_user(self, username=None, password=None, email="", first_name="", last_name=""):
        if self._cli:
            username = input('Username: ').strip()
            password = getpass.getpass('Password: ').strip()
        if not (username and password):
            return
        password_fields = self.encode_password(password)
        item = {
            'username': username,
            'hash': password_fields['hash'],
            'salt': Binary(password_fields['salt']),
            'rounds': password_fields['rounds'],
            'hashed': Binary(password_fields['hashed']),
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
        }
        self._table.put_item(Item=item)

    def list_users(self):
        if self._cli:
            for item in self._table.scan()['Items']:
                print(item['username'])
        else:
            return self._table.scan()['Items']

    def get_user(self, username):
        user_record = self._table.get_item(Key={'username': username}).get('Item')
        if self._cli and user_record is not None:
            print(f"Entry for user: {username}")
            for key, value in user_record.items():
                if isinstance(value, Binary):
                    value = base64.b64encode(value.value).decode()
                print(f"  {key:10}: {value}")
        return user_record
    
    def test_password(self, username=None, password=None) -> bool:
        if self._cli:
            username = input('Username: ').strip()
            password = getpass.getpass('Password: ').strip()
        if not (username and password):
            return False
        item = self._table.get_item(Key={'username': username})['Item']
        encoded = self.encode_password(password, salt=item['salt'].value)
        if hmac.compare_digest(encoded['hashed'], item['hashed'].value):
            if self._cli:
                print("Password verified.")
            return True
        if self._cli:
            print("Password verification failed.")
        return False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('-c', '--create-user', action='store_true')
    parser.add_argument('-t', '--test-password', action='store_true')
    parser.add_argument('-g', '--get-user')
    parser.add_argument('-s', '--stage', default='dev')
    parser.add_argument('-l', '--list-users', action='store_true')
    args = parser.parse_args()
    stage = args.stage
    userDB = DynamoUserDB(stage)
    if args.create_user:
        userDB.create_user()
    elif args.list_users:
        userDB.list_users()
    elif args.test_password:
        userDB.test_password()
    elif args.get_user is not None:
        userDB.get_user(args.get_user)


if __name__ == '__main__':
    main()