
import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col} from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from 'axios';
import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";
import {
  dataPie,
  legendPie,
} from "variables/Variables.jsx";
import grid from "../grid.png"
import Modal from 'react-modal';
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '55%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-7%',
    transform             : 'translate(-50%, -50%)'
  }
};


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
        user: null,
        broeikas: null,
        plants : null,
        dockedplants: null,
        modalIsOpen: false,
        loading: true,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.test = this.test.bind(this);
}



closeModal() {
  this.setState({modalIsOpen: false});
}
openModal() {
  this.setState({modalIsOpen: true});
}

test = (plantId,dockNumber,smartFarmId ) => {
  alert(plantId + dockNumber + smartFarmId)
}

  componentDidMount = () => {
    const header = localStorage.getItem('jwt token')

    axios.get('https://europe-west1-smartbroeikas.cloudfunctions.net/api/details', {headers: {Authorization:header}})
        .then(res => {
            this.setState({
                    user: res.data.credentials,
                    plants : res.data.Planten,
                    broeikas: res.data.Broeikas,                      
            })
        })
        .then(() => {
          axios.get(`https://europe-west1-smartbroeikas.cloudfunctions.net/api/getdocks/${this.state.broeikas[0].Id}`, {headers: {Authorization:header}})
          .then(res => {
            this.setState({
                dockedplants: res.data,
                loading: false
              })
            console.log(res.data)

          }).catch((err) => {
            console.log(err)
        });
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
    const plants = 
    <div>
    <Button onClick={this.openModal}>Mijn Planten</Button>
    <Modal
      isOpen={this.state.modalIsOpen}
      onAfterOpen={this.afterOpenModal}
      onRequestClose={this.closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      {this.state.plants.map((plant) => 
      <Col lg={3} sm={6}>
      <Card
                
                title={<div> <i className="pe-7s-leaf"/> {plant.body}     </div> }
                content={
                  <div>
                  <p>Likes: {plant.likeCount} </p>
                  <p>Grondvochtigheid:<br></br> {plant.currentSoilMoisture}</p> 
                  <p>Gewenste:<br></br> {plant.desiredSoilMoisture}</p> 
                 </div> 

                }
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText={plant.createdAt}
              />
      </Col>
      )}
      <Button bsStyle="info" onClick={this.closeModal} >
          Sluiten
      </Button>
    
    </Modal>
    </div>
    
    const dockedplants = this.state.dockedplants
    let dock1 =       <Col lg={2} sm={5}><Card title="Dock 1" content={
                            <div>
                              <p>Empty</p>            
                              <Button bsStyle="info">
                                  +
                              </Button>                                      
                            </div>
                          }
                        />
                      </Col>

    if(this.state.dockedplants.dock1 != null){
      dock1 =         <Col lg={2} sm={5}> <Card title={<div>Dock 1 | {dockedplants.dock1.body}</div>} content={
                          <div>
                          <p>Gewenste grondvochtigheid:<br></br> {dockedplants.dock1.desiredSoilMoisture}</p> 
                          <p>Huidige grondvochtigheid: <br></br> {dockedplants.dock1.currentSoilMoisture}</p> 
                          </div>
                        }/>
                    </Col>
    }

   let dock2 =       <Col lg={2} sm={5}><Card title="Dock 2" content={
                            <div>
                               <p>Empty</p>    

                               <Button bsStyle="info" onClick={() => { this.test("1",'dock2', this.state.broeikas[0].Id )}}>
                                  Dock Plant
                               </Button>    
                                     
                            </div>
                          }
                        />
                      </Col>

    if(this.state.dockedplants.dock2 != null){
      dock2 =         <Col lg={2} sm={5}> <Card title={<div>Dock 2 | {dockedplants.dock2.body}</div>} content={
                          <div>
                          <p>Gewenste grondvochtigheid:<br></br> {dockedplants.dock2.desiredSoilMoisture}</p> 
                          <p>Huidige grondvochtigheid: <br></br> {dockedplants.dock2.currentSoilMoisture}</p> 
                          </div>
                        }/>
                    </Col>
    }
    let dock3 =       <Col lg={2} sm={5}><Card title="Dock 3" content={
                            <div>
                              <p>Empty</p>    

                               <Button bsStyle="info">
                                  Dock Plant
                               </Button>                     
                            </div>
                            
                          }
                        />
                      </Col>

    if(this.state.dockedplants.dock3 != null){
      dock3 =         <Col lg={2} sm={5}> <Card title={<div>Dock 3 | {dockedplants.dock3.body}</div>} content={
                          <div>
                          <p>Gewenste grondvochtigheid:<br></br> {dockedplants.dock3.desiredSoilMoisture}</p> 
                          <p>Huidige grondvochtigheid: <br></br> {dockedplants.dock3.currentSoilMoisture}</p> 
                          </div>
                        }/>
                    </Col>
    }
    let dock4 =       <Col lg={2} sm={5}><Card title="Dock 4" content={
                            <div>
                              <p>Empty</p>    

                               <Button bsStyle="info">
                                  Dock Plant
                               </Button>                     
                            </div>
                          }
                        />
                      </Col>

    if(this.state.dockedplants.dock4 != null){
      dock4 =         <Col lg={2} sm={5}> <Card title={<div>Dock 4 | {dockedplants.dock4.body}</div>} content={
                          <div>
                          <p>Gewenste grondvochtigheid:<br></br> {dockedplants.dock4.desiredSoilMoisture}</p> 
                          <p>Huidige grondvochtigheid: <br></br> {dockedplants.dock4.currentSoilMoisture}</p> 
                          </div>
                        }/>
                    </Col>
    }
    let dock5 =       <Col lg={2} sm={5}><Card title="Dock 5" content={
                            <div>
                              <p>Empty</p>    

                               <Button bsStyle="info">
                                  Dock Plant
                               </Button>                     
                            </div>
                          }
                        />
                      </Col>

    if(this.state.dockedplants.dock5 != null){
      dock5 =         <Col lg={2} sm={5}> <Card title={<div>Dock 5 | {dockedplants.dock5.body}</div>} content={
                          <div>
                          <p>Gewenste grondvochtigheid:<br></br> {dockedplants.dock5.desiredSoilMoisture}</p> 
                          <p>Huidige grondvochtigheid: <br></br> {dockedplants.dock5.currentSoilMoisture}</p> 
                          </div>
                        }/>
                    </Col>
    }
    let dock6 =       <Col lg={2} sm={5}><Card title="Dock 6" content={
                            <div>
                              <p>Empty</p>    

                               <Button bsStyle="info">
                                  Dock Plant
                               </Button>                     
                            </div>
                          }
                        />
                      </Col>

    if(this.state.dockedplants.dock6 != null){
      dock6 =         <Col lg={2} sm={5}> <Card title={<div>Dock 6 | {dockedplants.dock6.body}</div>} content={
                          <div>
                          <p>Gewenste grondvochtigheid:<br></br> {dockedplants.dock6.desiredSoilMoisture}</p> 
                          <p>Huidige grondvochtigheid:<br></br> {dockedplants.dock6.currentSoilMoisture}</p> 
                          </div>
                        }/>
                    </Col>
    }
    
 

    return (
      
      this.state.broeikas.map((broei) =>

        <div className="content">
          <Grid fluid>
            <Row>
            <Col md={4}>
            <h3>Smart Farm  </h3>

            <Card
              title={ "Broeikas van " + broei.userHandle} 
              content ={
                <div>
                  <img src={broei.imageUrl}/>
                  <br></br>
                  <p>Id: {broei.Id}</p>
                <Col className="data">
                  <p className="margright">Kleur: {broei.LedColor} </p> 
                  <p className="margright">Licht: {broei.lightIntensity}</p>  
                  <p className="margright">Luchtvochtigheid: {broei.humidity}</p>
                  <p className="margright">Temperatuur: {broei.temperature} </p>   
                </Col>
                </div>
              }
            />
            {plants}
            </Col>
            
            <h3>Docks</h3>
            
              {dock1}
              {dock2}
              {dock3}
              {dock4}
              {dock5}
              {dock6}
              


          </Row>
          

          
          </Grid>
        </div>
    ))};
  }
}

export default Dashboard;
