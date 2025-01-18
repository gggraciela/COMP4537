class Note {
  constructor(id, content = "") {
    this.id = id;
    this.content = content;
    this.timestamp = new Date().toISOString();
  }

  save() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const existingNoteIndex = notes.findIndex((note) => note.id === this.id);
    if (existingNoteIndex >= 0) {
      notes[existingNoteIndex] = this; // Update existing note
    } else {
      notes.push(this); // Add new note
    }
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  remove() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const updatedNotes = notes.filter((note) => note.id !== this.id);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  }
}

function loadWriterPage() {
  const notesContainer = document.getElementById("notes-container");
  const addButton = document.getElementById("add-button");
  const lastSaved = document.getElementById("last-saved");

  function loadNotes() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notesContainer.innerHTML = ""; // Clear existing content
    notes.forEach((noteData) => {
      const note = new Note(noteData.id, noteData.content);
      addNoteToDOM(note);
    });
  }

  function addNoteToDOM(note) {
  const noteDiv = document.createElement("div");
  const textarea = document.createElement("textarea");
  const removeButton = document.createElement("button");

  textarea.value = note.content;
  removeButton.textContent = MESSAGES.REMOVE_BUTTON;
  removeButton.classList.add("remove-button"); // Apply the red button style

  removeButton.addEventListener("click", () => {
    note.remove();
    loadNotes(); // Refresh DOM
  });

  textarea.addEventListener("input", () => {
    note.content = textarea.value;
    note.timestamp = new Date().toISOString();
    note.save();
    updateLastSaved();
  });

  noteDiv.appendChild(textarea);
  noteDiv.appendChild(removeButton);
  notesContainer.appendChild(noteDiv);
}


  function updateLastSaved() {
    const now = new Date();
    lastSaved.textContent = `${MESSAGES.LAST_SAVED} ${now.toLocaleTimeString()}`;
  }

  addButton.addEventListener("click", () => {
    const newNote = new Note(Date.now().toString());
    newNote.save();
    loadNotes();
  });

  loadNotes(); // Initial load
  setInterval(updateLastSaved, 2000); // Update last saved timestamp
}

function loadReaderPage() {
  const notesDisplay = document.getElementById("notes-display");
  const lastRetrieved = document.getElementById("last-retrieved");

  function displayNotes() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notesDisplay.innerHTML = ""; // Clear existing content
    notes.forEach((note) => {
      const noteDiv = document.createElement("div");
      noteDiv.classList.add("note-box"); // Add a class for styling
      noteDiv.textContent = note.content || "(Empty Note)";
      notesDisplay.appendChild(noteDiv);
    });
    const now = new Date();
    lastRetrieved.textContent = `${MESSAGES.LAST_RETRIEVED} ${now.toLocaleTimeString()}`;
  }

  displayNotes(); // Initial load
  setInterval(displayNotes, 2000); // Refresh notes every 2 seconds
}


// Initialize the correct functionality based on the page
if (document.body.contains(document.getElementById("notes-container"))) {
  loadWriterPage();
} else if (document.body.contains(document.getElementById("notes-display"))) {
  loadReaderPage();
}
