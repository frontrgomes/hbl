const mongoose = require('mongoose')

async function main() {
    await mongoose.connect('mongodb://localhost:27017/hbl')
    console.log('Comectou ao Mongoose!')
}

main().catch((err)=> console.log(err))
module.exports = mongoose;