// app.js
const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');
const confirmRoutes = require("./routes/confirmRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', uploadRoutes); // API prefix
app.use('/block', confirmRoutes);

module.exports = app;
