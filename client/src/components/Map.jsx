import React, { useState, useEffect, useContext } from "react";
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Blog from "./Blog";
import AppContext from "../context/appContext";
import PinIcon from "./PinIcon";
import { useClient } from "../client";
import { GET_PINS_QUERY } from "../graphql/queries";
import { DELETE_PIN_MUTATION } from "../graphql/mutations";
import differenceInMinutes from "date-fns/differenceInMinutes" // helper for time
// for subscriptions
import { Subscription } from 'react-apollo';
import { PIN_ADDED_SUBSCRIPTION, PIN_UPDATED_SUBSCRIPTION, PIN_DELETED_SUBSCRIPTION } from "../graphql/subscriptions";

const initialState = {
  latitude: 45.5017,
  longitude: -73.5673,
  zoom: 13

}

const Map = ({ classes }) => {
  // custom hook to create the Apollo Server
  const client = useClient();

  // useMediaQuery for responsive
  const mobileSize = useMediaQuery('(max-width:600px)');

  //getting current state 
  const appContext = useContext(AppContext);
  const { currentUser, draft, pins,
    setDraft, updateDraft, setPinsArray,
    setPin, pinToBeDeleted, createNewPin,
    creatNewComment } = appContext;

  const [viewport, setViewport] = useState(initialState);
  const [userPosition, setUserPosition] = useState(null);
  const [popup, setPopup] = useState(null);

  //remove popup if user itself deleted it 
  useEffect(() => {
    const pinExists = popup && pins.findIndex(pin => pin._id === popup._id) > -1
    if (!pinExists) {
      setPopup(null);
    }
    // eslint-disable-next-line
  }, [pins.length])



  //using another useEffect to seperate concerns and retrive pins from db
  useEffect(() => {
    getPins();
    //eslint-disable-next-line
  }, []);

  //when the component mounts get the user position 
  //[] will be keep calling unless this is passed so it wont remount
  useEffect(() => {
    getUserPosition();
    //eslint-disable-next-line
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

  const getPins = async () => {
    // destructuring getPins from data
    const { getPins } = await client.request(GET_PINS_QUERY);
    console.log(getPins);
    setPinsArray(getPins)

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

  const highlightNewPin = pin => {
    const isNewPin = differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30;
    return isNewPin ? "limegreen" : "darkblue";
  };

  const isAuthUser = () => currentUser._id === popup.author._id;

  const handleDeletePin = async pin => {
    const variables = { pinId: pin._id };
    const { deletePin } = await client.request(DELETE_PIN_MUTATION, variables);

    console.log('Pin deleted!', { deletePin });
    // dispatch is moved to the subscriptions
    //pinToBeDeleted(deletePin)

    setPopup(null);
  };


  const handleSelectPin = pin => {
    setPopup(pin);
    setPin(pin);
  };



  return (
    <div className={mobileSize ? classes.rootMobile : classes.root}>
      <ReactMapGL
        width={'100vw'}
        height={'calc(100vh - 64px)'}
        mapStyle={'mapbox://styles/mapbox/streets-v9'}
        mapboxApiAccessToken="pk.eyJ1IjoiamF5bGl1OCIsImEiOiJjazFmazBpbXAwMmNjM2RtN3lvZnMxdXNnIn0.u8gf5IkCToBLTZT6wMh62A"
        scrollZoom={!mobileSize}
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

        {/*Display all pins */}
        {pins.map(pin =>
          (<Marker
            key={pin._id}
            latitude={pin.latitude}
            longitude={pin.longitude}
            offsetLeft={-19}
            offsetRight={-37}
          >
            <PinIcon
              onClick={() => handleSelectPin(pin)}
              size={40}
              color={highlightNewPin(pin)}
            />
          </Marker>)
        )}

        {/*Pop up info*/}
        {popup && (
          <Popup
            anchor={'top'}
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => setPopup(null)}
          >
            <img
              className={classes.popupImage}
              src={popup.image}
              alt={popup.title}
            />
            <div className={classes.popupTab}>

              <Typography>
                {popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
              </Typography>
              {isAuthUser() && (
                <Button onClick={() => handleDeletePin(popup)}>
                  <DeleteIcon className={classes.deleteIcon} />
                </Button>
              )}

            </div>

          </Popup>
        )}
      </ReactMapGL>
      {/*Subscription for creating/updating/deleting pins*/}
      <Subscription
        subscription={PIN_ADDED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinAdded } = subscriptionData.data;
          console.log("Pin created", { pinAdded })
          createNewPin(pinAdded);
        }}
      />

      <Subscription
        subscription={PIN_UPDATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinUpdated } = subscriptionData.data;
          console.log("pinUpdated", { pinUpdated })
          creatNewComment(pinUpdated)
        }}
      />

      <Subscription
        subscription={PIN_DELETED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinDeleted } = subscriptionData.data;
          console.log("pinDeleted", { pinDeleted })
          pinToBeDeleted(pinDeleted)
        }}
      />


      {/* Blog Area */}
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
