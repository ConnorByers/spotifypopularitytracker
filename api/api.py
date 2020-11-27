from flask import Flask
import time


app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return {'time': time.asctime(time.localtime(time.time()))}