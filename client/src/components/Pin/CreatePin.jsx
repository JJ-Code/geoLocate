import React, { useState, useContext } from "react";
import { GraphQLClient } from "graphql-request";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import AppContext from "../../context/appContext"
import axios from "axios";
import { CREATE_PIN_MUTATION } from "../../graphql/mutations";

const CreatePin = ({ classes }) => {
  //getting current state 
  const appContext = useContext(AppContext);
  const { draft, deleteDraftPin } = appContext;
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleDeleteDraft = () => {
    setTitle("");
    setImage("");
    setContent("");
    deleteDraftPin();

  }


  const handleImageUpload = async () => {
    const data = new FormData(); // built-in dom form
    data.append('file', image); // upload the image from the useState / local state
    data.append('upload_preset', 'geoLocate'); // name of the Cloudinary unsigned bucket we created
    data.append('cloud_name', 'dd1pzfmqs');


    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dd1pzfmqs/image/upload",
      data
    );

    return response.data.url
  }

  const handleSubmit = async (event) => {

    try {
      event.preventDefault();
      setSubmitting(true);
      //grabing auth from backend to use
      const idToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

      const client = new GraphQLClient("http://localhost:4000/graphql", {
        headers: { authorization: idToken }
      });
      const url = await handleImageUpload();
      const { latitude, longitude } = draft;
      const variables = { title, image: url, content, latitude, longitude }
      const { createPin } = await client.request(CREATE_PIN_MUTATION, variables);
      
      console.log("Pin created", { createPin });
      handleDeleteDraft();

      // console.log({ title, image, url, content });

    } catch (error) {
      setSubmitting(false)
      console.error("Error creating pin", error)
    }


  }

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component={'h2'}
        variant={'h4'}
        color={'secondary'}
      >
        <LandscapeIcon className={classes.iconLarge} /> Pin Location
      </Typography>

      <div>

        <TextField
          name={'title'}
          label={'Title'}
          placeholder={'Insert pin title'}
          onChange={event => setTitle(event.target.value)}
        />

        <input
          accept={'image/*'} // to accept only images
          id={'image'}
          type={'file'}
          className={classes.input}
          onChange={event => setImage(event.target.files[0])} // get the uploaded image from the image object
        />

        <label htmlFor='image'>
          <Button
            style={{ color: image && 'green' }} // turn to green if success on image upload
            component={'span'}
            size={'small'}
            className={classes.button}
          >
            <AddAPhotoIcon />

          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          name={'content'}
          label={'Content'}
          multiline
          //rows={mobileSize ? 3 : 6}
          margin={'normal'}
          fullWidth
          variant={'outlined'}
          onChange={event => setContent(event.target.value)}
        />
      </div>

      <div>
        <Button
          onClick={handleDeleteDraft}
          className={classes.button}
          variant={'contained'}
          color={'primary'}
        >
          <ClearIcon className={classes.leftIcon} />
          Discard
        </Button>

        <Button
          type={'submit'}
          className={classes.button}
          variant={'contained'}
          color={'secondary'}
          disabled={!title.trim() || !content.trim() || !image || submitting} // condition to disable the button if any of the fields are empty trim whit space
          onClick={handleSubmit}
        >
          Submit
          <SaveIcon className={classes.rightIcon} />
        </Button>

      </div>

    </form>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing()
  },
  contentField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing()
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing()
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing()
  },
  button: {
    marginTop: theme.spacing() * 2,
    marginBottom: theme.spacing() * 2,
    marginRight: theme.spacing(),
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
