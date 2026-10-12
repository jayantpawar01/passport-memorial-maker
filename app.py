from flask import Flask, render_template, jsonify
import json
from pathlib import Path

app = Flask(__name__)
BASE_DIR = Path(__file__).resolve().parent
CONFIG_PATH = BASE_DIR / 'app-config.json'

with CONFIG_PATH.open('r', encoding='utf-8') as f:
    app_config = json.load(f)

@app.route('/')
def index():
    return render_template('index.html', config=app_config)

@app.route('/api/config')
def config_api():
    return jsonify(app_config)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
