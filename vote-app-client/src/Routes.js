import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import PollAdd from "./containers/PollAdd";
import Poll from "./containers/Poll";
import NotFound from "./containers/NotFound";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps}/>
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/signup" exact component={Signup} props={childProps} />
    <AppliedRoute path="/poll/add" exact component={PollAdd} props={childProps} />
    <AppliedRoute path="/poll-detail/:id" exact component={Poll} props={childProps} />
    <Route component={NotFound} />
  </Switch>;