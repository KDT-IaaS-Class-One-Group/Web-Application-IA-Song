from flask import Flask, render_template , request, jsonify
import os
import json
app = Flask(__name__)

notes_file_path = 'notes.json'


if not os.path.exists(notes_file_path):
    with open(notes_file_path, 'w') as file:
        json.dump([], file)
notes = []
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/notes', methods=['GET'])
def get_notes():
    with open(notes_file_path, 'r') as file:
        notes = json.load(file)
    return jsonify(notes)
    
@app.route('/api/notes', methods=['POST'])
def create_note():
    data = request.json
    if 'content' not in data:
        return jsonify({'error': 'Content is required'}), 400

    with open(notes_file_path, 'r') as file:
        notes = json.load(file)

    new_note = {
        'id': len(notes) + 1,
        'avatar': data.get('avatar', ''),
        'content': data['content']
    }

    notes.append(new_note)

    with open(notes_file_path, 'w') as file:
        json.dump(notes, file, indent=2)

    return jsonify(new_note), 201

@app.route('/api/notes/delete', methods=['DELETE'])
def delete_all_notes():
    global notes
    notes = []
    with open('notes.json', 'w') as file:
        json.dump(notes, file, indent=2)
    return jsonify({'message': 'All notes deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True)