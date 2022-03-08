const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const api = require('./routes/index');
const user = require('./routes/user');
const common = require('./routes/common');
const question = require('./routes/question');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', api);
app.use('/user', user);
app.use('/common', common);
app.use('/question', question);

app.listen(3001, () => console.log('Node.js Server is running on port 3001...'));