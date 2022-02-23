const express = require('express');

const db = require('./config/db/index');
const routes = require('./routes/index');

db.connect();

const app = express();
app.use(express.json());

routes(app);

const PORT = 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));