const { Schema, model } = require('mongoose');

//create model for Users
const UserSchema = new Schema(
     {
          username: {
               type: String,
               unique: true,
               required: true,
               trim: true
          },

          email: {
               type: String,
               unique: true,
               required: true,
               match:  /.+\@.+\..+/
          },

          thoughts: [
               {
                    type: Schema.Types.ObjectId,
                    ref: 'Thoughts'
               }
          ],

          friends: [
               {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
               }
          ]
     },
     {
          toJSON: {
               virtuals: true,
               getters: true
          },

          id: false
     }
);

// get total friend count and return on retrieval
UserSchema.virtual('friendCount').get(function() {
     return this.friends.reduce(
          (total, friends) => total + friends.length + 1, 0
     );
});

const User = model('User', UserSchema);

module.exports = User;