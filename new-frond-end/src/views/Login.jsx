import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import '../assets/css/login.css';
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import footerImg from "../assets/img/Login-trees.png";

class Login extends Component {

  constructor() {
    super();
    this.state = {
      loading: false,
      logged_in: false,
      email: '',
      password: '',
      error: '',
    };

    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
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
        // this.props.history.push('/admin/dashboard');
        // window.location.reload();
        window.location.replace("/admin/dashboard");
      }
    }
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  handleSubmit(evt) {
    evt.preventDefault();

    if (!this.state.email) {
      return this.setState({ error: 'Email is verplicht' });
    }

    if (!this.state.password) {
      return this.setState({ error: 'Wachtwoord is verplicht' });
    }

    const email = this.state.email;
    const password = this.state.password;

    this.setState({ loading: true, logged_in: false, login_status: "none" })

    axios.post("https://europe-west1-smartbroeikas.cloudfunctions.net/api/login", {
      email,
      password
    }).then(result => {
      if (result.status === 200) {
        localStorage.setItem('jwt token', 'Bearer ' + result.data);
        this.setState({ logged_in: true });
        window.location.replace("/admin/dashboard");
        return;
      }
    }).catch(e => {
      console.log(e);
      if(e == 'Error: Request failed with status code 403'){
        // this.state.loading = false;
        this.setState({ loading: false });
        return this.setState({ error: 'Email or password is incorrect' });
      } else {
        this.setState({ loading: false });
        return this.setState({ error: 'Something went wrong...' });
      }
    });
  }

  handleUserChange(evt) {
    this.setState({
      email: evt.target.value,
    });
  };

  handlePassChange(evt) {
    this.setState({
      password: evt.target.value,
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
                <div className="center-login-outer">
                  <div className="center-login-inner align-middle">
                    <h2>Login</h2>
                      <form onSubmit={this.handleSubmit}>
                        <div className="login-box-outer">
                          <div className="login-box-inner"> 
                            <Row>
                              <Col md={4}>
                                <label className="login-label">Email:</label>
                              </Col>
                              <Col md={8}></Col>
                            </Row>
                            <Row>
                              <Col md={12}>
                                <input className="lgn-inputfield" placeholder="Email" type="email" data-test="username" value={this.state.username} onChange={this.handleUserChange} />
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
                                <input className="lgn-inputfield" placeholder="Wachtwoord" type="password" data-test="password" value={this.state.password} onChange={this.handlePassChange} />
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
                                <input className="login-button" type="submit" value="Login" data-test="submit" />
                              </Col>
                            </Row>
                            <Row>
                              <Col md={12}>
                                <p>Not a member? <a href="/admin/register">Sign up</a> now!</p>
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

export default Login;