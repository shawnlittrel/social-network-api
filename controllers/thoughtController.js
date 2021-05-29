const { Thought } = require('../models');

const thoughtController = {
     //GET all thoughts
     getAllThoughts(req, res) {
          Thought.find({})
          .select('-__v')
          .then(dbThought => res.json(dbThought))
          .catch(err => {
               console.log(err);
               res.sendStatus(400);
          });
     },

     //GET a single thought by id
     getThoughtById({ params }, res) {
          Thought.findOne({ _id: params.id })
          .select('-__v')
          .then(dbThought => {
               if(!dbThought) {
                   return res.status(404).json({ message: 'No thoughts found with that id.' });
               }
               res.json(dbThought);
          })
          .catch(err => res.json(err));
     },

     //TODO: ASSOCIATE THOUGHT TO USER BY ID
     //POST to create new thought -> push its id to user's thoughts field
     // createThought({ body }, res){
     //      Thought.create(body)
     //      .then(dbThought => res.json(dbThought));
     // },
     createThought({ body }, res) {
          console.log('body', body);
          Thought.create(body)
          .then(dbThoughtData => {
               console.log('THOUGHTDATA', {dbThoughtData});
               console.log('USER ID', body.userId);
               return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: dbThoughtData._id } },
                    { new: true }
               );
          })
          .then(dbUser => {
               console.log('DBUSER', dbUser);
               if (!dbUser) {
                    return res.status(404).json({ message: 'No user found with that id.' });
               }
               res.json(dbUser);
          })
          .catch(err => res.json(err));
     },

     //PUT to update thought by id
     updateThought({ params, body }, res) {
          Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
          .then(dbThought => {
               if (!dbThought) {
                   return res.status(404).json({ message: 'No thoughts found with that id.' });
               }
               res.json(dbThought);
          })
          .catch(err => res.json(err));
     },

     //DELETE thought by id
     deleteThought({ params }, res) {
          Thought.findOneAndDelete({ _id: params.id })
          .then(dbThought => res.json(dbThought))
          .catch(err => res.json(err));
     },

     //POST new reaction
     createReaction({ params, body }, res) {
          Thought.findOneAndUpdate({ _id: params.thoughtId }, { $push: { reactions: body} }, { new: true, runValidators: true })
          .then(dbReaction => {
               if (!dbReaction) {
                    return res.status(404).json({ message: 'No thoughts found with that id.' });
               }
               res.json(dbReaction);
          })
          .catch(err => res.json(err));
     },

     //DELETE reaction
     deleteReaction({ params }, res) {
          Thought.findOneAndUpdate(
               { _id: params.thoughtId },
               { $pull: { reactions: { reactionId: body } } },
               { new: true, runValidators: true }
          )
          .then(dbThought => res.json(dbThought))
          .catch(err => res.json(err));
     }
};

module.exports = thoughtController;