const mongoose = require('../database/mongo')
const {Schema} = mongoose

const Permission = mongoose.model(
    'Permission',
    new Schema({
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
    },
        {timestamps:false},
    ),
)

module.exports = Permission
