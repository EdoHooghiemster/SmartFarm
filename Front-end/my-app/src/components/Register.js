import React, { Component } from "react";
import { InputGroup, Form, Button, Row, Col, Container } from "react-bootstrap";
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import '../register.css';
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

class Register extends Component {

  state = {
    loading: false,
    logged_in: false,
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const email = event.target.elements.formRegisterEmail.value;
    const password = event.target.elements.formRegisterPassword.value;
    const confirmPassword = event.target.elements.formRegisterConfirmPassword.value;
    const handle = event.target.elements.formRegisterHandle.value;

    if( password !== confirmPassword ) {
        alert('Passwords do not match!');
    } else {
        axios.post("https://europe-west1-smartbroeikas.cloudfunctions.net/api/signup", {
            email,
            password,
            confirmPassword,
            handle
          }).then(result => {
            if (result.status === 201) {
              alert('Uw account is aangemaakt!');
              this.props.history.push('/login');
              window.location.reload();
            }
          }).catch(e => {
            if(e == 'Error: Request failed with status code 400'){
              alert('Username of email bestaat al!');
            } else {
              alert('Er ging iets mis...');
            }
          });
    }

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

      return (
        <div>
          <ClipLoader
            css={override}
            size={150}
            color={"#49184f"}
            loading={this.state.loading}
          />
          <Container className="main-container">
            <Row>
              <Col xs={2}></Col>
              <Col xs={8}>      
                <div className="center-register-outer">
                  <div className="center-register-inner align-middle">
                    <h2>Registreren</h2>
                      <Form 
                          onSubmit={
                            (event) => this.handleSubmit(event)
                          }>
                        <Form.Group controlId="formRegisterHandle">
                        <InputGroup>
                              <InputGroup.Prepend>
                                  <InputGroup.Text>
                                  <i className="fa fa-user"></i>
                                  </InputGroup.Text>
                              </InputGroup.Prepend>
                              <Form.Control 
                                type="text"
                                placeholder="Username"
                                required
                              />
                          </InputGroup>                      
                        </Form.Group>
                        <Form.Group controlId="formRegisterEmail">
                          <InputGroup>
                              <InputGroup.Prepend>
                                  <InputGroup.Text>
                                  <i className="fa fa-envelope"></i>
                                  </InputGroup.Text>
                              </InputGroup.Prepend>
                              <Form.Control
                                  type="email"
                                  placeholder="Mail"
                                  required
                              />
                          </InputGroup>
                        </Form.Group>
                        <Form.Group controlId="formRegisterPassword">
                        <InputGroup>
                              <InputGroup.Prepend>
                                  <InputGroup.Text>
                                  <i className="fa fa-lock"></i>
                                  </InputGroup.Text>
                              </InputGroup.Prepend>
                              <Form.Control 
                                type="password"
                                placeholder="Password"
                                required
                              />
                          </InputGroup>                      
                        </Form.Group>
                        <Form.Group controlId="formRegisterConfirmPassword">
                        <InputGroup>
                              <InputGroup.Prepend>
                                  <InputGroup.Text>
                                  <i className="fa fa-lock"></i>
                                  </InputGroup.Text>
                              </InputGroup.Prepend>
                              <Form.Control 
                                type="password"
                                placeholder="Confirm password"
                                required
                              />
                          </InputGroup>                      
                        </Form.Group>                        
                        <Button onSubmit={this.handleSubmit} variant="primary btn-register" type="submit">
                          Registreren
                        </Button>
                        <Button variant="primary btn-register-back" href="/login">
                          Terug
                        </Button>
                      </Form>
                  </div>
                </div>       
              </Col>
              <Col xs={2}></Col>
            </Row>
            <Footer></Footer>
          </Container>
        </div>
      );
    }
}

function Footer({ children }) {
  return (
    <div>
      <div className="register-footer" style={{ backgroundImage: 'url(' + 'Login-trees.png' + ')' }}>{children}</div>
    </div>
  );
}

export default Register;