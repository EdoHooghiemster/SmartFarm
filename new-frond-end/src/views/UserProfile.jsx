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
=======
>>>>>>> edo
import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";
<<<<<<< HEAD

=======
import axios from 'axios';
>>>>>>> edo
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
<<<<<<< HEAD

import avatar from "assets/img/faces/face-3.jpg";

class UserProfile extends Component {
  render() {
=======
import { css } from "@emotion/core";
import avatar from "assets/img/faces/face-3.jpg";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
        logged_in: false,
        loading: true,
        location: "",
        bio : "",
        selectedFile: "",
        img: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
}

handleChange(event) {
  const target = event.target;
  const value =  target.value;
  const name = target.name;
  this.setState({
    [name]: value
  });
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
        alert(header);    
    });
    
  event.preventDefault();
}

componentDidMount = () => {
    const header = localStorage.getItem('jwt token')

    axios.get('https://europe-west1-smartbroeikas.cloudfunctions.net/api/details', {headers: {Authorization:header}})
        .then(res => {
            this.setState({
                    user : res.data.credentials,
                    planten : res.data.Planten,
                    logged_in: true,
                    loading: false,
                    bio: res.data.credentials.bio,
                    location: res.data.credentials.location,      
                    img: res.data.credentials.imageUrl              
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
    const date = this.state.user.created.split(" ")
    const plants = this.state.planten.map((plant) => 
    <Col lg={3} sm={6}>
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
    </Col>
      )

>>>>>>> edo
    return (
      <div className="content">
        <Grid fluid>
          <Row>
<<<<<<< HEAD
=======

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
>>>>>>> edo
            <Col md={8}>
              <Card
                title="Edit Profile"
                content={
<<<<<<< HEAD
                  <form>
                    <FormInputs
                      ncols={["col-md-5", "col-md-3", "col-md-4"]}
                      properties={[
                        {
                          label: "Company (disabled)",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Company",
                          defaultValue: "Creative Code Inc.",
                          disabled: true
                        },
                        {
                          label: "Username",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Username",
                          defaultValue: "michael23"
                        },
                        {
                          label: "Email address",
                          type: "email",
                          bsClass: "form-control",
                          placeholder: "Email"
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-6", "col-md-6"]}
                      properties={[
                        {
                          label: "First name",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "First name",
                          defaultValue: "Mike"
                        },
                        {
                          label: "Last name",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Last name",
                          defaultValue: "Andrew"
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-12"]}
                      properties={[
                        {
                          label: "Adress",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Home Adress",
                          defaultValue:
                            "Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-4", "col-md-4", "col-md-4"]}
                      properties={[
                        {
                          label: "City",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "City",
                          defaultValue: "Mike"
                        },
                        {
                          label: "Country",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Country",
                          defaultValue: "Andrew"
                        },
                        {
                          label: "Postal Code",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "ZIP Code"
                        }
                      ]}
                    />

                    <Row>
                      <Col md={12}>
                        <FormGroup controlId="formControlsTextarea">
                          <ControlLabel>About Me</ControlLabel>
                          <FormControl
                            rows="5"
                            componentClass="textarea"
                            bsClass="form-control"
                            placeholder="Here can be your description"
                            defaultValue="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
=======
                 
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
>>>>>>> edo
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button bsStyle="info" pullRight fill type="submit">
<<<<<<< HEAD
                      Update Profile
=======
                      Update profiel
>>>>>>> edo
                    </Button>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
<<<<<<< HEAD
            <Col md={4}>
              <UserCard
                bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                avatar={avatar}
                name="Mike Andrew"
                userName="michael24"
                description={
                  <span>
                    "Lamborghini Mercy
                    <br />
                    Your chick she so thirsty
                    <br />
                    I'm in that two seat Lambo"
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
=======

            <Col md={8}>
             {plants}
            </Col>

               

    


>>>>>>> edo
          </Row>
        </Grid>
      </div>
    );
  }
}
<<<<<<< HEAD
=======
}
>>>>>>> edo

export default UserProfile;
