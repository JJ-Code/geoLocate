// GRAPHQL QL FILE ONLY
//FILE TO HANDLE GRAPHQL QL REQUEST FROM THE APP
// HAS ACCESS TO THE SCHEMA/TYPE DEFS, THE MODELS AND THE DB
// THIS IS LIKE A CONTROLLER
const {
  AuthenticationError,
  PubSub
} = require("apollo-server")
const Pin = require('./models/Pin')


// const user = {
//   _id: 1,
//   name: "JJ",
//   email: "test@test.com",
//   picture: "https://cloudinary.com/asdf"

// }

// live data broadcast
const pubsub = new PubSub();
const PIN_ADDED = 'PIN_ADDED';
const PIN_DELETED = 'PIN_DELETED';
const PIN_UDPDATED = 'PIN_UPDATED';



//creating a HOF, ctx comes from apollo context in server.js
// guard clause to check if we have a user before executing the query
//resolvers has access to the following parms

const authenticated = next => (root, args, context, info) => {
  if (!context.currentUser) {
    throw new AuthenticationError('You must be logged in')
  }
  return next(root, args, context, info); // yield to the query if there is a user
};



//check to see if there is a current user 
module.exports = {
  Query: {
    me: authenticated((root, args, context) => context.currentUser),
    me2: () => user,
    getPins: async (root, args, context) => {
      const pins = await Pin.find({})
        .populate('author') // populate the authors for all pins
        .populate('comments.author'); // populate the comments.author for all pins
      return pins
    }
  },
  Mutation: {
    createPin: authenticated(async (root, args, context) => {
      const newPin = await new Pin({
        ...args.input,
        author: context.currentUser._id // add the author to the pin
      }).save();
      //this will populate in Mongoose per the model
      const pinAdded = await Pin.populate(newPin, "author");

      // subscription, will be passed to Subcription resolvers
      pubsub.publish(PIN_ADDED, {
        pinAdded
      }); // passing the destructured pinAdded from data
      return pinAdded;
    }),
    deletePin: authenticated(async (root, args, context) => {
      const pinDeleted = await Pin.findOneAndDelete({
        _id: args.pinId
      }).exec();
      // subscription
      pubsub.publish(PIN_DELETED, {
        pinDeleted
      });

      // local
      return pinDeleted;
    }),

    createComment: authenticated(async (root, args, context) => {
      const newComment = {
        text: args.text,
        author: context.currentUser._id
      };
      const pinUpdated = await Pin.findOneAndUpdate({
            _id: args.pinId
          }, // get the pin from the db
          {
            $push: {
              comments: newComment
            }
          }, // push the newly created comment in the array of ids
          {
            new: true
          } // return the latest version of this document from Mongo
        ).populate('author') // populate the author for the pin
        .populate('comments.author'); // populate the comments.author for this updated pin

      // subscription
      pubsub.publish(PIN_UDPDATED, {
        pinUpdated
      });


      // local
      return pinUpdated;
    })
  },

  Subscription: {
    pinAdded: {
      subscribe: () => pubsub.asyncIterator(PIN_ADDED) // passed by the createPin resolver
    },
    pinDeleted: {
      subscribe: () => pubsub.asyncIterator(PIN_DELETED) // passed by the createPin resolver
    },
    pinUpdated: {
      subscribe: () => pubsub.asyncIterator(PIN_UDPDATED) // passed by the createPin resolver
    }
  }

}


// console.log(ctx.currentUser)
// console.log(ctx);