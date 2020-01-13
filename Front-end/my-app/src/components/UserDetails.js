import React, { Component } from 'react'
import { Row, Card, Col } from 'react-bootstrap';
import '../userdetails.css';

// User details component
export class UserDetails extends Component {

    render() {
        return (
            <div>
                <Col>
                    <Card className="dashboard-personaldata">
                        <Card.Body>
                            <Card.Title>Uw gegevens</Card.Title>
                                <Row key={this.props.userData.userId}>
                                    <div className="col"><p>E-mail adres:</p></div>
                                    <div className="col">{this.props.userData.name}</div>            
                                </Row>
                                <Row key={this.props.userData.userId}>
                                    <div className="col"><p>Locatie:</p></div>
                                    <div className="col">{this.props.userData.location}</div>            
                                </Row>
                                <Row key={this.props.userData.userId}>
                                    <div className="col"><p>Biography:</p></div>
                                    <div className="col">{this.props.userData.bio}</div>            
                                </Row>
                        </Card.Body>
                    </Card> 
                </Col>
            </div>
        )
    }
}

export default UserDetails
