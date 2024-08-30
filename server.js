const express = require('express'); // Framework used to build web server. HTTP request/response simplification.
const path = require('path'); // Provides utilities for working with file and directory paths
const fs = require('fs'); // This module provides an API for interacting with the file system, allowing me to read and write files.
const app = express(); // Initializes an Express session
const PORT = process.env.PORT || 3000; // Specific port the server will listen on.


app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true})); // Parses URL-encoded data with extended syntax. Allows for rich object and array support.
app.use(express.static('public')); // This serves static files (e.g., HTML, CSS, JS) from the public directory

app.get('/api/notes', (req, res) => { // This route reads the notes stored in a db.json file and sends them back as a JSON response.
    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => { // Reads the content of the db.json file, which is assumed to contain an array of notes.
        if (err) throw err; // Throws error if necessary
        res.json(JSON.parse(data)); // Parses the data from the file and sends it as a JSON response
    });
});;

app.post('/api/notes', (req,res) => { // Allows user to add new notes
    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => { // Reads existing notes from 'db.json'
        if (err) throw err; // Throws error if necessary
        const notes = JSON.parse(data);  
        const newNote = req.body;
        newNote.id = Date.now().toString(); // Assigns unique ID to the new note using the current timestamp.
        notes.push(newNote); // Adds the new note to the array of existing notes.
        fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) =>{ // Saves the updated array of notes back to 'db.json'.
            if (err) throw err;
            res.json(newNote); // Sends the new note as a JSON response.
        });
    });
});

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== req.params.id);
        fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.json({ success: true });
        });
    });
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));