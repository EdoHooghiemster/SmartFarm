
import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";
import axios from 'axios';
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { css } from "@emotion/core";
import avatar from "assets/img/faces/face-3.jpg";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
        logged_in: false,
        loading: true,
        location: "",
        bio : "",
        selectedFile: "",
        img: null,
        modalIsOpen: false,
        modalIsOpen2: false,
        body: "",
        soil: "",
        selectedPlant: "",    

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeModalAndSave = this.closeModalAndSave.bind(this);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.openModal2 = this.openModal2.bind(this);
    this.closeModal2 = this.closeModal2.bind(this);


}
openModal() {
  this.setState({modalIsOpen: true});
}

openModal2(plantid){
  this.setState({modalIsOpen2: true,
                 selectedPlant : plantid});

}


afterOpenModal() {
// references are now sync'd and can be accessed.
  this.subtitle.style.color = '#f00';
}
closeModal2() {
  this.setState({modalIsOpen2: false});
}


closeModalAndSave() {

  alert('A name was submitted: ' + this.state.body);
  const body = this.state.body;
  const header = localStorage.getItem('jwt token')
  axios({
    method: 'post',
    url: 'https://europe-west1-smartbroeikas.cloudfunctions.net/api/createPlant',
    headers: {Authorization:header},
    data: {
      body
    }
  })
  .then(result => {
      alert('Succes' + result);   
      this.setState({
          body : body
      })       
    })
   .catch(e => {
     alert(e)
    });
      axios.get('https://europe-west1-smartbroeikas.cloudfunctions.net/api/details', {headers: {Authorization:header}})
        .then(res => {
            this.setState({
                    planten : res.data.Planten,
                    logged_in: true,
                    modalIsOpen: false
            
            })
            console.log(this.state)
        })         
        .catch((err) => {
            if(err == 'Error: Request failed with status code 403'){
            }
        });  
}

closeModalAndSave2() {
  alert('A name was submitted: ' + this.state.soil);
  const desiredSoilMoisture = this.state.soil;
  const header = localStorage.getItem('jwt token')
  axios({
    method: 'post',
    url: `https://europe-west1-smartbroeikas.cloudfunctions.net/api/desiredSoilMoisture/${this.state.selectedPlant}`,
    headers: {Authorization:header},
    data: {
      desiredSoilMoisture
    }
  })
  .then(result => {
      alert('Succes' + result);   
      this.setState({
          soil : desiredSoilMoisture
      })      
      axios.get('https://europe-west1-smartbroeikas.cloudfunctions.net/api/details', {headers: {Authorization:header}})
      .then(res => {
          this.setState({
                  planten : res.data.Planten,
                  logged_in: true,
                  modalIsOpen2: false
          
          })
          console.log(this.state)
      })         
      .catch((err) => {
          if(err == 'Error: Request failed with status code 403'){
          }
      });  
    })
   .catch(e => {
     alert(e)
    });
     
}

closeModal() {
  this.setState({modalIsOpen: false});
}
handleChange(event) {
  const target = event.target;
  const value =  target.value;
  const name = target.name;
  this.setState({
    [name]: value
  });
}
handleChange2(event) {
  console.log(this.state.soil)
  this.setState({soil: event.target.value});
}
handleChange3(event) {
  console.log(this.state.body)
  this.setState({body: event.target.value});
}
fileSelectedHandler = event => {
  this.setState({
    selectedFile: event.target.files[0]
  })
}

fileUploadHandler = () => {
  
  const header = localStorage.getItem('jwt token')
  const fd = new FormData();
  fd.append('image', this.state.selectedFile, this.state.selectedFile.name)
  axios({
    method: 'post',
    url: 'https://europe-west1-smartbroeikas.cloudfunctions.net/api/user/image',
    headers: {Authorization:header, 'content-type': 'application/json'},
    data:fd
  })
  .then(res => {
    window.location.reload();
  })
  .catch(e => {
    console.log(e)
  })
}

handleSubmit = (event) => {
  alert('A name was submitted: ' + this.state.bio + this.state.location);
  const location = this.state.location;
  const bio = this.state.bio;
  const header = localStorage.getItem('jwt token')
  axios({
    method: 'post',
    url: 'https://europe-west1-smartbroeikas.cloudfunctions.net/api/user',
    headers: {Authorization:header},
    data: {
      bio,
      location
    }
  })
  .then(result => {
      alert('Succes' + result);   
      this.setState({
          bio : bio,
          location: location
      })       
    })
   .catch(e => {
        alert(e);    
    });
    
  event.preventDefault();
}



