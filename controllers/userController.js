const { User } = require('../models');

const userController = {
     //GET all users 
     getAllUsers(req, res) {
          User.find({})
          .select('-__v')
          .sort({ _id: -1 })
          .then(dbUser => res.json(dbUser))
          .catch(err => {
               console.log(err);
               res.sendStatus(400);
          });
     },

     //GET single user by id, along with thought and friend data
     getUserById({ params }, res) {
          User.findOne({ _id: params.id })
          .populate({
               path: 'thoughts',
               select: '-__v'
          })
          .populate({
               path: 'friends',
               select: '-__v'
          })
          .select('-__v')
          .then(dbUser => res.json(dbUser))
          .catch(err => {
               console.log(err);
               res.sendStatus(400);
          });
     },

     //POST a new user
     createUser({ body }, res) {
          User.create(body)
          .then(dbUser => res.json(dbUser))
          .catch(err => res.json(err));
     },

     //PUT to update user by id
     updateUser({ params, body }, res) {
          User.findOneAndUpdate(
               { _id: params.id }, 
               body, 
               { new: true, runValidators: true }
          )
          .then(dbUser => {
               if (!dbUser) {
                    res.status(404).json({ message: 'No user found with that id.' });
                    return;
               }
               res.json(dbUser);
          })
          .catch(err => res.json(err));
     },

     //DELETE a user by id
     deleteUser({ params }, res) {
          User.findOneAndDelete({ _id: params.id })
          .then(dbUser => {
               if (!dbUser) {
                    res.status(404).json({ message: 'No user found with that id.' });
                    return;
               }
               res.json(dbUser);
          })
          .catch(err => res.json(err));
     },
     //TODO: remove users thoughts when user is deleted
     
     //POST a new friend
     createFriend({ params }, res) {
          User.findOneAndUpdate(
               { _id: params.userId }, 
               { $push: { friends: params.friendId } }, 
               { new: true, runValidators: true })
          .then(dbFriend => {
               if (!dbFriend) {
                    return res.status(404).json({ message: 'No user found with that id.' });
               }
               res.json(dbFriend);
          })
          .catch(err => res.json(err));
     },

     //DELETE a friend
     deleteFriend({ params }, res) {
          User.findOneAndUpdate(
               { _id: params.userId },
               { $pull: { friends: params.friendId } },
               { new: true, runValidators: true }
          )
          .then(dbFriend => res.json(dbFriend))
          .catch(err => res.json(err));
     }
};

module.exports = userController;