import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import NotificationSystem from "react-notification-system";
import { style } from "variables/Variables.jsx";
import routes from "routes.js";
import image from "assets/img/vaporwave-light.jpg";

class Prelogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: false
    };
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={props => (
              <prop.component
                {...props}
                handleClick={this.handleNotificationClick}
              />
            )}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  render() {
    return (
      <div className="wrapper-login">
        <NotificationSystem ref="notificationSystem" style={style} />
        <div id="main-panel-inactive" className="main-panel-inactive" ref="mainPanel">
          <Switch>{this.getRoutes(routes)}</Switch>
        </div>
      </div>
    );
  }
}

export default Prelogin;
