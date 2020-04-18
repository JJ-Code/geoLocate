import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import AppContext from "../context/appContext";
import NoContent from "./Pin/NoContent";
import CreatePin from "./Pin/CreatePin";

const Blog = ({ classes }) => {
  //getting current state 
  const appContext = useContext(AppContext);
  const { draft, currentUser } = appContext;

  let BlogContent;

  //if user has not draft show nocontent 
  if (!draft) {
    BlogContent = NoContent;
  }
  else if (draft) {
    //creat pin
    BlogContent = CreatePin;
  }

  return (
    <Paper className={classes.root}>
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
