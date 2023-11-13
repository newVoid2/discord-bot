const express = require('express');
const app = express();
const cors = require('cors');

const {clientAPI} = require('./src/index');

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => clientAPI());

app.listen(process.env.PORT, () => {console.log(`app is running on port ${process.env.PORT}`)});