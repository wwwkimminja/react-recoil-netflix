import React from 'react';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Header from './components/Header';
import Home from './routes/Home';
import Tv from './routes/Tv';
import Search from './routes/Search';


function App() {
  return (
    <Router>
      <Header />
      <Switch>
        {/* <Route path="/">
          <Home />
        </Route> */}
        <Route path={["/tv","/tv/:tvId"]}>
          <Tv />
        </Route>
        <Route path={["/search","/search/:movieId"]}>
          <Search />
        </Route>
        <Route path={["/","/movies/:movieId"]}>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
