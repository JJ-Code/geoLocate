import React, { useReducer } from "react";
import AppContext from "./appContext";
import AppReducer from "./appReducer";
import { LOGIN_USER, IS_LOGGED_IN, SIGNOUT_USER, CREATE_DRAFT, UPDATE_DRAFT_LOCATION, DELETE_DRAFT, GET_PINS, CREATE_PIN, SET_PIN, DELETE_PIN, CREATE_COMMENT } from "./types";


//const initialState = useContext(AppContext)

const AppState = props => {
  const initialState = {
    currentUser: null, //is null until the user logs in and a user object is created 
    isAuth: false, //users will not be authenticated unless logged in  
    draft: null,
    pins: [],
    currentPin: null
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

  // retrive pins array from backend and set it to curr state
  const setPinsArray = (getPins) => {
    dispatch({
      type: GET_PINS,
      payload: getPins
    })
  }
  

  //set new pin in arrary
  const createNewPin = (createPin) => {
    dispatch({
      type: CREATE_PIN,
      payload: createPin
    })
  }

  
  const setPin = (pin) => {
    dispatch({
      type: SET_PIN,
      payload: pin
    })
  }

  const pinToBeDeleted = (deletePin) => {
    dispatch({
      type: DELETE_PIN,
      payload: deletePin
    })
  }

  const creatNewComment = (createComment) => {
    dispatch({
      type: CREATE_COMMENT,
      payload: createComment
    })
  } 


  

  console.log(state);
  return <AppContext.Provider
    value={{
      currentUser: state.currentUser,
      isAuth: state.isAuth,
      draft: state.draft,
      pins: state.pins,
      currentPin: state.currentPin,
      setCurrentUser,
      setAuth,
      signoutUser,
      setDraft,
      updateDraft,
      deleteDraftPin,
      setPinsArray,
      createNewPin,
      setPin,
      pinToBeDeleted,
      creatNewComment
    }
    }>

    {props.children}

  </AppContext.Provider>

}

export default AppState;