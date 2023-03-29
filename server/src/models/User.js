const mongoose = require('../database/mongo')
const {Schema} = mongoose

const User = mongoose.model(
    'User',
    new Schema({
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
        image:{
            type:String,
        },
        roles: [
            {
              type: mongoose.Schema.ObjectId,
              ref: 'Role',
            },
        ],
        phone:{
            type:String,
            required:false
        },

    },
        {timestamps:true},
    ),
)

module.exports = User