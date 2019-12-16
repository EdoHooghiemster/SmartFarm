import React from 'react';
import './App.css';
import {Navbar,Nav} from 'react-bootstrap';
import SideNav, { Toggle, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Dashboard from './components/Dashboard';
import Feed from './components/Feed';
import Users from './components/Users';
import tandwiel from './tandwiel.svg';
import FAQ from './FAQ.svg';
import dashboard from './dashboard.svg';
import feed from './feed.svg';

class App extends React.Component{
  
  handleRoute = () => {
    return <Redirect to="/"/>
  }
  
  render (){
  return (
    <Router>


    <div className="App">
    <Nav class="navbar justify-content-center">
    <Navbar  variant="dark" >
    <Navbar.Brand href="#home" style={{position:"center"}}>Smart Farm</Navbar.Brand>
    </Navbar>
    </Nav>

<div className="sidebar">
   <SideNav 
          onSelect={(selected) => {
          }}
    >


    <SideNav.Nav defaultSelected="/">
        <NavItem eventKey="/">  
            <NavText>
                <Link to="/">Feed</Link>
            </NavText>
        </NavItem>
        <NavItem eventKey="about">  
            <NavText>
            <img className="imgdashboard" src={dashboard}/>
            <Link to="/Dashboard">Dashboard</Link>
            </NavText>
        </NavItem>    
        <NavItem eventKey="about">  
            <NavText>
              Over ons
            </NavText>
        </NavItem>  
        <NavItem eventKey="about">  
            <NavText>
            <img className="imgFAQ" src={FAQ}/>
              FAQ
            </NavText>
        </NavItem>  
        <NavItem eventKey="about">  
            <NavText>
            <img className="imgtandwiel" src={tandwiel}/>
              Instellingen
            </NavText>
        </NavItem>  
    </SideNav.Nav>
    </SideNav>
    </div>
 
    <div className="container">
    <Switch>
          <Route path="/Dashboard">
            <Dashboard />
          </Route>
          <Route path="/">
            <Feed />
          </Route>
    </Switch>
    </div>
    </div>
    </Router>
  );
}
}

export default App;
