from server import app
from server import chcdir

if __name__ == '__main__':
    chcdir()
    app.run(debug=True)

