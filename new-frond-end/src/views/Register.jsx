import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import '../assets/css/login.css';
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import footerImg from "../assets/img/Login-trees.png";

class Register extends Component {

  constructor() {
    super();
    this.state = {
      loading: false,
      logged_in: false,
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: '',
    };

    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handlePassConfirmChange = this.handlePassConfirmChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.dismissError = this.dismissError.bind(this);
  }

  dismissError() {
    this.setState({ error: '' });
  }

  componentDidMount() {
    this._isMounted = true;
    if(this._isMounted) {
      if( localStorage.getItem('jwt token') != null) {
        // window.location.replace("/admin/dashboard");
      }
    }
  }

  componentWillUnmount(){
    this._isMounted = false;
  }



  handleUserChange(evt) {
    this.setState({
      username: evt.target.value,
    });
  };

  handleEmailChange(evt) {
    this.setState({
      email: evt.target.value,
    });
  };

  handlePassChange(evt) {
    this.setState({
      password: evt.target.value,
    });
  }

  handlePassConfirmChange(evt) {
    this.setState({
      confirmPassword: evt.target.value,
    });
  }

  removeLoader() {
    this.setState({ loading: false });
  }

  handleSubmit(event) {
      this.setState({ loading: true });
      event.preventDefault();   
      
      if (!this.state.username) {
        this.removeLoader();
        return this.setState({ error: 'Username is verplicht' });
      }

      if (!this.state.email) {
        this.removeLoader();
        return this.setState({ error: 'Email is verplicht' });
      }
  
      if (!this.state.password) {
        this.removeLoader();
        return this.setState({ error: 'Wachtwoord is verplicht' });
      }

      if(this.state.password != this.state.confirmPassword) {
        this.removeLoader();
        return this.setState({ error: 'Wachtwoorden matchen niet' });
      }

      if(this.state.password.length < 6) {
        this.removeLoader();
        return this.setState({ error: 'Wachtwoord moet minimaal 6 karakters lang zijn' });
      }

      const handle = this.state.username;
      const email = this.state.email;
      const password = this.state.password;
      const confirmPassword = this.state.confirmPassword;
  
      this.setState({ loading: true, logged_in: false, login_status: "none" })
  
      if( password == confirmPassword ) {
        if( password.length > 6 ) {
          axios.post("https://europe-west1-smartbroeikas.cloudfunctions.net/api/signup", {
            email,
            password,
            confirmPassword,
            handle
          }).then(result => {
            if (result.status === 201) {
              alert('Uw account is aangemaakt!');
              window.location.replace("/admin/login");
            }
          }).catch(e => {
            if(e == 'Error: Request failed with status code 400'){
              this.removeLoader();
              return this.setState({ error: 'Username of email bestaat al!' });
            } else {
              this.removeLoader();
              return this.setState({ error: 'Er ging iets mis...' });
            }
          });
        }
      }
      this.setState({ loading: false });
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
        <div className="content">
          <ClipLoader
            css={override}
            size={150}
            color={"#49184f"}
            loading={this.state.loading}
          />
            <Row>
              <Col xs={2}></Col>
              <Col xs={8}>      
                <div className="register-login-outer">
                  <div className="center-login-inner align-middle">
                    <h2>Registreren</h2>
                      <form onSubmit={this.handleSubmit}>
                        <div className="login-box-outer">
                          <div className="login-box-inner">
                          <Row>
                              <Col md={4}>
                                <label className="login-label">Username:</label>
                              </Col>
                              <Col md={8}></Col>
                            </Row>
                            <Row>
                              <Col md={12}>
                                <input 
                                    className="lgn-inputfield"
                                    placeholder="Username"
                                    type="text"
                                    data-test="username"
                                    value={this.state.username}
                                    onChange={this.handleUserChange} />
                              </Col>
                            </Row>
                            <Row>
                              <Col md={4}>
                                <label className="login-label">Email:</label>
                              </Col>
                              <Col md={8}></Col>
                            </Row>
                            <Row>
                              <Col md={12}>
                                <input 
                                    className="lgn-inputfield"
                                    placeholder="Email"
                                    type="email"
                                    data-test="username"
                                    value={this.state.email}
                                    onChange={this.handleEmailChange} />
                              </Col>
                            </Row>
                            <Row>
                              <Col md={4}>
                                <label className="login-label">Wachtwoord:</label>
                              </Col>
                              <Col md={8}></Col>
                            </Row>
                            <Row>
                              <Col md={12}>
                                <input
                                    className="lgn-inputfield"
                                    placeholder="Wachtwoord"
                                    type="password"
                                    data-test="password"
                                    value={this.state.password}
                                    onChange={this.handlePassChange} />
                              </Col>
                            </Row>
                            <Row>
                              <Col md={6}>
                                <label className="login-label">Bevestig wachtwoord:</label>
                              </Col>
                              <Col md={6}></Col>
                            </Row>
                            <Row>
                              <Col md={12}>
                                <input
                                    className="lgn-inputfield"
                                    placeholder="Wachtwoord"
                                    type="password"
                                    data-test="confirmpassword"
                                    value={this.state.confirmPassword}
                                    onChange={this.handlePassConfirmChange} />
                              </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                {
                                this.state.error &&
                                  <div>
                                    <h5 className="login-error" data-test="error" onClick={this.dismissError}>  
                                      {this.state.error}
                                      <button onClick={this.dismissError}> ✖ </button>
                                    </h5>
                                  </div>
                                }
                                </Col>
                              </Row>

                            <Row>
                              <Col md={12}>
                                <input className="login-button" type="submit" value="Registreer" data-test="submit" />
                              </Col>
                            </Row>
                            <Row>
                              <Col md={12}>
                                <p>Al lid? <a href="/admin/login">Ga terug</a></p>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </form>
                  </div>
                </div>       
              </Col>
              <Col xs={2}></Col>
            </Row>
            <Footer></Footer>
        </div>
      );
    }
}

function Footer({ children }) {
  return (
    <div>
      <div className="login-footer" style={{ backgroundImage: 'url(' + footerImg + ')' }}>{children}</div>
    </div>
  );
}

export default Register;