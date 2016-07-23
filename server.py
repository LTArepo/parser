from flask import Flask
from flask import render_template
import os

app = Flask(__name__)

@app.route('/')
def canvas():
    return render_template('canvas/index.html')


# ==================================================
#                      Utilities
# ==================================================

def chcdir():
    abspath = os.path.abspath(__file__)
    dname = os.path.dirname(abspath)
    os.chdir(dname)
    
