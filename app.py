import os
from flask import Flask, redirect, url_for, request, render_template, jsonify
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient(
    'localhost', #os.environ['DB_PORT_27017_TCP_ADDR'],
    27017)
db = client.stackdb

@app.route('/')
def todo():
    return render_template('index.html')

@app.route('/get')
def get():
    _items = db.stackdb.find()
    items = [item for item in _items]
    return jsonify(items)

@app.route('/update')
def update():
    return jsonify()

@app.route('/new', methods=['POST'])
def new():
    item_doc = {
        'name': request.form['name'],
        'description': request.form['description']
    }
    response = db.stackdb.insert_one(item_doc)
    display = [1, response]
    return jsonify(display)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
