import React, { useState, useEffect, useContext } from "react";
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';
import { withStyles } from "@material-ui/core/styles";
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import Blog from "./Blog";
import AppContext from "../context/appContext";
import PinIcon from "./PinIcon";

const initialState = {
  latitude: 45.5017,
  longitude: -73.5673,
  zoom: 13

}


const Map = ({ classes }) => {

  //getting current state 
  const appContext = useContext(AppContext);
  const { draft, setDraft, updateDraft } = appContext;

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

  const handleMapClick = ({ lngLat, leftButton }) => {
    console.log(leftButton);
    if (!leftButton) return
    if (!draft) {
      setDraft();
    }

    //sending longtitude & latittude to update state draft
    updateDraft(lngLat)
  }

  return (<div className={classes.root}>
    <ReactMapGL
      width={'100vw'}
      height={'calc(100vh - 64px)'}
      mapStyle={'mapbox://styles/mapbox/streets-v9'}
      mapboxApiAccessToken="pk.eyJ1IjoiamF5bGl1OCIsImEiOiJjazFmazBpbXAwMmNjM2RtN3lvZnMxdXNnIn0.u8gf5IkCToBLTZT6wMh62A"
      onViewportChange={newViewport => setViewport(newViewport)}
      onClick={handleMapClick}
      {...viewport}
    >
      {/* {Navigation Control} */}
      <div className={classes.navigationControl}>
        <NavigationControl
          onViewportChange={newViewport => setViewport(newViewport)}
        />
      </div>
      {/* {pin of user's current location} */}
      {
        userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color={"red"} />
          </Marker>
        )

      }

      {/*draft pin*/}
      {draft && (
        <Marker
          latitude={draft.latitude}
          longitude={draft.longitude}
          offsetLeft={-19}
          offsetRight={-37}
        >
          <PinIcon size={40} color={'hotpink'} />
        </Marker>
      )}


    </ReactMapGL>

    <Blog />
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
