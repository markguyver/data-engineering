import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const getMongoConnectionUri = () => 'mongodb://' + process.env.MONGO_HOST + ':' +  process.env.MONGO_PORT + '/' + process.env.MONGO_DB;
mongoose.connect(getMongoConnectionUri(), {useNewUrlParser:true});
const mongoConnection = mongoose.connection;
mongoConnection.on('error', console.error.bind(console, 'Mongoose Connection Error:'));
mongoConnection.once('open', () => {

    const personSchema = new mongoose.Schema({
        firstName: String,
        lastName: String,
        dateOfBirth: Date
    });
    const personModel = mongoose.model('Person', personSchema, process.env.MONGO_COLLECTION);

    const testPersonObject = new personModel({
        firstName: 'Mark',
        lastName: 'Chavez',
        dateOfBirth: new Date('July 25, 1981 10:00am')
    });

    console.log('Person Object:', testPersonObject);

});


// process.env.MONGO_HOST
// process.env.MONGO_PORT
// process.env.MONGO_DB
// process.env.MONGO_COLLECTION

// process.env.MINIO_HOST
// process.env.MINIO_ACCESS_KEY
// process.env.MINIO_SECRET
