const express = require('express')
const router = express.Router()
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const notesFilePath = path.join(__dirname, 'notes.json');

; // 모든 JSON 파일이 있는 디렉토리 경로
router.use(express.static(path.join(__dirname, 'public')));
router.use(bodyParser.json()); 


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

const deletedNotesDirectory = path.join(__dirname, 'jsonDirectory')
const newJsonFilePath = path.join(deletedNotesDirectory, `deleted_notes_${Date.now()}.json`);


router.delete('/api/notes/delete', (req, res) => {
  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred' });
    }
    const notes = JSON.parse(data);
    const deletedNotes = [...notes];

    fs.writeFile(notesFilePath, '[]', (err) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred' });
      }})
    
    fs.writeFile(newJsonFilePath, JSON.stringify(deletedNotes, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred' });
      }
      res.json({ newJsonFilePath });
    });
  });
});

router.get('/api/notes/getDeletedNotes', (req, res) => {
  const newJsonFilePath = req.query.file;

  if (!newJsonFilePath) {
    return res.status(400).json({ error: 'No file provided.' });
  }

  fs.readFile(newJsonFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred while reading the file.' });
    }

    const newData = JSON.parse(data);
    res.json(newData);
  });
});

// router.get('/api/notes/delete', (req, res) => {
//   fs.readdir(newJsonFilePath, (err, files) => {
//     if (err) {
//       return res.status(500).json({ error: 'An error occurred while reading the directory.' });
//     }
//     const allDeletedNotes = [];
//     files.forEach((file) => {
//       const filePath = path.join(deletedNotesDirectory, file);
//       try {
//         const data = fs.readFileSync(filePath, 'utf8');
//         const jsonData = JSON.parse(data);
//         allDeletedNotes.push(jsonData);
//       } catch (err) {
//         console.error('Error reading file:', err);
//       }
//     });
//     res.json(allDeletedNotes);
//   });
// });

module.exports = router