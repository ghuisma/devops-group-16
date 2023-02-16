from chalice import Chalice

app = Chalice(app_name='one_question_survey')


@app.route('/')
def index():
    return {'hello': 'world!'}
