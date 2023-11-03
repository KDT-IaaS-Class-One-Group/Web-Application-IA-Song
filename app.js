const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); 
const notesFilePath = path.join(__dirname, 'notes.json');

if (!fs.existsSync(notesFilePath)) {
  fs.writeFileSync(notesFilePath, '[]');
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/api/notes', (req, res) => {
  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred while reading notes.' });
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {

  const { avatar , content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'content are required.' });
  }

  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred while reading notes.' });
    }
    const notes = JSON.parse(data);
    const newNote = { id: Date.now(), avatar , content }; 
    notes.push(newNote);
    fs.writeFile(notesFilePath, JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred while saving the note.' });
      }
      res.json(newNote);
    });
  });
});

app.delete('/api/notes/delete', (req, res) => {
  
  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred while reading notes.' });
    }
    const notes = JSON.parse(data);

   
    fs.writeFile(notesFilePath, JSON.stringify(notes, null, 1), (err) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred while deleting the note.' });
      }
      res.sendStatus(204); // 성공적으로 삭제된 경우 204 상태 코드 반환
    });
  });
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});