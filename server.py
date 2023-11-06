from flask import Flask, render_template , request, jsonify
import os
import json
app = Flask(__name__)

notes_file_path = 'notes.json'

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)