import os
import json
import datetime

from flask import Flask, redirect, url_for, request, render_template, jsonify
from bson.objectid import ObjectId
from werkzeug import secure_filename, SharedDataMiddleware

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

UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)

# setup upload folder configuration and url manager
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.add_url_rule('/uploads/<filename>', 'uploaded_file',
                 build_only=True)
app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
    '/uploads':  app.config['UPLOAD_FOLDER']
})

client = MongoClient(
    os.environ['DB_PORT_27017_TCP_ADDR'],
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
            pprint(item)
            items.append({
                '_id': item['_id'],
                'description': item['description'],
                'image': item['image'],
                'position': 0
                })
        
        result = {'stat':'ok', 'items': items}
    except Exception as e:
        result = {'stat': 'nok', 'error': str(e)}
    # create a hash from the current list
    return jsonify(result)

@app.route('/update', methods=['POST'])
def update():
    try:
        # Save uploaded file
        f = request.files['image']
        filename = secure_filename( f.filename)
        f.save(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(f.filename)))

        response = db.stackdb.update_one(
            {
                '_id': ObjectId(str(request.form['_id']))
            },
            {   '$set': {
                    'description': request.form['description'],
                    'image': filename
                }
            }
        )

        if response.modified_count > 0:
            result = {'stat': 'ok', 'message': 'Item ' + request.form['_id'] + ' updated.'}
        else:
            result = {'stat': 'nok', 'error': 'No item updated'}

    except Exception as e:
        result = {'stat': 'nok', 'error': str(e)}

    return jsonify(result)

@app.route('/delete', methods=['POST'])
def delete():
    try:
        response = db.stackdb.delete_one({'_id': ObjectId(request.form['_id'])})
        if response.deleted_count == 1 :
            result = {'stat': 'ok', 'message': 'Item ' + request.form['_id'] + ' deleted.'}
        else:
            result = {'stat': 'nok', 'error': 'item not found'}
    except Exception as e:
        result = {'stat': 'nok', 'error': str(e)}

    return jsonify(result)


@app.route('/add', methods=['POST'])
def add():
    try:
        # Save uploaded file
        f = request.files['image']
        filename = secure_filename(f.filename)
        f.save(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(f.filename)))

        item_doc = {
            'description': request.form['description'],
            'image': filename,
            'postition': 0
        }
        new_object_id = db.stackdb.insert_one(item_doc).inserted_id
        result = {'stat': 'ok', 'message': 'Item ' + str(new_object_id) + ' created.'}

    except Exception as e:
        result = {'stat': 'nok', 'error': str(e)}

    return jsonify(result)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
