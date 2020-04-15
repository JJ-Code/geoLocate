const User = require("../models/User");
const {
  OAuth2Client
} = require("google-auth-library");


const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID)


exports.findOrCreateUser = async (token) => {
  //verify auth token
  const googleUser = await verifyAuthToken(token);

  //logs in in the terminal 
  //console.log(googleUser); 
  //console.log(googleUser.email);

  //check if the user exists will return either undefined or a user obj
  const user = await checkIfUserExists(googleUser.email)

  //console.log(user);

  //if user exists, return them ; otherwise create new user in db
  //createNewUser doesn't need to be async bc 
  //var user (checkIfUserExists) is await so by the time return runs await should have ran
  return user ? user : createNewUser(googleUser);

}





//this is the client and app token 
const verifyAuthToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID
    })
    return ticket.getPayload()
  } catch (error) {
    console.error("Error verifying auth token", error);
  }
}

//will return a promise
const checkIfUserExists = async (email) => await User.findOne({
  email
}).exec();

//create new user in apollo db
const createNewUser = googleUser => {
  console.log(" I ran");

  //grabing from google api these values and deconstructed
  const {
    name,
    email,
    picture
  } = googleUser;
  console.log(name, email, picture);

  //creating a new user obj from googleUser.name ....
  const user = {
    name,
    email,
    picture
  }

  //saving this into the apollo db
  return new User(user).save();
}