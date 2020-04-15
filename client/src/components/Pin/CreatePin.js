import React from "react";
import { withStyles } from "@material-ui/core/styles";
// import TextField from "@material-ui/core/TextField";
// import Typography from "@material-ui/core/Typography";
// import Button from "@material-ui/core/Button";
// import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
// import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
// import ClearIcon from "@material-ui/icons/Clear";
// import SaveIcon from "@material-ui/icons/SaveTwoTone";

const CreatePin = ({ classes }) => {
  return <div>CreatePin</div>;
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
