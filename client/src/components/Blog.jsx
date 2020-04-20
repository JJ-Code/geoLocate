import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import AppContext from "../context/appContext";
import NoContent from "./Pin/NoContent";
import CreatePin from "./Pin/CreatePin";
import PinContent from "./Pin/PinContent";
import useMediaQuery from '@material-ui/core/useMediaQuery';


const Blog = ({ classes }) => {
  // useMediaQuery for responsive
  const mobileSize = useMediaQuery('(max-width:600px)');

  //getting current state 
  const appContext = useContext(AppContext);
  const { draft, currentPin } = appContext;

  let BlogContent;
  
  //if user has not draft show nocontent 
  if (!draft && !currentPin) {
    BlogContent = NoContent;
  }
  else if (draft && !currentPin) {
    //show create draft content when left mouse pointer was clicked
    BlogContent = CreatePin;
  }

  else if (!draft && currentPin) {
    //show pin content if currentPin is clicked 
    BlogContent = PinContent;
  }

  return (
    <Paper className={mobileSize ? classes.rootMobile : classes.root}>
      <BlogContent />
    </Paper>
  );
};

const styles = {
  root: {
    minWidth: 350,
    maxWidth: 400,
    maxHeight: "calc(100vh - 64px)",
    overflowY: "scroll",
    display: "flex",
    justifyContent: "center"
  },
  rootMobile: {
    maxWidth: "100%",
    maxHeight: 300,
    overflowX: "hidden",
    overflowY: "scroll"
  }
};

export default withStyles(styles)(Blog);
