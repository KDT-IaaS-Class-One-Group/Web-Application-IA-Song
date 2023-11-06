document.addEventListener('DOMContentLoaded', () => {
  const noteContent = document.getElementById('noteContent');
  const doneButton = document.getElementById('doneButton');
  const noteContainer = document.getElementById('noteContainer');
  const now = new Date();	
  const hours = now.getHours();	
  const avatar= "👤"
  const deleteButton= document.getElementById("deleteButton")
  doneButton.addEventListener('click', () => {
    const content = noteContent.value;
    if (content) {
      const noteData = { avatar , content };
      fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      })
        .then((response) => response.json())
        .then((note) => {
          noteContent.value = '';
          displayNoteBox(note);
        });
    }
  });

  const dropdown = document.getElementById('sbm');
  const dropdownContent = dropdown.querySelector('.dropdown-content');
  const dropbtn = dropdown.querySelector('.dropbtn');
  
  
  dropbtn.addEventListener('click', function() {
      dropdownContent.classList.toggle('show');
  });
  

  window.addEventListener('click', function(event) {
      if (!event.target.matches('.dropbtn')) {
          if (dropdownContent.classList.contains('show')) {
              dropdownContent.classList.remove('show');
          }
      }
  });

  function generateUniqueId() {
    const random = Math.floor(Math.random() * 100); 
    return `note-${random}`;
  }
  
 
   function displayNoteBox(note) {
    const noteBox = document.createElement('div');
    noteBox.className = 'note-box';
    noteBox.dataset.id = note.id; 
    noteBox.style.font="Arial, sans-serif"
    noteBox.innerHTML = `"👤"<p>${note.content}</p>`;
    noteBox.id =  generateUniqueId()
    noteBox.setAttribute('data-note-id', note.id);
    noteContainer.appendChild(noteBox);
  }
  
  deleteButton.addEventListener('click', () => {
    deleteNote();
  });

  function deleteNote() {
    fetch(`/api/notes/delete`, {
      method: 'DELETE',
    })
      .then((response) => {
        const noteContainer = document.getElementById('noteContainer');
        while(noteContainer.hasChildNodes()){
        noteContainer.removeChild(noteContainer.firstChild);}
      })
      .catch((error) => {
        console.error('An error occurred while deleting the note:', error);
      })
    }

  fetch('/api/notes')
    .then((response) => response.json())
    .then((notes) => {
      notes.forEach((note) => displayNoteBox(note));
    });
});