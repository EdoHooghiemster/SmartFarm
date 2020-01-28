
import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";
import axios from 'axios';
import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";
import {
  dataPie,
  legendPie,
  
} from "variables/Variables.jsx";
import grid from "../grid.png"

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
        user: null,
        broeikas: null,
        plants : null,
        loading: true
    };
}
  componentDidMount = () => {
    const header = localStorage.getItem('jwt token')

    axios.get('https://europe-west1-smartbroeikas.cloudfunctions.net/api/details', {headers: {Authorization:header}})
        .then(res => {
            this.setState({
                    user: res.data.credentials,
                    plants : res.data.Planten,
                    broeikas: res.data.Broeikas,
                    loading: false,
                      
            })
            console.log(this.state)
        })         
        .catch((err) => {
            if(err == 'Error: Request failed with status code 403'){
            }
        });
  }

  render() {
    if( this.state.loading ) {
      return(
          this.state.loading ? <div>{
              <div>
                  <h1>Wait pls</h1>
              </div>
             
          } </div>
                 : <div className="container">
                 {this.state.logged_in}
             </div>
      );
  } else {
    const plants = this.state.plants.map((plant) => 
      <Card
                
                title={<div> <i className="pe-7s-leaf"/> {plant.body}  </div> }
                content={
                  <div>
                  <p>Likes: {plant.likeCount} </p>
                  <p>Grondvochtigheid: {plant.currentSoilMoisture}</p> 
                 </div> 

                }
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText={plant.createdAt}
              />
      )
    return (

      this.state.broeikas.map((broei) =>

        <div className="content">
          <Grid fluid>
            <Row>

            <Col md={4}>
            <h3>Smart Farm</h3>

            <Card
              title={ "Broeikas van " + broei.userHandle} 
              content ={
                <div>
                  <p>Id: {broei.Id}</p>
                <Col className="data">
                  <p className="margright">Kleur licht: {broei.LedColor} </p> 
                  <p className="margright">Licht: {broei.lightIntensity}</p>  
                  <p className="margright">Luchtvochtigheid: {broei.humidity}</p>
                  <p className="margright">Temperatuur: {broei.temperature} </p>   
                </Col>
                </div>
              }
            />
            <h3>Mijn Planten</h3>
            {plants}
            </Col>
            <h3>Docks</h3>
              <Col lg={3} sm={6}>
                <Card
                  title="Dock 1"
                  content={
                    <div>
                      <p>Empty</p>
                    </div>
                  }
                />
              </Col>
              <Col lg={3} sm={6}>
              <Card
                  title="Dock 2"
                  content={
                    <div>
                      <p>Empty</p>

                    </div>
                  }
            />
              </Col>
              <Col lg={3} sm={6}>
              <Card
                  title="Dock 3"
                  content={
                    <div>
                      <p>Empty</p>
                    </div>
                  }
            />
              </Col>
              <Col lg={3} sm={6}>
              <Card
                  title="Dock 4"
                  content={
                    <div>
                      <p>Empty</p>                    
                    </div>
                  }
            />
              </Col>
              <Col lg={3} sm={6}>
                <Card
                  title="Dock 5"
                  content={
                    <div>
                      <p>Empty</p>                    
                    </div>
                  }
                />
              </Col>
              <Col lg={3} sm={6}>
                <Card
                  title="Dock 6"
                  content={
                    <div>
                      <p>Empty</p>
                    </div>
                  }
                />
              </Col>
            </Row>
          

          
          </Grid>
        </div>
    ))};
  }
}

export default Dashboard;
