const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Set up middleware and static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Initialize scores.json if it doesn't exist
const scoresFilePath = path.join(__dirname, 'data', 'scores.json');
if (!fs.existsSync(scoresFilePath)) {
    fs.writeFileSync(scoresFilePath, JSON.stringify([]));
}

// Helper function to read scores from JSON
const readScores = () => {
    return JSON.parse(fs.readFileSync(scoresFilePath, 'utf8'));
};

// Helper function to write scores to JSON
const writeScores = (scores) => {
    fs.writeFileSync(scoresFilePath, JSON.stringify(scores, null, 2));
};

// Routes
app.get('/', (req, res) => {
    res.render('game');
});

app.get('/scores', (req, res) => {
    const scores = readScores();
    res.render('scores', { scores });
});

app.post('/submit-score', (req, res) => {
    const { username, time } = req.body;
    const scores = readScores();
    scores.push({ username, time });
    writeScores(scores);
    res.status(200).json({ message: 'Score saved successfully' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});