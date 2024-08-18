const mongoose = require('mongoose');

const connectionDb = async ()=>{
try {
    const connection = await mongoose.connect('mongodb://localhost:27017/todos1')
    console.log('connected to mongodb')
} catch (error) {
    console.log(error)
}
}
module.exports = connectionDb;