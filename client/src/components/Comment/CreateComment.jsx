
import React, { useState, useContext } from "react";
import { withStyles } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from "@material-ui/icons/Send";
import Divider from "@material-ui/core/Divider";
import AppContext from "../../context/appContext";
// GraphQL imports
import { useClient } from "../../client";
import { CREATE_COMMENT_MUTATION } from "../../graphql/mutations";


const CreateComment = ({ classes }) => {
  //importing graphgl client from client.jsx
  const client = useClient();

  //getting current state 
  const appContext = useContext(AppContext);
  const { currentPin } = appContext;
  const [comment, setComment] = useState('');


  const handleSubmitComment = async () => {
    const variables = { pinId: currentPin._id, text: comment };
    const { createComment } = await client.request(CREATE_COMMENT_MUTATION, variables); // destructuring data object coming from the async function

    console.log('Comment Created!', { createComment });

    // with subscription the logic is moved to the Map.js
    //creatNewComment(createComment);

    setComment('');
  };

  return (
    <>
      <form className={classes.form}>
        <IconButton
          className={classes.clearButton}
          disabled={!comment.trim()}
          onClick={() => setComment('')}
        >
          <ClearIcon />
        </IconButton>

        <InputBase
          className={classes.input}
          multiline={true}
          placeholder={'Add Comment'}
          value={comment}
          onChange={event => setComment(event.target.value)}
        />

        <IconButton
          className={classes.sendButton}
          disabled={!comment.trim()}
          onClick={handleSubmitComment}
        >
          <SendIcon />
        </IconButton>

      </form>
      <Divider />
    </>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    alignItems: "center"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  clearButton: {
    padding: 0,
    color: "red"
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark
  }
});

export default withStyles(styles)(CreateComment);
