import React, {useContext} from "react";
import { Redirect } from "react-router-dom"
import Login from "../components/Auth/Login";
import AppContext from "../context/appContext";

const Splash = () => {
  const appContext = useContext(AppContext);
  const { isAuth } = appContext; //comes from the state

  //if user logs in successfully redirect to homepage otherwise stay on login
  return isAuth ? <Redirect to="/" /> : <Login />;
};

export default Splash;
