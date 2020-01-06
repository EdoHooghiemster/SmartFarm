import React, { Component } from 'react'
import {Card,Button} from 'react-bootstrap'
import axios from 'axios';

//Home Pagina
export class Dashboard extends Component {
    getfunc = () => {
        axios.get('https://europe-west1-smartbroeikas.cloudfunctions.net/api/getplants')
        .then(function (response) {
            // handle success
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
        });
    }
    render() {
        return (
            <div>
        <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src="holder.js/100px180" />
        <Card.Body>
            <Card.Title>Dashboard</Card.Title>
            <Card.Text>
            Some quick example text to build on the card title and make up the bulk of
            the card's content.
            </Card.Text>
            <Button onClick={this.getfunc()} variant="primary">Go somewhere</Button>
        </Card.Body>
        </Card>
            </div>
        )
    }
}

export default Dashboard
