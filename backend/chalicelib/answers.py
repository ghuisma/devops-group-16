import os
import boto3

from uuid import uuid4
from chalice.app import NotFoundError

from boto3.dynamodb.conditions import Key


DEFAULT_USERNAME = 'default'


class AnswerDB(object):
    def list_items(self, question_id, username=DEFAULT_USERNAME):
        pass

    def add_item(self, question_id, answer):
        pass

    def get_item(self, uid, username=DEFAULT_USERNAME):
        pass
    
    def get_items_for_question(self, question_id, username=DEFAULT_USERNAME):
        pass

    def delete_item(self, uid, username=DEFAULT_USERNAME):
        pass


class DynamoAnswerDB(AnswerDB):
    def __init__(self):
        self._table = boto3.resource('dynamodb').Table(os.environ['ANSWERS_TABLE_NAME'])

    def add_item(self, question_id, answer):
        uid = str(uuid4())
        self._table.put_item(
            Item={
                'uid': uid,
                'questionId': question_id,
                'answer': answer,
            }
        )
        return uid

    def list_items(self, question_id, username=DEFAULT_USERNAME):
        response = self._table.query(
            KeyConditionExpression=Key('questionId').eq(question_id)
        )
        return response['Items']
