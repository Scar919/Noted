const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');
const PORT = 3001;

const allNotes = require('./db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    res.json(allNotes.slice(1));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) =>{
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.joinf(__dirname, './public/index.html'));
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    if(!Array.isArray(allNotes))
    allNotes = [];

    if(allNotes.length === 0)
    allNotes.push(0);

    newNote.id = allNotes[0];
    allNotes[0]++

    allNotes.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(allNotes, null, 2)
    );
    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    for(let i = 0; i < allNotes.length; i++) {
        let note = allNotes[i];

        if (note.id == id) {
            allNotes.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, 'db/db/json'),
                JSON.stringify(allNotes, null, 2)
            );
            break;
        }
    }
    res.json(true);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});



