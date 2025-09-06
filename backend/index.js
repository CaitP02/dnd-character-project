import express from "express";
import {PORT, mongoDBURL} from "./config.js";
import mongoose from "mongoose";
import {charSheet} from "./models/charModel.js";
import charRoute from "./routes/charRoute.js";
import cors from 'cors'

const app = express();

app.use(cors()); 
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully");
    const port = process.env.PORT || 3000;
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => console.error("MongoDB connection error:", err));

app.use('/characters', charRoute);
 
app.get('/', (request, response) => {
  console.log(request);
  return response.status(234).send('Test 1234!');

});


