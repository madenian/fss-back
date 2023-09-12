
const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_DB = process.env.MONGO_DB;

mongoose.connect(MONGO_DB, { connectTimeoutMS: 2000 })
 .then(() => console.log('Database connected'))
 .catch((errorMessage) => console.error(errorMessage))