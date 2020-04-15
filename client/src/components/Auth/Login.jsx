import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import { GoogleLogin } from "react-google-login";
import { GraphQLClient } from "graphql-request";
import Typography from "@material-ui/core/Typography";
import AppContext from "../../context/appContext";
import { ME_QUERY } from "../../graphql/queries";




const Login = ({ classes }) => {
  const appContext = useContext(AppContext);
  const { setCurrentUser, setAuth } = appContext;

  const onSuccess = async (googleUser) => {

    try {
      //grabs token from googleUser obj
      const idToken = googleUser.getAuthResponse().id_token;
      //console.log({googleUser})

      //sends token to graphql
      const client = new GraphQLClient("http://localhost:4000/graphql", {
        headers: { authorization: idToken }
      })

      //excute query data.me is coming from backend 
      //const data = await client.request(ME_QUERY);

      const { me } = await client.request(ME_QUERY);

      //setting current user to state 
      setCurrentUser(me);

      //set auth to true if user sign is successful
      //isSignedIn is a google oauth method 
      setAuth(googleUser.isSignedIn());
      

      //console.log({data.me });
      // console.log(ME_QUERY);

    } catch (error) {
      onFailure(error);
    }

  };

  const onFailure = error => {
    console.error("Error Logging in", error);

  }


  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: "rgb(66, 133, 244)" }}
      >
        Welcome
      </Typography>
      <GoogleLogin clientId="439691894521-a305nkbdprd43kr6u684a4rd5e9sg6ud.apps.googleusercontent.com"
        onSuccess={onSuccess}
        onFailure={onFailure}
        isSignedIn={true}
        buttonText={"Login with Google"}
        theme="dark"
      />
    </div>
  )
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
