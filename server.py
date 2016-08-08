from flask import Flask
from flask import request, render_template
import os, json

app = Flask(__name__)

@app.route('/')
def canvas():
    return render_template('canvas/index.html')

@app.route('/listcomponents/<path>')
def listComponents(path):
    path = parsePath(path, 'components')
    if os.path.isdir(path):
        return json.dumps(os.listdir(path))
    return json.dumps([])

@app.route('/getcomponent/<path>')
def getComponent(path):
    path = parsePath(path, 'components')
    if os.path.isfile(path):
        component_data = parseComponent(path)
        return json.dumps(component_data)
    return json.dumps([])
    
@app.route('/downloadpage/', methods=['POST'])
def downloadPage():
    document = request.form.get('document')
    return str(document)[20:40]

# ==================================================
#                       Logic
# ==================================================




# ==================================================
#                      Utilities
# ==================================================

def parseComponent(path):
    """ Returns a json string with the component's html and options """
    output_data = {'options': {}}
    with open(path, 'r') as component_file:
        output_data['html'] = component_file.read()
    return output_data

def parsePath(encoded_path, root):
    """ Returns a real path from the encoded path parameter """
    path = encoded_path.replace('|', '/')
    path = root+'/'+path
    return path

def chcdir():
    """ Changes dir to the current working directory """
    abspath = os.path.abspath(__file__)
    dname = os.path.dirname(abspath)
    os.chdir(dname)
    
