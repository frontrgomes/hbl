const mongoose = require('../database/mongo')
const {Schema} = mongoose

const Role = mongoose.model(
    'Role',
    new Schema({
        name: {
            type: String,
            required: true,
            unique: true,
          },
          description: {
            type: String,
          },
          permissions: [
            {
              type: mongoose.Schema.ObjectId,
              ref: 'Permission',
            },
          ],

    },
        {timestamps:false},
    ),
)

module.exports = Role
