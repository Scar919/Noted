//import required modules
const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');

//port number to listen on
const PORT = process.env.PORT || 3001;

//import array of notes from JSON file
let allNotes = require('./db/db.json');

//configure express middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//get all notes
app.get('/api/notes', (req, res) => {
    res.json(allNotes.slice(1));
});

//serve home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//serve note page
app.get('/notes', (req, res) =>{
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//search-all route for non-existent paths
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//add a new note
app.post('/api/notes', (req, res) => {
    const newNote = req.body;

     //if array of notes hasn't been initialized, create an empty array
    if(!Array.isArray(allNotes)) {
        allNotes = [];
    }

    //if no new notes add counter to beginning of array
    if(allNotes.length === 0) {
        allNotes.push({ id: 1, title: "", text: "" }); // Changed counter to an object with a default note
    }

    //assign id to new note and increment the counter
    newNote.id = allNotes[allNotes.length - 1].id + 1;

    //add new note to array and write to JSON file
    allNotes.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(allNotes, null, 2)
    );
    res.json(newNote);
});

//delete note by id
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;

    //loop through all notes to find matching ID
    for(let i = 0; i < allNotes.length; i++) {
        let note = allNotes[i];

        if (note.id == id) {
            allNotes.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(allNotes, null, 2)
            );
            break;
        }
    }
    res.json(true);
});

//start server 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});



