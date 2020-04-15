import React, { useReducer } from "react";
import AppContext from "./appContext";
import AppReducer from "./appReducer";
import { LOGIN_USER, IS_LOGGED_IN, SIGNOUT_USER } from "./types";


//const initialState = useContext(AppContext)

const AppState = props => {
  const initialState = {
    currentUser: null, //is null until the user logs in and a user object is created 
    isAuth: false //users will not be authenticated unless logged in  
  }
  const [state, dispatch] = useReducer(AppReducer, initialState)

  //Set authentication to true  
  const setAuth = (authState) => {
    dispatch({
      type: IS_LOGGED_IN,
      payload: authState
    })
  }

  //Set current user 
  const setCurrentUser = (userData) => {
    console.log(userData);

    dispatch({
      type: LOGIN_USER,
      payload: userData
    })
  }

  //Reset inital state upon logout
  
  const signoutUser = () => {
    dispatch({
      type: SIGNOUT_USER
    })
  }



  console.log(state);
  return <AppContext.Provider
    value={{
      currentUser: state.currentUser,
      isAuth: state.isAuth,
      setCurrentUser,
      setAuth,
      signoutUser
    }
    }>

    {props.children}

  </AppContext.Provider>

}

export default AppState;