const express = require('express')
const router = express.Router()
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

router.use(express.static(path.join(__dirname, 'public')));
router.use(bodyParser.json()); 
const notesFilePath = path.join(__dirname, 'notes.json');

if (!fs.existsSync(notesFilePath)) {
  fs.writeFileSync(notesFilePath, '[]');
}

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

router.get('/api/notes', (req, res) => {
  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred' });
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

router.post('/api/notes', (req, res) => {

  const { avatar , content } = req.body;
  if (!content) {
    return res.status(500).json({ error: 'content are required.' });
  }

  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred ' });
    }
    const notes = JSON.parse(data);
    const newNote = { id: Date.now(), avatar , content }; 
    notes.push(newNote);
    fs.writeFile(notesFilePath, JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred' });
      }
      res.json(newNote);
    });
  });
});

router.delete('/api/notes/delete', (req, res) => {
  
  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred ' });
    }
    const notes = JSON.parse(data);
    notes.splice(notes)
   
    fs.writeFile(notesFilePath, JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred' });
      }
      res.json({ message: 'Note deleted successfully.' });
    });
  });
});

module.exports = router