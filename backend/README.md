# Backend: Chalice, AWS Lambda + API Gateway

The web framework we use is Chalice for Python. First setup for development:

1. Install python 3
2. Create and activate a virtual environment:
```
$ python3 -m venv venv
$ ./venv/bin/activate
```
3. Install Chalice:
```
$ pip install chalice
```
4. Add AWS credentials to config, use credentials of IAM user `LambdaUser`:
```
$ mkdir ~/.aws
$ cat >> ~/.aws/config
[default]
aws_access_key_id=ACCESS_KEY_HERE
aws_secret_access_key=SECRET_ACCESS_KEY
region=eu-central-1
```
5. You can now deploy the Chalice app to the dev Lambda function + API Gateway, after which the API will be served by the URL that is printed to the console:
```
$ chalice deploy
```
6. To remove all resources again (Lambda + Gateway):
```
$ chalice delete
```
7. Instructions for running locally + testing will be added later (or check Chalice docs).