
import React, { Component } from "react";
import { Grid, Row, Col} from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from 'axios';
import ReactLoading from 'react-loading';
import AlarmClock from '../components/Clock/Clock.jsx'
import { Card } from "components/Card/Card.jsx";

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
        selectedDock: "",
        value: '',
        ldr: ''
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

}

handleChange(event) {
  this.setState({value: event.target.value});
}
handleChange2(event) {
  this.setState({ldr: event.target.value});
}

handleSubmit(event) {

  const LedColor = this.state.value;
  const ldr = this.state.ldr
  const header = localStorage.getItem('jwt token')
  axios({
    method: 'post',
    url: `https://europe-west1-smartbroeikas.cloudfunctions.net/api/broeikas/lightsettings/${this.state.broeikas[0].Id}`,
    headers: {Authorization:header},
    data: {
      LedColor,
      ldr
    }
  })
  .then(result => {
      this.setState({
          ldr : ldr,
          value: LedColor,
          modalIsOpen: false

      })       
    })
   .catch(e => {
    });
    
  event.preventDefault();


}

closeModal() {
  this.setState({modalIsOpen: false});
}
openModal() {
  this.setState({modalIsOpen: true});
}



dockPlant = (plantId) => {
  const broeikasId = this.state.broeikas[0].Id
  const header = localStorage.getItem('jwt token')

  axios({
    method: 'post',
    url: `https://europe-west1-smartbroeikas.cloudfunctions.net/api/dock/${plantId}/${this.state.selectedDock}/${broeikasId}`,
    headers: {Authorization:header},
  })
  .then(result => {
    axios.get(`https://europe-west1-smartbroeikas.cloudfunctions.net/api/getdocks/${this.state.broeikas[0].Id}`, {headers: {Authorization:header}})
    .then(res => {
      this.setState({
          dockedplants: res.data,
          loading: false,
          modalIsOpen: false
        })

    })       
  })
 .catch(e => {
  });
}

