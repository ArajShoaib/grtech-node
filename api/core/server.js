const environment = 'development';

require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');


const PORT = process.env.PORT;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;

app.listen(PORT, () => {
    let connectionString = "mongodb://" + DB_HOST + DB_NAME;
    // console.log({ connectionString });
    mongoose.connect(connectionString, (err) => {
        if (!err) {
            console.log('Both Node and DB Servers are Up In Local Environment!!!');
            console.log(`Server is running on http://localhost:${PORT}`);
        }
    })
})

module.exports = environment;