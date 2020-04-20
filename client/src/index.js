import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from "./pages/App.jsx";
import Splash from "./pages/Splash";
import AppState from "./context/AppState";
import ProtectedRoute from "./ProtectedRoute";

import "mapbox-gl/dist/mapbox-gl.css";
import * as serviceWorker from "./serviceWorker";

// for subscriptions
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from 'apollo-client';
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true
  }
});


// for the Apollo Provider around the React app
const client = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache()
});

const Root = () => {

  return (
    <Router>
      <ApolloProvider client={client}>
        <AppState>
          <Switch>
            <ProtectedRoute exact path="/" component={App} />
            <Route path="/login" component={Splash} />
          </Switch>
        </AppState>
      </ApolloProvider>
    </Router>

  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
