import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
        <Route path="/tv">
          <Tv />
        </Route>
        <Route path="/search">
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
