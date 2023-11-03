document.addEventListener('DOMContentLoaded', () => {
  const noteContent = document.getElementById('noteContent');
  const doneButton = document.getElementById('doneButton');
  const noteContainer = document.getElementById('noteContainer');
  const now = new Date();	// 현재 날짜 및 시간
  const hours = now.getHours();	// 시간
  const avatar= "👤"
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
  function generateUniqueId() {
    const random = Math.floor(Math.random() * 100); 
    return `note-${random}`;
  }
  
 
   function displayNoteBox(note) {
    const noteBox = document.createElement('div');
    noteBox.className = 'note-box';
    noteBox.dataset.id = note.id; // Add data attribute for the note's ID
    noteBox.innerHTML = `"👤"<p>${note.content}</p>`;
    noteBox.id =  generateUniqueId()
    noteBox.setAttribute('data-note-id', note.id);
    // const contentParagraph = noteBox.querySelector('p');
    // contentParagraph.addEventListener('click', () => {
    //   contentParagraph.classList.toggle('selected');
    // });

    noteContainer.appendChild(noteBox);
  }

  
//   function displayEditModal(note) {
//     const editNoteTitle = document.getElementById('editNoteTitle');
//     const editNoteContent = document.getElementById('editNoteContent');
//     const updateButton = document.getElementById('updateButton');

//     // 모달 내용 초기화
//     if (editNoteTitle && editNoteContent && updateButton) {
//       editNoteTitle.value = note.title;
//       editNoteContent.value = note.content;

//       // 모달 보이기
//       editModal.style.display = 'block';

//       updateButton.addEventListener('click', () => {
//         const updatedTitle = editNoteTitle.value;
//         const updatedContent = editNoteContent.value;

//         if (updatedTitle && updatedContent) {
//           const updatedNoteData = { title: updatedTitle, content: updatedContent };

//           fetch(`/api/notes/${note.id}`, {
//             method: 'PUT',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(updatedNoteData),
//           })
//             .then((response) => response.json())
//             .then((updatedNote) => {
//               editModal.style.display = 'none';

//               // Update the note on the page
//               note.title = updatedTitle;
//               note.content = updatedContent;
//               const noteBox = document.querySelector('.note-box[data-id="' + note.id + '"]');
//               noteBox.innerHTML = `<h3>${updatedTitle}</h3><p>${updatedContent}</p>`;
//             });
//         }
//       })
//       deleteButton.addEventListener('click', () => {
//       deleteNote(note.id);
//     });

//     function deleteNote(noteId) {
//   // 서버에서 노트 삭제 요청을 보내는 코드 작성
//   fetch(`/api/notes/${noteId}`, {
//     method: 'DELETE',
//   })
//     .then((response) => {
//       if (response.status === 204) {
//         // 삭제가 성공하면 페이지에서 노트 박스 제거
//         const noteBox = document.querySelector('.note-box[data-id="' + noteId + '"]');
//         if (noteBox) {
//           noteContainer.removeChild(noteBox);
//           // 모달 닫기
//           editModal.style.display = 'none';
//         }
//       } else {
//         console.error('Failed to delete the note.');
//       }
//     })
//     .catch((error) => {
//       console.error('An error occurred while deleting the note:', error);
//     });
// }
//       if (!closeEditModalButton) {
//         // 닫기 버튼이 없을 때만 추가
//         const closeModalButton = document.createElement('button');
//         closeModalButton.id = 'closeEditModal'; // ID 설정
//         closeModalButton.addEventListener('click', () => {
//           editModal.style.display = 'none';
//         });
//         closeModalButton.textContent = 'Close';
//         editModal.appendChild(closeModalButton);
//       }
//       closeEditModalButton.addEventListener('click', () => {
//         editModal.style.display = 'none';
//       });
//     }};
  
  

  // 초기 노트 목록을 불러오기
  fetch('/api/notes')
    .then((response) => response.json())
    .then((notes) => {
      notes.forEach((note) => displayNoteBox(note));
    });
});