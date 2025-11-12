const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/MovieCenter")
  .then(()=>console.log("MongoDB connected Successfully"))
  .catch(err=>console.log("Error in connecting"));

const movieSchema = new mongoose.Schema({
  movieName:{type:String,required:true},
  movieBudget:{type:Number,required:true},
  movieRD:{type:Date,required:true}
});

const Movie = mongoose.model("Movie",movieSchema);

//Routing Operations
//display all
app.get("/movie",async(req,res)=>{
  try{
    const movies= await Movie.find();

    res.json(movies);
  }
  catch(err){
    res.status(500).json({errorHere:err.message});
  }
});

  //add new movie
  app.post("/movie",async(req,res)=>{
    try{
      const movie = new Movie(req.body);
      const saved=await movie.save();
      res.status(201).json(saved);
    }
    catch(err){
      res.status(400).json({error:err.message});
    }
  });

//display one movie
app.get("/movie/:id",async (req,res)=>{
  try{
    const movie = await Movie.findById(req.params.id);
    if (!movie){
      res.status(404).json({message:"Book not found"});
    }
    else{
      res.status(200).json({movie});
    }
  }
  catch(err){
    res.status(500).json({error:err.message});
  }
});

//delete
app.delete('/movie/:id',async(req,res)=>{
  try{
    const movie= await Movie.findByIdAndDelete(req.params.id);
    if (!movie){
      res.status(404).json({error:"Movie not found"});
    }
    else{
      res.status(200).json({message:"Movie deleted successfully"});
    }
  }
  catch(err){
    res.status(400).json({error:err.message});
  }
});

//update
app.put('/movie/:id',async(req,res)=>{
  try{
    const movie= await Movie.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    if (!movie){
      res.status(404).json({error:"Movie not found"});
    }
      res.status(200).json({message:"Movie Updated successfully"});
    
  }
  catch(err){
    res.status(400).json({error:err.message});
  }
});

app.listen(5000,()=>console.log("Server is working on 5000 port"));