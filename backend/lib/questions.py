import os
import boto3

from uuid import uuid4

from boto3.dynamodb.conditions import Key


DEFAULT_USERNAME = 'default'


class QuestionDB(object):
    def list_items(self, username=DEFAULT_USERNAME):
        pass

    def add_item(self, question, username=DEFAULT_USERNAME):
        pass

    def get_item(self, uid, username=DEFAULT_USERNAME):
        pass

    def delete_item(self, uid, username=DEFAULT_USERNAME):
        pass

    def update_item(self, uid, question=None, username=DEFAULT_USERNAME):
        pass


class DynamoQuestionDB(QuestionDB):
    def __init__(self):
        self._table = boto3.resource('dynamodb').Table(os.environ['QUESTIONS_TABLE_NAME'])

    def list_items(self, username=DEFAULT_USERNAME):
        response = self._table.query(
            KeyConditionExpression=Key('username').eq(username)
        )
        return response['Items']

    def add_item(self, question, username=DEFAULT_USERNAME):
        uid = str(uuid4())
        self._table.put_item(
            Item={
                'uid': uid,
                'username': username,
                'question': question,
                'url': f"https://app.onequestionsurvey.nl/answer-question/{uid}"
            }
        )
        return uid

    def get_item(self, uid, username=DEFAULT_USERNAME):
        response = self._table.get_item(
            Key={
                'username': username,
                'uid': uid,
            },
        )
        return response['Item']

    def delete_item(self, uid, username=DEFAULT_USERNAME):
        self._table.delete_item(
            Key={
                'uid': uid,
                'username': username,
            }
        )

    def update_item(self, uid, question=None, username=DEFAULT_USERNAME):
        item = self.get_item(uid, username)
        if question is not None:
            item['question'] = question
        self._table.put_item(Item=item)


class InMemoryQuestionDB(QuestionDB):
    def __init__(self, state=None):
        if state is None:
            state = {}
        self._state = state

    def list_all_items(self):
        all_items = []
        for username in self._state:
            all_items.extend(self.list_items(username))
        return all_items

    def list_items(self, username=DEFAULT_USERNAME):
        return list(self._state.get(username, {}).values())

    def add_item(self, question, username=DEFAULT_USERNAME):
        if username not in self._state:
            self._state[username] = {}
        uid = str(uuid4())
        self._state[username][uid] = {
            'uid': uid,
            'username': username,
            'question': question,
            'url': f"https://app.onequestionsurvey.nl/answer-question/{uid}"
        }
        return uid

    def get_item(self, uid, username=DEFAULT_USERNAME):
        return self._state[username][uid]

    def delete_item(self, uid, username=DEFAULT_USERNAME):
        del self._state[username][uid]

    def update_item(self, uid, question=None, username=DEFAULT_USERNAME):
        item = self._state[username][uid]
        if question is not None:
            item['question'] = question
