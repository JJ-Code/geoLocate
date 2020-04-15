import React, { useContext } from 'react'
import {Route, Redirect} from "react-router-dom"
import AppContext from "./context/appContext"

const ProtectedRoute = ({component: Component, ...rest}) => {
  const appContext = useContext(AppContext);
  const { isAuth } = appContext;
  return (
    <Route render={props=> !isAuth ? 
     
    <Redirect to="./login" /> :
     <Component {...props} {...rest}/>}
     
  
     />

     
  )
}
export default ProtectedRoute;