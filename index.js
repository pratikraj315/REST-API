const express = require('express');
const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');


const app = express();
app.use(express.json());



const MONGO_URI = process.env.MONGO_URI;

mongoose 
.connect(MONGO_URI, 
    {
        useNewUrlParser: true,
         useUnifiedTopology:true
    });


const questionSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    tags: {String},
    createdAt: {type: Date, default: Date.now},
});

const Question = mongoose.model('Question', questionSchema);

app.post('/questions', async(req, res) => {
   const {title, description, tags} = req.body;
   if(!title || description) {
    return res.status(400).json({error: "Title and Description are required"});
   }
   if(description.length > 500)
   {
    return res.status(400).json({error:"Description length should be less than 500"});
   }

   const sanitizedDescription = sanitizeHtml(description, {
    allowedTags:[],
    allowedAttributes:{},
   });

   try{
    const question = new Question({
        title,
        description:sanitizedDescription,
        tags: tags || [],
    });
    await question.save();
    res.status(201).json({message: 'Question published successfully'.question});
   }
   catch(error){
    res.status(500).json({error:'Failed to publish question'});
   }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});