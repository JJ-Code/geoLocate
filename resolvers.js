// GRAPHQL QL FILE ONLY
//FILE TO HANDLE GRAPHQL QL REQUEST FROM THE APP
// HAS ACCESS TO THE SCHEMA/TYPE DEFS, THE MODELS AND THE DB
// THIS IS LIKE A CONTROLLER
const { AuthenticationError } = require("apollo-server")
const Pin = require('./models/Pin')


// const user = {
//   _id: 1,
//   name: "JJ",
//   email: "test@test.com",
//   picture: "https://cloudinary.com/asdf"

// }


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
    me2: () => user
  },
  Mutation: {
    createPin: authenticated(async (root, args, context) => {
      const newPin = await new Pin({
        ...args.input,
        author: context.currentUser._id // add the author to the pin
      }).save();

      //this will populate in Mongoose per the model
      const pinAdded = await Pin.populate(newPin, "author");

      return pinAdded;
    })
  }

}


// console.log(ctx.currentUser)
// console.log(ctx);