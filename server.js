require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose 
.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology:true})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

const questionSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    tags: {String},
    createdAt: {type: Date, default: Date.now},
});

const Question = mongoose.model('Question', questionSchema);

app.get('/questions', async(req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    }
    catch (error) {
        res.status(500).json({message: 'Error fetching questions', error});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});