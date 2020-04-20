const {
  ApolloServer
} = require("apollo-server")


//making the types for model - resolver and typeDef needs to happen first
const typeDefs = require("./typeDefs")
const resolvers = require("./resolvers")
const mongoose = require("mongoose")

const {
  findOrCreateUser
} = require("./controllers/userController")



//reads the .env file
require("dotenv").config()

//connect to mongodb 
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then((() => console.log("DB connected"))).catch(err => console.error(err))



//context intercepts the google auth obj token from header

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({
    req
  }) => {
    let authToken = null;
    let currentUser = null;

    try {
      authToken = req.headers.authorization;
      if (authToken) {
        //find or create user         
        currentUser = await findOrCreateUser(authToken);
        //console.log(currentUser);

      }

    } catch (error) {
      console.error(`unable to authenticate user with token ${authToken}`);

    }
    //console.log(currentUser);

    //return currentUser so resolvers can query
    return {
      currentUser
    };
  }
})


//firing up apollo
server.listen({
  port: process.env.PORT || 4000
}).then(({
  url
}) => {
  console.log(`listening on ${url}`);
});