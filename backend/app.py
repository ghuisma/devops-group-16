import base64

import boto3
from chalice.app import Chalice, AuthResponse
from chalicelib import auth, questions, answers, users


app = Chalice(app_name='one_question_survey')
app.debug = True
_QUESTIONS_DB = None
_ANSWERS_DB = None
_USER_DB = None
_AUTH_KEY = None
_SSM_AUTH_KEY_NAME = '/one-question-survey/auth-key'


def get_auth_key():
    global _AUTH_KEY
    if _AUTH_KEY is None:
        base64_key = boto3.client('ssm').get_parameter(
            Name=_SSM_AUTH_KEY_NAME,
            WithDecryption=True
        )['Parameter']['Value']
        _AUTH_KEY = base64.b64decode(base64_key)
    return _AUTH_KEY


def get_users_db():
    global _USER_DB
    if _USER_DB is None:
        _USER_DB = users.DynamoUserDB()
    return _USER_DB


def get_questions_db():
    global _ANSWERS_DB
    if _ANSWERS_DB is None:
        _ANSWERS_DB = questions.DynamoQuestionDB()
    return _ANSWERS_DB


def get_answers_db():
    global _QUESTIONS_DB
    if _QUESTIONS_DB is None:
        _QUESTIONS_DB = answers.DynamoAnswerDB()
    return _QUESTIONS_DB


def get_authorized_username(current_request):
    return current_request.context['authorizer']['principalId']


@app.authorizer()
def jwt_auth(auth_request):
    token = auth_request.token
    decoded = auth.decode_jwt_token(token, get_auth_key())
    return AuthResponse(routes=['*'], principal_id=decoded['sub'])


# --------------------------------------------------------
# Auth endpoints
# --------------------------------------------------------

@app.route('/auth/login', methods=['POST'])
def login():
    body = app.current_request.json_body
    record = get_users_db().get_user(body.get('username'))
    jwt_token = auth.get_jwt_token(body['username'], body['password'], record, get_auth_key())
    return {'token': jwt_token}


@app.route('/auth/register', methods=['POST'])
def register():
    body = app.current_request.json_body
    # TODO check if password matches repeated password
    # TODO check if username is already taken
    get_users_db().create_user(
        body.get('username'),
        body.get('password'),
        body.get('email', ''),
        body.get('first_name', ''),
        body.get('last_name', ''),
    )


# --------------------------------------------------------
# Question endpoints
# --------------------------------------------------------

@app.route('/questions', methods=['GET'], authorizer=jwt_auth)
def list_questions():
    username = get_authorized_username(app.current_request)
    return get_questions_db().list_items(username=username)


@app.route('/questions', methods=['POST'], authorizer=jwt_auth)
def create_question():
    body = app.current_request.json_body
    username = get_authorized_username(app.current_request)
    return get_questions_db().add_item(
        username=username,
        question=body['question'],
    )


@app.route('/questions/{uid}', methods=['GET'], authorizer=jwt_auth)
def get_question(uid):
    username = get_authorized_username(app.current_request)
    # TODO serve answers as well
    return get_questions_db().get_item(uid, username=username)


@app.route('/questions/{uid}', methods=['POST'], authorizer=jwt_auth)
def update_question(uid):
    body = app.current_request.json_body
    username = get_authorized_username(app.current_request)
    # TODO check if question exists
    get_questions_db().update_item(
        uid,
        question=body.get('question'),
        username=username
    )


# --------------------------------------------------------
# Answer endpoint
# --------------------------------------------------------

@app.route('/answers/{question_id}', methods=['POST'])
def create_answer(question_id):
    body = app.current_request.json_body
    # TODO check if question exists
    get_answers_db().add_item(
        question_id=question_id,
        answer=body['answer'],
    )
