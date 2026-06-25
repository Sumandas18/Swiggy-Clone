require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./app/config/dbConfig');

const indexRoutes = require('./app/routes');

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use('/api', indexRoutes);

app.get('/', (req, res) => {
  res.send('Swiggy Clone API is running');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const port = process.env.PORT || 4000;
app.listen(port, (error) => {
    if(error){
        console.log("Error starting server:", error);
    } else {
        console.log(`Server is running on port ${port}`);
    }
});
