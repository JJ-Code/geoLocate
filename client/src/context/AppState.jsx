import React, { useReducer } from "react";
import AppContext from "./appContext";
import AppReducer from "./appReducer";
import { LOGIN_USER, IS_LOGGED_IN, SIGNOUT_USER, CREATE_DRAFT, UPDATE_DRAFT_LOCATION, DELETE_DRAFT } from "./types";


//const initialState = useContext(AppContext)

const AppState = props => {
  const initialState = {
    currentUser: null, //is null until the user logs in and a user object is created 
    isAuth: false, //users will not be authenticated unless logged in  
    draft: null
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

  // Creating a draft pin for users to drag 
  const setDraft = () => {
    dispatch({
      type: CREATE_DRAFT
    })
  }

  // update draft pin location 
  const updateDraft = (lngLat) => {
    //destructing to grab the values
    const [longitude, latitude] = lngLat
    console.log(longitude);

    dispatch({
      type: UPDATE_DRAFT_LOCATION,
      payload: {longitude, latitude}
})
  }

  // delete draft pin  
  const deleteDraftPin = () => {
    dispatch({
      type: DELETE_DRAFT
    })
  }

  

  


  console.log(state);
  return <AppContext.Provider
    value={{
      currentUser: state.currentUser,
      isAuth: state.isAuth,
      draft: state.draft,
      setCurrentUser,
      setAuth,
      signoutUser,
      setDraft,
      updateDraft,
      deleteDraftPin
    }
    }>

    {props.children}

  </AppContext.Provider>

}

export default AppState;