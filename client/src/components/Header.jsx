import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MapIcon from "@material-ui/icons/Map";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AppContext from "../context/appContext";
import Signout from "./Auth/Signout";

const Header = ({ classes }) => {
  // useMediaQuery for responsive
  const mobileSize = useMediaQuery('(max-width: 600px)');

  const appContext = useContext(AppContext);
  const { currentUser } = appContext;

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {/* {Tile logo} */}
          <div className={classes.grow}>
            <MapIcon className={classes.icon} />
            <Typography
              className={mobileSize ? classes.rootMobile : ''}
              component="h1"
              variant="h6"
              color="inherit"
              noWrap>
              GeoPins
            </Typography>
          </div>

          {/* {current user info} */}

          {currentUser && (
            <div className={classes.grow}>
              <img className={classes.picture}
                src={currentUser.picture}
                alt={currentUser.name}
              />
              <Typography
                className={mobileSize ? classes.rootMobile : ''}
                variant="h5"
                color="inherit"
                noWrap>
                {currentUser.name}
              </Typography>

            </div>
          )}

          {/* {signout button} */}
          <Signout />
        </Toolbar>
      </AppBar>

    </div>);
};

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center"
  },
  icon: {
    marginRight: theme.spacing(),
    color: "green",
    fontSize: 45
  },
  rootMobile: {
    display: "none"
  },
  picture: {
    height: "50px",
    borderRadius: "90%",
    marginRight: theme.spacing * 2
  }
});

export default withStyles(styles)(Header);