componentWillMount = () => {
this.setState({loading: true})
const test = ["damian", "Edvleespet"];
const testing = []

  test.forEach(item => {
    axios.get(`https://europe-west1-smartbroeikas.cloudfunctions.net/api/getimage/${item}`, {})
    .then(res => {
      testing.push(res.data)
    })
    
  })
  console.log(testing)
  

    const header = localStorage.getItem('jwt token')

    axios.get('https://europe-west1-smartbroeikas.cloudfunctions.net/api/details', {headers: {Authorization:header}})
        .then(res => {
            this.setState({
                    user : res.data.credentials,
                    planten : res.data.Planten,
                    logged_in: true,
                    bio: res.data.credentials.bio,
                    location: res.data.credentials.location,  
                    img: res.data.credentials.imageUrl,
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
        
              </div>
             
          } </div>
                 : <div className="container">
                 {this.state.logged_in}
             </div>
      );
  } else {

    const modal =     <div>
    <h3> Mijn Planten  <Button  bsStyle="info" onClick={this.openModal}>+ Plantje Toevoegen</Button></h3>
    <Modal
      isOpen={this.state.modalIsOpen}
      onAfterOpen={this.afterOpenModal}
      onRequestClose={this.closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >

      <h2 ref={subtitle => this.subtitle = subtitle}></h2>
      <h2>Plantje Toevoegen</h2>
      <form>
      <br></br>

      <ControlLabel>Naam</ControlLabel>
          <FormControl
                required
                            name="location"
                            value={this.state.body} 
                            onChange={this.handleChange3}
                            rows="1"
                            componentClass="textarea"
                            bsClass="form-control"
                            placeholder=""
          />
          <br></br>
      <Button bsStyle="info" onClick={this.closeModalAndSave} pullRight fill type="submit">
          Opslaan
      </Button>
      
      <Button bsStyle="info" onClick={this.closeModal} >
          Sluiten
      </Button>
      </form>
      <br></br>
    
    </Modal>
   </div>
        const modal2 =     <div>
        <Modal
          isOpen={this.state.modalIsOpen2}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal2}
          style={customStyles}
          contentLabel="Example Modal"
        >
    
          <h2 ref={subtitle => this.subtitle = subtitle}></h2>
          <h2>Gewenste grondvochtigheid aanpassen</h2>
          <form>
          <br></br>
    
          <ControlLabel>Grondvochtigheid in %</ControlLabel>
              <FormControl
                    required
                                name="soil"
                                value={this.state.soil} 
                                onChange={this.handleChange2}
                                rows="1"
                                componentClass="textarea"
                                bsClass="form-control"
                                placeholder=""
              />
              <br></br>
          <Button bsStyle="info" onClick={()=>{this.closeModalAndSave2()}} pullRight fill type="submit">
              Opslaan
          </Button>
          
          <Button bsStyle="info" onClick={this.closeModal2} pullLeft>
              Sluiten
          </Button>
          </form>
          <br></br>
  
        </Modal>
       </div>


    const date = this.state.user.created.split(" ")
    const plants = this.state.planten.map((plant) => 
    <Col lg={3} sm={6}>
      <Card
                
                title={<div> <i className="pe-7s-leaf"/> {plant.body}     </div> }
                content={
                  <div>
                  <p>Likes: {plant.likeCount} </p>
                  <p>Huidige Grondvochtigheid:<br></br> {plant.currentSoilMoisture}</p> 
                  <p>Gewenste Grondvochtigheid: <Button onClick={() => {this.openModal2(plant.Id)}}  >Aanpassen</Button><br></br> {plant.desiredSoilMoisture}</p> 

                 <br></br>
                 </div> 

                }
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText={plant.createdAt}
              />
    </Col>
      )

    return (
      <div className="content">
        <Grid fluid>
          <Row>

          <Col md={4}>
     
   

              <UserCard
                bgImage="https://images.squarespace-cdn.com/content/v1/52607a12e4b09a5b407933dd/1397192939867-FKOZYBJTVRG6EQV0QVLF/ke17ZwdGBToddI8pDm48kDLNi4VuRPPv4o6xvaQaV48UqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYy7Mythp_T-mtop-vrsUOmeInPi9iDjx9w8K4ZfjXt2dgPj-jb3FIxaFObZnptc5ZqmTvRvnyT87dNVz9QRODYYMW9u6oXQZQicHHG1WEE6fg/IMG_0998.JPG"
                avatar={this.state.img}
                
                name={
                    <div>
               
                    {this.state.user.handle}
                    </div>}
                userName={this.state.user.email}
                description={
                  <span>
                  
                    <br />
                  Locatie: {this.state.location}
                  <br />
                   <br/>
                  {this.state.bio}
                  <br/>
                  <br/>
                  Lid sinds: {date[2] +"/"+ date[1] +"/"+ date[3]}
                  </span>
                }
                socials={
                  <div>
                    <Button simple>
                      <i className="fa fa-facebook-square" />
                    </Button>
                    <Button simple>
                      <i className="fa fa-twitter" />
                    </Button>
                    <Button simple>
                      <i className="fa fa-google-plus-square" />
                    </Button>
                  </div>
                }
              />

            </Col>
            <Col md={8}>
              <Card
                title="Edit Profile"
                content={
                 
                  <form onSubmit={this.handleSubmit}>
                        
                      <ControlLabel>ProfielFoto</ControlLabel>
                      <input className="inputfile" type="file" onChange={this.fileSelectedHandler}/>
                      <Button onClick={this.fileUploadHandler}>Upload</Button>

                      <br></br>
                      <br></br>

                        <ControlLabel>Plaats</ControlLabel>
                        <FormControl
                            name="location"
                            value={this.state.location} 
                            onChange={this.handleChange}
                            rows="1"
                            componentClass="textarea"
                            bsClass="form-control"
                            placeholder="Plaats"
                          />
                    <br></br>
                    <Row>
                      <Col md={12}>
                        <FormGroup controlId="formControlsTextarea">
                          <ControlLabel>Over mij</ControlLabel>
                          <FormControl
                            name="bio"
                            value={this.state.bio} 
                            onChange={this.handleChange}
                            rows="5"
                            componentClass="textarea"
                            bsClass="form-control"
                            placeholder="Vertel wat over jezelf"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button bsStyle="info" pullRight fill type="submit">
                      Update profiel
                    </Button>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
                {modal}
                {modal2}
                <br></br>
             {plants}

               

    


          </Row>
        </Grid>
      </div>
    );
  }
}
}

export default UserProfile;
