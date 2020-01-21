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

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
        logged_in: false,
        loading: true
    };
}

  componentDidMount = () => {
    const header = localStorage.getItem('jwt token')

    if( localStorage.getItem('jwt token') === null ){
        this.redirect();
    }

    axios.get('https://europe-west1-smartbroeikas.cloudfunctions.net/api/details', {headers: {Authorization:header}})
        .then(res => {
            this.setState({
                    user : res.data.credentials,
                    planten : res.data.Planten,
                    logged_in: true,
                    loading: false
                    
            })
            console.log(this.state)
        })         
        .catch((err) => {
            if(err == 'Error: Request failed with status code 403'){
                this.redirect();
            }
        });
}


  render() {
    const override = css`
    display: block;
    margin: 0 auto;
    border-color: 4px solid #49184f;
    position: fixed;
    z-index: 999;
    height: 150px;
    width: 150px;
    overflow: visible;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
`;
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
    const like = "Likes: "
    const plants = this.state.planten.map((plant) => 
    
    <Col lg={3} sm={6}>
      <StatsCard
                bigIcon={<i className="pe-7s-leaf" />}
                statsText={plant.body}
                statsValue={like + plant.likeCount}
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
                avatar={this.state.user.imageUrl}
                name={this.state.user.handle}
                userName={this.state.user.email}
                description={
                  <span>
                  
                    <br />
                  Locatie:         {this.state.user.location}
                    <br />
                  {this.state.user.bio}
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
                <h3 className="justify-content-center">Mijn Planten</h3>
            
                {plants}

    


          </Row>
        </Grid>
      </div>
    );
  }
}
}

export default UserProfile;
