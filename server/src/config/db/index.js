require('dotenv').config();
const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@learnit.dk7hx.mongodb.net/learnit?retryWrites=true&w=majority`, {            
            useNewUrlParser: true,
            useUnifiedTopology: true,            
        })

        console.log('Connected to MongoDB successfully!');
    } catch (error) {
        console.log('Connected failure!!!');
    }
}

module.exports = {connect};