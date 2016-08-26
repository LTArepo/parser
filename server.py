from flask import Flask
from flask import request, render_template, send_file

import os, json
from shutil import copyfile, make_archive, rmtree

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
    doc = request.form.get('document')
    doc = doc.encode('utf-8')

    start = doc.find('<!-- start of canvas -->')+24
    end = doc.find('<!-- end of canvas -->')
    canvas = doc[start:end]

    generateDownloadZip(canvas)

    return send_file('output/tmp/output.zip', attachment_filename='output.zip', as_attachment=True, mimetype='application/zip')

@app.route('/loadpage/', methods=['POST'])
def loadPage():
    data = request.form.get('save_file')

# ==================================================
#                       Logic
# ==================================================

def generateIndex(canvas):
    with open('output/canvas_templates/standard.html') as f:
        content = f.read()
        content = replace(content, canvas, '<!-- {{canvas}} -->')
        return content

def generateSave(canvas):
    output = {} 
    output['canvas'] = canvas
    return json.dumps(output)
    
def generateDownloadZip(canvas):
    if os.path.exists('output/zip_template'): rmtree('output/zip_template')
    
    # Directory structure generation
    dirs = ['output/zip_template/css', 'output/zip_template/js', 'output/zip_template/data']
    for d in dirs:
        if not os.path.exists(d): os.makedirs(d)

    # Move updated files in
    copyfile('static/components/css/components.css', 'output/zip_template/css/main.css')
    copyfile('static/components/js/main.js', 'output/zip_template/js/main.js')
    with open('output/zip_template/data/save.json', 'w') as save_file:
        save_file.write(generateSave(canvas))
    with open('output/zip_template/index.html', 'w') as index_file:
        index = generateIndex(canvas)
        index_file.write(index)
    
    # Zip generation
    if os.path.exists('output/tmp/output.zip'):
        os.remove('output/tmp/output.zip')

    make_archive('output/tmp/output', 'zip', 'output/zip_template')


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

def replace(content, addition, token):
	x = content.find(token)
	return content[:x] + addition + content[x:].replace(token, '')

def chcdir():
    """ Changes dir to the current working directory """
    abspath = os.path.abspath(__file__)
    dname = os.path.dirname(abspath)
    os.chdir(dname)
    
