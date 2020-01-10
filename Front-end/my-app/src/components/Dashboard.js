import React, { Component } from 'react';
import axios from 'axios';
import { UserDetails } from './UserDetails';
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

//Home Pagina
export class Dashboard extends Component {

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
                        test:      res.data.credentials.userId,
                        name:      res.data.credentials.email,
                        bio:       res.data.credentials.bio,
                        location:  res.data.credentials.location,
                        logged_in: true,
                        loading: false
                })
            })         
            .catch((err) => {
                if(err == 'Error: Request failed with status code 403'){
                    this.redirect();
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

        return(
            this.state.loading ? <div>{
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
                   {this.state.logged_in}
                   <UserDetails userData = { this.state } />
               </div>
        );

    }
}

export default Dashboard
