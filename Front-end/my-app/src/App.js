import React from 'react';
import './App.css';
import { Navbar,Nav } from 'react-bootstrap';
import SideNav, { NavItem, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Planten from './components/Planten';
import Users from './components/Users';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';

class App extends React.Component{
  
  handleRoute = () => {
    return <Redirect to="/"/>
  }

  redirect = () => {
    localStorage.clear();
    window.location.href = "/login";
  }

  render (){
    console.log('appjs');

    if( window.location.pathname === '/login' ||  window.location.pathname === '/register') {
      return(
        <div className="center">
          {/* <Login /> */}
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </div>
      );
  } else {
    return (
      <Router>
      <div className="App">
      <Nav style={{backgroundColor: '#49184F'}} className="justify-content-center">
      <Navbar  variant="dark" >
      <Navbar.Brand href="#home" style={{position:"center"}}>Smart Farm</Navbar.Brand>
      </Navbar>
      </Nav>
  
      <SideNav style={{backgroundColor:"#270F27"}}
            onSelect={(selected) => {
            }}
      >
  
      <SideNav.Nav defaultSelected="/">
          <NavItem eventKey="/">  
              <NavText>
                  <Link to="/">Dashboard</Link>
              </NavText>
          </NavItem>
          <NavItem eventKey="about">  
              <NavText>
              <Link to="/planten">Planten</Link>
              </NavText>
          </NavItem>
          <NavItem eventKey="feed">  
              <NavText>
              <Link to="/feed">Feed</Link>
              </NavText>
          </NavItem>          
          <NavItem eventKey="users">  
              <NavText>
                  <Link to="/users">Users</Link> 
              </NavText>
          </NavItem>
          <NavItem eventKey="login">  
              <NavText>
                  <Link to="/login">Login</Link> 
              </NavText>             
          </NavItem>  
          <NavItem eventKey="register">
              <NavText>
                <Link to="/register">Registreer</Link> 
              </NavText>   
          </NavItem>   
      </SideNav.Nav>
      </SideNav>
      
      <Switch>
            <Route path="/planten">
              <Planten />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/">
              <Dashboard />
            </Route>
      </Switch>
  
      </div>
      </Router>
    );
  }
}
}

export default App;
