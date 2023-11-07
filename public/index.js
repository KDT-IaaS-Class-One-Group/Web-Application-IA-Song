document.addEventListener('DOMContentLoaded', () => {
  const noteContent = document.getElementById('noteContent');
  const doneButton = document.getElementById('doneButton');
  const noteContainer = document.getElementById('noteContainer');
  
  const now = new Date();	
  const hours = now.getHours();	
  const avatar= "👤"
  const deleteButton= document.getElementById("deleteButton")


  // 이부분 
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
        return response.json()
      })
      .then((data) => {
        if (data.newJsonFilePath) {
          // 2. 클라이언트에서 가져온 파일 위치 또는 파일명을 사용하여 JSON 파일을 읽어옴
          fetch(`/api/notes/getDeletedNotes?file=${data.newJsonFilePath}`)
            .then((response) => response.json())
            .then((newData) => {
              // 3. 읽어온 JSON 데이터를 사용하여 HTML의 div 박스에 데이터를 동적으로 나타냄
              const notetext = document.getElementById('notetext')
                // 데이터를 div 박스에 추가
                const div = document.createElement('div');
                div.className = 'sidebox'
                const combinedContent = newData.map(item => item.content).join(' ')
                div.style.color = "white"
                div.textContent = `👤${combinedContent}` // 예시: 데이터의 내용을 텍스트로 표시
                notetext.appendChild(div);
            })
          }
        })
      .catch((error) => {
        console.error('An error occurred while deleting the note:', error);
      })
    }

    // fetch('/api/notes/getDeletedNotes')
    // .then((response) => response.json())
    // .then((allDeletedNotes) => {
    // const notetext = document.getElementById('notetext');
    //     const div = document.createElement('div');
    //     div.className = 'sidebox';
    //     const combinedContent = allDeletedNotes.map(item => item.content).join(' ')
    //     div.style.color = 'white';
    //     div.textContent = `👤${combinedContent}`; // 예시: 데이터의 내용을 텍스트로 표시
    //     notetext.appendChild(div);
    //   });
    
    
  fetch('/api/notes')
    .then((response) => response.json())
    .then((notes) => {
      notes.forEach((note) => displayNoteBox(note));
    });
});