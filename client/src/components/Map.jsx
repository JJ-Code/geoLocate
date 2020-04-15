import React, { useState, useEffect } from "react";
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';
import { withStyles } from "@material-ui/core/styles";
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const initialState = {
  latitude: 45.5017,
  longitude: -73.5673,
  zoom: 13

}


const Map = ({ classes }) => {
  const [viewport, setViewport] = useState(initialState);
  const [userPosition, setUserPosition] = useState(null);

  //when the component mounts get the user position 
  useEffect(() => {
    getUserPosition();
  }, []);


  const getUserPosition = () => {
    if ("geolocation" in navigator) { // function from the window object
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  };

  return (<div className={classes.root}>
    <ReactMapGL
      width={'100vw'}
      height={'calc(100vh - 64px)'}
      mapStyle={'mapbox://styles/mapbox/streets-v9'}
      mapboxApiAccessToken="pk.eyJ1IjoiamF5bGl1OCIsImEiOiJjazFmazBpbXAwMmNjM2RtN3lvZnMxdXNnIn0.u8gf5IkCToBLTZT6wMh62A"
      onViewportChange={newViewport => setViewport(newViewport)}
      {...viewport}
    >
      {/* {Navigation Control} */}
      <div className={classes.navigationControl}>
        <NavigationControl
          onViewportChange={newViewport => setViewport(newViewport)}
        />
      </div>

    </ReactMapGL>



  </div>);
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
