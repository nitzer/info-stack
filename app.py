import os
import json
import datetime
from flask import Flask, redirect, url_for, request, render_template, jsonify
from bson.objectid import ObjectId

from pymongo import MongoClient

# To translate _id and datetime into mongodb
class JSONEncoder(json.JSONEncoder):
    ''' extend json-encoder class'''
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


app = Flask(__name__)

client = MongoClient(
    '127.0.0.1', #os.environ['DB_PORT_27017_TCP_ADDR'],
    27017)
db = client.stackdb
app.json_encoder = JSONEncoder

@app.route('/')
def items():
    return render_template('index.html')

@app.route('/get')
def get():
    items = []
    for item in db.stackdb.find():
        items.append({
            '_id': item['_id'], 
            'description': item['description'],
            'position': 0
            })
    # create a hash from the current list
    return jsonify({'items': items})

@app.route('/update')
def update():
    return jsonify([])

@app.route('/delete/<id>')
def delete(id):
    return db.stackdb.delete_one({'_id': id})

@app.route('/add', methods=['POST'])
def add():
    item_doc = {
        'description': request.form['description'],
        'image': request.form['image']
    }
    response = db.stackdb.insert_one(item_doc)

    return jsonify({'stat': 'ok', '_id': response})

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
