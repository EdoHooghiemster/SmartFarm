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
import Planten from './components/Planten';
import Users from './components/Users';
import Dashboard from './components/Dashboard';

class App extends React.Component{
  
  handleRoute = () => {
    return <Redirect to="/"/>
  }
  
  render (){
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
        <NavItem eventKey="users">  
            <NavText>
                <Link to="/users">Users</Link> 
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
          <Route path="/">
            <Dashboard />
          </Route>
    </Switch>

    </div>
    </Router>
  );
}
}

export default App;
