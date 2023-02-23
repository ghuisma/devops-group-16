from chalice import Chalice

app = Chalice(app_name='one_question_survey')


@app.route('/', methods=['GET'])
def index_get():
    return {'hello': 'world!'}

@app.route('/', methods=['POST'])
def index_post():
    return app.current_request.json_body
