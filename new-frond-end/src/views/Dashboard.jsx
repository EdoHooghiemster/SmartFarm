<<<<<<< HEAD
/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";

=======

import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";
import axios from 'axios';
>>>>>>> edo
import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";
import {
  dataPie,
  legendPie,
<<<<<<< HEAD
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar
} from "variables/Variables.jsx";

class Dashboard extends Component {
  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={3} sm={6}>
              <StatsCard
           
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-success" />}
                statsText="Revenue"
                statsValue="$1,345"
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Last day"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                statsText="Errors"
                statsValue="23"
                statsIcon={<i className="fa fa-clock-o" />}
                statsIconText="In the last hour"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="fa fa-twitter text-info" />}
                statsText="Followers"
                statsValue="+45"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Card
                statsIcon="fa fa-history"
                id="chartHours"
                title="Users Behavior"
                category="24 Hours performance"
                stats="Updated 3 minutes ago"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataSales}
                      type="Line"
                      options={optionsSales}
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendSales)}</div>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                statsIcon="fa fa-clock-o"
                title="Email Statistics"
                category="Last Campaign Performance"
                stats="Campaign sent 2 days ago"
                content={
                  <div
                    id="chartPreferences"
                    className="ct-chart ct-perfect-fourth"
                  >
                    <ChartistGraph data={dataPie} type="Pie" />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendPie)}</div>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Card
                id="chartActivity"
                title="2014 Sales"
                category="All products including Taxes"
                stats="Data information certified"
                statsIcon="fa fa-check"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataBar}
                      type="Bar"
                      options={optionsBar}
                      responsiveOptions={responsiveBar}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendBar)}</div>
                }
              />
            </Col>

            <Col md={6}>
              <Card
                title="Tasks"
                category="Backend development"
                stats="Updated 3 minutes ago"
                statsIcon="fa fa-history"
                content={
                  <div className="table-full-width">
                    <table className="table">
                      <Tasks />
                    </table>
                  </div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
=======
  
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
>>>>>>> edo
  }
}

export default Dashboard;
