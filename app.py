import os
import json
import datetime
from flask import Flask, redirect, url_for, request, render_template, jsonify
from bson.objectid import ObjectId
from pprint import pprint
from inspect import getmembers

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
    try:
        for item in db.stackdb.find():
            items.append({
                '_id': item['_id'], 
                'description': item['description'],
                'position': 0
                })
        
        result = {'stat':'ok', 'items': items}
    except Exception as e:
        result = {'stat': 'nok', 'error': 'cannot get items'}
    # create a hash from the current list
    return jsonify(result)

@app.route('/update', methods=['POST'])
def update():
    try:
        response = db.stackdb.update_one(
            {
                '_id': ObjectId(request.form['_id'])
            },
            {   '$set': {
                    'description': request.form['description'], 
                    'image': request.form['image']
                }
            }
        )
        if response.modified_count > 0:
            result = {'stat': 'ok'}
        else:
            result = {'stat': 'nok', 'error': 'No item updated'}

    except Exception as e:
        result = {'stat': 'nok', 'error': 'Error updating'}

    return jsonify(result)

@app.route('/delete', methods=['POST'])
def delete():
    try:
        response = db.stackdb.delete_one({'_id': ObjectId(request.form['_id'])})
        if response.deleted_count == 1 :
            result = {'stat': 'ok'}
        else:
            result = {'stat': 'nok', 'error': 'item not found'}
    except Exception as e:
        result = {'stat': 'nok', 'error': 'error deleting'}

    return jsonify(result)


@app.route('/add', methods=['POST'])
def add():
    try:
        item_doc = {
            'description': request.form['description'],
            'image': request.form['image']
        }
        new_object_id = db.stackdb.insert_one(item_doc).inserted_id
        result = {'stat': 'ok', 'new_object_id': new_object_id}

    except Exception as e:
        result = {'stat': 'nok', 'error': 'cannot add new item'}

    return jsonify(result)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