unDockPlant = (dockNumber) => {
  const broeikasId = this.state.broeikas[0].Id
  const header = localStorage.getItem('jwt token')

  axios({
    method: 'post',
    url: `https://europe-west1-smartbroeikas.cloudfunctions.net/api/dock/0/${dockNumber}/${broeikasId}`,
    headers: {Authorization:header},
  })
  .then(result => {
    axios.get(`https://europe-west1-smartbroeikas.cloudfunctions.net/api/getdocks/${this.state.broeikas[0].Id}`, {headers: {Authorization:header}})
    .then(res => {
      this.setState({
          dockedplants: res.data,
          loading: false,
        })

    })       
  })
 .catch(e => {
  });
}
  componentDidMount() {
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  componentDidMount = () => {
    const header = localStorage.getItem('jwt token')

    axios.get('https://europe-west1-smartbroeikas.cloudfunctions.net/api/details', {headers: {Authorization:header}})
        .then(res => {
            this.setState({
                    user: res.data.credentials,
                    plants : res.data.Planten,
                    broeikas: res.data.Broeikas,  
                    img: res.data.credentials.imageUrl,
                    
            })
        })
        .then(() => {
          axios.get(`https://europe-west1-smartbroeikas.cloudfunctions.net/api/getdocks/${this.state.broeikas[0].Id}`, {headers: {Authorization:header}})
          .then(res => {
            this.setState({
                dockedplants: res.data,
                loading: false
              })

          }).catch((err) => {
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
                <ReactLoading type={"balls"} color={"#180053"} height={'20%'} width={'20%'} />
              </div>
             
          } </div>
                 : <div className="container">
                 {this.state.logged_in}
             </div>
      );
  } else {
   
    
    const dockedplants = this.state.dockedplants
    let dock1 =       <Col lg={3} sm={5}><Card title="Dock 1" content={
                            <div>
                              <p>Empty</p>            
                              <Button bsStyle="info" onClick={() => {this.test('dock1')}}>
                                  Dock Plant
                               </Button>                                       
                            </div>
                          }
                        />
                      </Col>

    if(this.state.dockedplants.dock1 != null){
      dock1 =         <Col lg={3} sm={5}> <Card title={<div>Dock 1 | {dockedplants.dock1.body}</div>} content={
                          <div>
                          <p>Gewenste grondvochtigheid:<br></br> {dockedplants.dock1.desiredSoilMoisture} %</p> 
                          <p>Huidige grondvochtigheid: <br></br> {dockedplants.dock1.currentSoilMoisture} %</p> 
                          <Button bsStyle="info" onClick={() => {this.unDockPlant('dock1')}}>
                               Undock
                          </Button> 
                          </div>
                        }/>
                    </Col>
    }

   let dock2 =       <Col lg={3} sm={5}><Card title="Dock 2" content={
                            <div>
                               <p>Empty</p>    

                               <Button bsStyle="info" onClick={() => {this.test('dock2')}}>
                                  Dock Plant
                               </Button>    
                                     
                            </div>
                          }
                        />
                      </Col>

    if(this.state.dockedplants.dock2 != null){
      dock2 =         <Col lg={3} sm={5}> <Card title={<div>Dock 2 | {dockedplants.dock2.body}</div>} content={
                          <div>
                          <p>Gewenste grondvochtigheid:<br></br> {dockedplants.dock2.desiredSoilMoisture} %</p> 
                          <p>Huidige grondvochtigheid: <br></br> {dockedplants.dock2.currentSoilMoisture} %</p> 
                          <Button bsStyle="info" onClick={() => {this.unDockPlant('dock2')}}>
                               Undock
                          </Button> 
                          </div>
                        }/>
                    </Col>
    }
    let dock3 =       <Col lg={3} sm={5}><Card title="Dock 3" content={
                            <div>
                              <p>Empty</p>    

                               <Button bsStyle="info" onClick={() => {this.test('dock3')}}>
                                  Dock Plant
                               </Button>                     
                            </div>
                            
                          }
                        />
                      </Col>

    if(this.state.dockedplants.dock3 != null){
      dock3 =         <Col lg={3} sm={5}> <Card title={<div>Dock 3 | {dockedplants.dock3.body}</div>} content={
                          <div>
                          <p>Gewenste grondvochtigheid:<br></br> {dockedplants.dock3.desiredSoilMoisture} %</p> 
                          <p>Huidige grondvochtigheid: <br></br> {dockedplants.dock3.currentSoilMoisture} %</p> 
                          <Button bsStyle="info" onClick={() => {this.unDockPlant('dock3')}}>
                               Undock
                          </Button> 
                          </div>
                        }/>
                    </Col>
    }
    let dock4 =       <Col lg={3} sm={5}><Card title="Dock 4" content={
                            <div>
                              <p>Empty</p>    

                               <Button bsStyle="info" onClick={() => {this.test('dock4')}}>
                                  Dock Plant
                               </Button>                     
                            </div>
                          }
                        />
                      </Col>

    if(this.state.dockedplants.dock4 != null){
      dock4 =         <Col lg={3} sm={5}> <Card title={<div>Dock 4 | {dockedplants.dock4.body}</div>} content={
                          <div>
                          <p>Gewenste grondvochtigheid:<br></br> {dockedplants.dock4.desiredSoilMoisture} %</p> 
                          <p>Huidige grondvochtigheid: <br></br> {dockedplants.dock4.currentSoilMoisture} %</p> 
                          <Button bsStyle="info" onClick={() => {this.unDockPlant('dock4')}}>
                               Undock
                          </Button> 
                          </div>
                        }/>
                    </Col>
    }
    let dock5 =       <Col lg={3} sm={5}><Card title="Dock 5" content={
                            <div>
                              <p>Empty</p>    

                               <Button bsStyle="info" onClick={() => {this.test('dock5')}}>
                                  Dock Plant
                               </Button>                     
                            </div>
                          }
                        />
                      </Col>

    if(this.state.dockedplants.dock5 != null){
      dock5 =         <Col lg={3} sm={5}> <Card title={<div>Dock 5 | {dockedplants.dock5.body}</div>} content={
                          <div>
                          <p>Gewenste grondvochtigheid:<br></br> {dockedplants.dock5.desiredSoilMoisture} %</p> 
                          <p>Huidige grondvochtigheid: <br></br> {dockedplants.dock5.currentSoilMoisture} %</p> 
                          <Button bsStyle="info" onClick={() => {this.unDockPlant('dock5')}}>
                               Undock
                          </Button> 
                          </div>
                        }/>
                    </Col>
    }
    let dock6 =       <Col lg={3} sm={5}><Card title="Dock 6" content={
                            <div>
                              <p>Empty</p>
                               <Button bsStyle="info" onClick={() => {this.test('dock6')}}>
                                  Dock Plant
                               </Button>                     
                            </div>
                          }
                        />
                      </Col>

    if(this.state.dockedplants.dock6 != null){
      dock6 =         <Col lg={3} sm={5}> <Card title={<div>Dock 6 | {dockedplants.dock6.body}</div>} content={
                          <div>
                          <p>Gewenste grondvochtigheid:<br></br> {dockedplants.dock6.desiredSoilMoisture} %</p> 
                          <p>Huidige grondvochtigheid:<br></br> {dockedplants.dock6.currentSoilMoisture} %</p> 
                          <Button bsStyle="info" onClick={() => {this.unDockPlant('dock6')}}>
                               Undock
                          </Button> 
                          </div>
                        }/>
                    </Col>
    }
    const modal = 
    <div>
        <Button  bsStyle="info" onClick={this.openModal}>Lichtinstellingen</Button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >

      <form onSubmit={this.handleSubmit}>
        <label>
          <h4>Kies een kleur</h4>
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="rood">rood</option>
            <option value="blauw">blauw</option>
          </select>
        </label>
        <br></br>
        <label>
          <h4>ldr waarde 1 - 100</h4>

          <input
            name="ldr"
            type="ldr"
            value={this.state.ldr}
            onChange={this.handleChange2} />
        </label>
      <br></br>
      <br></br>

        <Button type="submit" value="Submit">Opslaan</Button>
      </form>

        </Modal>

        

       </div>

    return (
      
      this.state.broeikas.map((broei) =>
    
        <div className="content">
          <Grid fluid>
            <Row>
            <Col md={4}>
            <h3>Smart Farm </h3>
            <Card
              avatar={this.state.img}

              title={"Broeikas van " + broei.userHandle} 
              content ={
                <div>
                 
                  <br></br>
                  <img alt="" className="broeikasimg" src={broei.imageUrl}/>
                  <br></br>
                  <br></br>
                  <br></br>
                  <p>  Id: {broei.Id}</p>
                  <br></br>
                <Col className="data">
                  <p className="margright">Kleur: {broei.LedColor} </p> 
                  <p className="margright">Licht: {broei.lightIntensity}</p>  
                  <p className="margright">Luchtvochtigheid: {broei.humidity}</p>
                  <p className="margright">Temperatuur: {broei.temperature} </p>   
                </Col>
                {modal}

                  <AlarmClock lightOn={broei.lightsOn} lightOff={broei.lightsOff} nextAlarm={broei.alarmTime} id={broei.Id}/>
                </div>
              }
            />
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
