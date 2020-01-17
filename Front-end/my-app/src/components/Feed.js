import React, { Component } from 'react'
import { Row, Card, Button, Container, Col } from 'react-bootstrap';
import axios from 'axios';
import '../planten.css';
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

//Home Pagina
export class Feed extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            plants: [],
            loading: true
        }
    }

    getPlants = async () => {
        try {
          return await axios.get('https://europe-west1-smartbroeikas.cloudfunctions.net/api/getplants', 
                                { 
                                    params:{}, 
                                    headers: { 'Authorization': localStorage.getItem('jwt token') } 
                                })         
        } catch (err) {
            if(err == 'Error: Request failed with status code 403') {
                this.redirect();
           } else {
               alert('Something went wrong... ' + err);
           }
        }
    }

    componentDidMount = () => {
        if( localStorage.getItem('jwt token') === null ){
            this.redirect();
        }
    }

    redirect = () => {
        localStorage.clear();
        window.location.href = "/login";
    }

    logPlants = async () => {
        const plants = this.getPlants()
          .then(response => {
            if (response.data) {
                let listTest = [];
                response.data.map(function(item) {
                    listTest.push(item);
                })
                this.setState({
                    plants: listTest
                })
                if (this._isMounted) {
                    this.setState({ loading: false })
                }
            }
          })
          .catch(error => {
            alert(error);
          })
      }
      
      componentWillMount() {
        this.logPlants()
      }

      componentDidMount() {
        this._isMounted = true;
        if( localStorage.getItem('jwt token') === null ){
            this.redirect();
        }
      }

      componentWillUnmount() {
        this._isMounted = false;
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
                <div>
                    <ClipLoader
                        css={override}
                        size={150}
                        color={"#49184f"}
                        loading={this.state.loading}
                    />
                </div>  
            )
        }
        else {
            const plants = this.state.plants.map((item, index) => {
                return (
                    <div key={index}>
                        <Col>
                            <Card style={{ width: '18rem' }}>
                                <img className="card-img-top" style={{ backgroundImage: 'url(' + 'placeholder-plant.jpg' + ')' }} alt="  " />
                                <Card.Body>
                                    <Card.Title>{item.body}</Card.Title>
                                    <Card.Text>
                                    {item.plantId}
                                    </Card.Text>
                                    <Button variant="primary btn-plant">Details</Button>
                                </Card.Body>
                            </Card> 
                        </Col>
                    </div>
                )
            })
            
            if( !this.state.loading ) {
                return ( 
                    <div>
                        <Row>
                            {plants}
                        </Row>
                    </div>
                );
            }

        }

    }
}

export default Feed
