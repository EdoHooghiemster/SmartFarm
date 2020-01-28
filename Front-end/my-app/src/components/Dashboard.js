import React, { Component } from 'react'
import { Row, Card, Button, Container, Col } from 'react-bootstrap';
import axios from 'axios';
import '../planten.css';
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import { UserDetails } from './UserDetails';

export class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            logged_in: false,
            loading: true
        };
    }

    componentDidMount = () => {
        const header = localStorage.getItem( 'jwt token' )

        if( localStorage.getItem( 'jwt token' ) === null ){
            this.redirect();
        }

        axios.get( 'https://europe-west1-smartbroeikas.cloudfunctions.net/api/details', { headers: { Authorization:header } } )
            .then( res => {
                this.setState({
                        user : res.data.credentials,
                        broeikas: res.data.Broeikas[0],
                        logged_in: true,
                        loading: false
                        
                })
                console.log(this.state)
            })         
            .catch((err) => {
                if(err == 'Error: Request failed with status code 403'){
                    this.redirect();
                } else {
                    alert( 'Something went wrong fetching user details... ' + err );
                }
            });
    }

    redirect = () => {
        localStorage.clear();
        window.location.href = "/login";
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
                this.state.loading ? <div> {
                    <div>
                        <ClipLoader
                            css={override}
                            size={150}
                            color={"#49184f"}
                            loading={this.state.loading}
                        />
                    </div>
                   
                } </div>
                : <div className="container">
                       { this.state.logged_in }
                       <UserDetails userData = { this.state } />
                  </div>
            );
        } else {
            return(
                <div>
                    <Container style = {{ marginLeft : 70}} >
                    <UserDetails className="justify-content-center" userData = { this.state } />
                   
                    </Container>
        
                </div>
            );
        }       
    }
}

export default Dashboard
