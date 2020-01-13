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
import Dashboard from './components/Dashboard';
import Feed from './components/Feed';
import Users from './components/Users';
import Login from './components/Login';
import Register from './components/Register';
import tandwiel from './tandwiel.svg';
import FAQ from './FAQ.svg';
import dashboard from './dashboard.svg';
import feed from './feed.svg';
import arrowwhite from './arrowwhite.svg';
import profileicon from './profileicon.png';
import arrowblack from './arrowblack.svg';
import aboutus from './aboutus.svg';
import vaporwave from './vaporwave.svg'
import vaporwave2 from './vaporwave2.jpg'

class App extends React.Component{
  
  handleRoute = () => {
    return <Redirect to="/"/>
  }

  redirect = () => {
    localStorage.clear();
    window.location.href = "/login";
  }

  render(){
    if( window.location.pathname === '/login' ||  window.location.pathname === '/register') {
      return(
        <div className="center">
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </div>
      );
  } else {
    return (
      <Router>
           <div className="App">
    <Nav className="navbar bg">
    <Navbar className=" navbar justify-content-center"  variant="dark" >
      
    <Navbar.Brand href="#home" style={{position:"center"}}>Smart Farm</Navbar.Brand>
    </Navbar>
    <ul class="secondary_navbar">
      <li class="secondary_navbar_item">
         {/* <img className="profileicon justify-content-end" src={profileicon}/> */}
         <img className="icon icon_profile imgprofileicon" src={profileicon}/>
      </li>
      <li class="secondary_navbar_item">
        {/* <img className="imgarrowwhite justify-content-end" src={arrowwhite}/> */}
        <img className="icon icon_arrow imgarrowwhite" src={arrowwhite}/>
      </li>
    </ul>
    </Nav>

    <div className="sidenav sidenav_upper sidebar">
   <SideNav 
          className="sidenav"
          onSelect={(selected) => {
          }}
    >
    <SideNav.Nav defaultSelected="/">
        <NavItem className="sidenav_item" eventKey="/">  
            
            <NavText>
            <img className="icon icon_feed imgfeed" src={feed}/>
                <Link to="/">Feed</Link>
            </NavText>
        </NavItem>
        <NavItem className="sidenav_item" eventKey="dashboard">  
            <NavText>
            <img className="icon icon_dashboard imgdashboard" src={dashboard}/>
            <Link to="/Dashboard">Dashboard</Link>
            </NavText>
        </NavItem>

<div className="sidenav sidenav_lower sidebar2">
        <SideNav.Nav onSelect="/">
        <NavItem className="sidenav_item" eventKey="about">  
            <NavText>
            <img className="icon icon_about imgaboutus" src={aboutus}/>
             Over ons
            </NavText>
        </NavItem>  
        <NavItem  className="sidenav_item" eventKey="about">  
            <NavText>
            <img className="icon icon_faq imgFAQ" src={FAQ}/>
              FAQ
            </NavText>
        </NavItem>  
        <NavItem className="sidenav_item" eventKey="about">  
            <NavText>
            <img className="icon icon_settings imgtandwiel" src={tandwiel}/>
              Instellingen
            </NavText>
        </NavItem>  
        </SideNav.Nav>
    </div>
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
                <Route path="/login">
                    <Login />
                  </Route>
          </Switch>
          </div>
        </div>
      </Router>

    );

    }
  }
}
export default App;
