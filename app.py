from flask import Flask, request, jsonify, render_template
import sys
import io
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/manifest.json')
def manifest():
    return app.send_static_file('manifest.json')

@app.route('/service-worker.js')
def service_worker():
    return app.send_static_file('service-worker.js')

@app.route('/execute-python', methods=['POST'])
def execute_python():
    data = request.get_json()
    user_code = data.get('code', '')

    output = io.StringIO()
    sys.stdout = output

    try:
        exec(user_code)
    except Exception as e:
        sys.stdout = sys.__stdout__
        return jsonify({'error': str(e)})

    sys.stdout = sys.__stdout__

    return jsonify({'output': output.getvalue()})

if __name__ == '__main__':
    app.run(debug=True)
