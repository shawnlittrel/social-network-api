const {Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ThoughtSchema = new Schema(
     {
          thoughtText: {
               type: String,
               required: true,
               minLength: 1,
               maxLength: 280
          },

          createdAt: {
               type: Date,
               default: Date.now,
               get: createdAtValue => dateFormat(createdAtValue)
          },

          username: {
               type: String,
               required: true,
               trim: true
          },

          reactions: {
               //TODO: set up reaction schema here
          }
     },
     {
          toJSON: {
               virtuals: true,
               getters: true
          }
     }
);

//virtual to get length of the thought's reactions array
ThoughtSchema.virtual('reactionCount').get(function() {
     return this.reactions.reduce(
          (total, reactions) => total + reactions.length + 1, 0
     );
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;