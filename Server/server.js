const express = require('express');
const app = express();
const morgan = require('morgan');
const dotenv = require ('dotenv')
const cors = require('cors')
const connectDB = require('./config/db.js')

//env config
dotenv.config();

//db connection
connectDB();
//rest obj 
const PORT = process.env.PORT || 8081

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
//routes



app.get('/', (req, res) => {
  res.status(200).send("<h1>Well Done YES</h1>");
});
    
app.listen(PORT, () => {
  console.log(`Server running http://localhost:${process.env.DEV_MODE} at ${PORT}`.bgMagenta);
});
