import React, { Component } from "react";
import { InputGroup, Form, Button, Row, Col, Container } from "react-bootstrap";
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import '../login.css';
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

class Login extends Component {

  state = {
    loading: false,
    logged_in: false,
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const email = event.target.elements.formBasicEmail.value;
    const password = event.target.elements.formBasicPassword.value;

    this.setState({ loading: true, logged_in: false, login_status: "none" })

    axios.post("https://europe-west1-smartbroeikas.cloudfunctions.net/api/login", {
      email,
      password
    }).then(result => {
      if (result.status === 200) {
        localStorage.setItem('jwt token', 'Bearer ' + result.data);
        this.setState({ logged_in: true });
        this.props.history.push('/dashboard');
        window.location.reload();
      }
    }).catch(e => {
      if(e == 'Error: Request failed with status code 401'){
        alert('Email or password is incorrect');
      } else {
        alert('Something went wrong...');
      }
    });
  }

  componentDidMount() {
    if( localStorage.getItem('jwt token') != null ) {
      this.props.history.push('/dashboard');
      window.location.reload();
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
                <div className="center-login-outer">
                  <div className="center-login-inner align-middle">
                    <h2>Login</h2>
                      <Form 
                          onSubmit={
                            (event) => this.handleSubmit(event)
                          }>
                        <Form.Group controlId="formBasicEmail">
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
                        <Form.Group controlId="formBasicPassword">
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
                        <Form.Group controlId="formBasicCheckbox">
                          <Form.Check type="checkbox" label="Remember me" />
                        </Form.Group>
                        <Button onSubmit={this.handleSubmit} variant="primary btn-login" type="submit">
                          Login
                        </Button>
                        <Form.Text className="text-muted text-center">
                            Not a member? <a href="/register">Sign up</a> now!
                        </Form.Text>
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
      <div className="login-footer" style={{ backgroundImage: 'url(' + 'Login-trees.png' + ')' }}>{children}</div>
    </div>
  );
}

export default Login;