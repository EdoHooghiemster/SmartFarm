import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import '../assets/css/feed.css';
import axios from 'axios';
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import 'font-awesome/css/font-awesome.css';
import Modal from 'react-modal';

class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
        plants: [],
        liked: [],
        loadedPlantId: [],
        loading: true,
        active: false,
        showModal: false,
        comment: '',
        error: '',
        allComments: []
    }

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.publishComment = this.publishComment.bind(this);
    this.handleComment = this.handleComment.bind(this);
    this.dismissError = this.dismissError.bind(this);
    this.renderComments = this.renderComments.bind(this);
}

dismissError() {
  this.setState({ error: '' });
}

// Modal triggers
handleOpenModal (id) {
  this.getPlantById(id);

  this.setState({ showModal: true });
}

handleCloseModal () {
  this.setState({ loadedPlantId: [] });
  this.setState({ allComments: []});
  this.setState({ showModal: false });
}

// Toggle like state
toggle(likeState, plantId) {
  if(likeState == "like" ) {
    this.likePlant(plantId);
  } else { 
    this.dislikePlant(plantId);
  }
}

handleComment({ target }) {
  // target.preventDefault();
  this.setState({
    [target.name]: target.value
  });
}

publishComment(plantId) {
  this.insertComment(plantId);
}

insertComment(plantId) {
  this.setState({ loading: true })
  if (this.state.comment == "") {
    this.setState({ error: "Comment is leeg" })
    this.setState({ loading: false })
  }

  const header = localStorage.getItem('jwt token');
  const body = this.state.comment;

  axios({
    method: "post",
    url: "https://europe-west1-smartbroeikas.cloudfunctions.net/api/plant/" + plantId + "/comment",
    headers: {Authorization:header},
    data: {
      body
    }
  }).then(result => {
    if (result.status === 200) {
      this.setState({ loading: false })
      this.handleCloseModal();
    }
  }).catch(e => {
    console.log(e);
    if(e == 'Error: Request failed with status code 403'){
      this.setState({ error: 'You dont seem to be authenticated..' });
      this.setState({ loading: false })
      // this.redirect();
      return;
    }
  });

}



getCurrentLikes() {
  this.setState({ loading: true })

  axios.get("https://europe-west1-smartbroeikas.cloudfunctions.net/api/getlikes", {
    params:{}, 
    headers: { 'Authorization': localStorage.getItem('jwt token') }
  }).then(result => {
    if (result.status === 200) {
      if(result.data != null) {
        Object.keys(result.data).map(i => 
          this.state.liked.push(result.data[i].plantId)
        );    
      }
      this.setState({ loading: false })
      this.setState({active: !this.state.active});
      return;
    }
  }).catch(e => {
    alert("Something went wrong fetching likes... " + e);
    this.setState({ loading: false })
    console.log(e);
  });
}

likePlant(plantId) {
    this.setState({ loading: true })
    axios.get("https://europe-west1-smartbroeikas.cloudfunctions.net/api/plant/" + plantId + "/like", {
      params:{}, 
      headers: { 'Authorization': localStorage.getItem('jwt token') }
    }).then(result => {
      if (result.status === 200) {
        this.state.liked.push(plantId);
        this.setState({ loading: false })
        return;
      }
    }).catch(e => {
      if(e == "Error: Request failed with status code 400") {
        alert("You already liked this plant");
        this.setState({ loading: false })
      }
      if(e == "Error: Request failed with status code 403") {
        this.redirect();
      }
      console.log(e);
    });
    this.forceUpdate();
}

dislikePlant(plantId) {
  this.setState({ loading: true })
  axios.get("https://europe-west1-smartbroeikas.cloudfunctions.net/api/plant/" + plantId + "/unlike", {
    params:{}, 
    headers: { 'Authorization': localStorage.getItem('jwt token') }
  }).then(result => {
    if (result.status === 200) {
      this.removeLike(plantId);
      this.setState({ loading: false })
      return;
    }
  }).catch(e => {
    if(e == "Error: Request failed with status code 403") {
      this.redirect();
    }
    if(e == "Error: Request failed with status code 400") {
      alert("You have not liked this plant yet");
      this.setState({ loading: false })
    }
    console.log(e);
  });
  this.forceUpdate();
}

removeLike(e) {
  var array = [...this.state.liked]; // make a separate copy of the array
  var index = array.indexOf(e)
  if (index !== -1) {
    array.splice(index, 1);
    this.setState({ liked: array });
  }
}

getPlantById(plantId) {
  this.setState({ loading: true })
  axios.get("https://europe-west1-smartbroeikas.cloudfunctions.net/api/plant/" + plantId, {
    params:{}, 
    headers: { 'Authorization': localStorage.getItem('jwt token') }
  }).then(result => {
    if (result.status === 200) {
      this.setState({ loadedPlantId: result.data });
      this.setState({ loading: false })
      return;
    }
  }).catch(e => {
    if(e == "Error: Request failed with status code 403") {
      this.redirect();
    }
    alert('Something went wrong fetching details' + e);
  });
  this.forceUpdate();
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

renderComments(param) {
  if(this.state.loading == false) {
    if (param.comments === undefined || param.comments.length == 0) {
      return(
        <p>-</p>
      );  
    }
    else {
      return param.comments.map((item, oz) => {
        if(item.userHandle) {
          return (
            <p index={oz}>{item.userHandle + ': ' + item.body }</p>
          );
        }
        else {
          console.log('Geen userid');
        }
      })
    }
  }

  // if(param.comments) {

  // }
  // else {
  //   return(
  //     <p>-</p>
  //   );
  // }

  // console.log(this.state.comment);
}

componentDidMount = () => {
    if( localStorage.getItem('jwt token') == null ){
        this.redirect();
    }
}

redirect = () => {
    localStorage.clear();
    window.location.href = "/admin/login";
}

logPlants = async () => {
  const plants = this.getPlants()
    .then(response => {
      if (response.data) {
        let listTest = [];
        let allPlants = [];

        response.data.map(function(item) {
          allPlants.push(item.plant.id); // For like check
          listTest.push(item);
        })
 
        const resultLikedPlants = allPlants.filter(element => this.state.liked.includes(element));
        // Bepalen welke planten geliked zijn
        for (let index = 0; index < resultLikedPlants.length; index++) { 
          response.data.map(function(item) {
            if(item.plant.id == resultLikedPlants[index]) {
              // console.log('Matched on: ' + item.plant.id); // Deze plantenId's zijn geliked
            }
          })    
        }
        this.setState({
          plants: listTest
        })
        this.forceUpdate();
      }
    })
    .catch(error => {
      alert(error);
    })
}

  isLiked(x) {
    for (let i = 0; i < this.state.liked.length; i++) {
      if(x == this.state.liked[i]) {
        return true;
      }
      if(i == this.state.liked.length - 1) {
        return false;
      }
 
    }
  }

  
  componentWillMount() {
    this.logPlants();
    this.getCurrentLikes();
    
  }

  componentDidMount() {
    Modal.setAppElement('#main');
    this._isMounted = true;
    if( localStorage.getItem('jwt token') === null ){
        this.redirect();
    }
  }

  render() {
    let boxClass = ["box"];
    if(this.state.addClass) {
      boxClass.push('green');
    }

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

    const comments = this.state.allComments;
    const plants = this.state.plants.map((item, index) => {

    var imgUser = item.plant.imgUser
    if (imgUser == null){
      imgUser = "https://www.key2.com.au/wp-content/uploads/2019/02/indoor-rubber-plant.jpg"
    }
    return (
          <div>
              <Row key={index} className="plant-box">
                <Col key={item.plant.id} md={12}>
                  <div className="plant-image">
                    <img src={imgUser} />
                    {/* <img src={item.plant.imgUser} /> */}
                  </div>
                  <div className="plant-title">
                    <h5 className="feed-header-h5">Plant</h5>
                    <h3>{item.plant.body}</h3>
                    <h5>By: <a href="#">{item.plant.userHandle}</a></h5>
                  </div>
                  <div className="plant-soort">
                    <h5 className="feed-header-h5">Percentage</h5>
                    <h3>{item.plant.growthPercentage}%</h3>
                    <h5>Volgroeid</h5>
                  </div>
                  <div className="plant-comments">
                    <h5  className="feed-header-h5">Bekijk details</h5>
                    <div className="plant-comments-inner">
                      <button onClick={() => this.handleOpenModal(item.plant.id)}>Details</button>
                      {/* <div className="comment-box">
                        <div className="user-name">Fabian25: </div>
                        <div className="comment">Leuke plant!</div>
                      </div>
                      <div className="comment-box">
                        <div className="user-name">Edo18: </div>
                        <div className="comment">nice!</div>
                      </div>
                      <div className="comment-input">
                        <input className="comment-input-inner" type="text" name="plant-comment" placeholder="Comment" />
                      </div> */}
                    </div>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="category feed-like">
                    <div className="like">
                    {this.isLiked(item.plant.id) ? <i 
                            className="fa fa-heart"
                            onClick={() => this.toggle('unlike', item.plant.id)}
                          /> : <i 
                          className="fa fa-heart-o"
                          onClick={() => this.toggle('like', item.plant.id)}
                        />
                    }
                    </div>  
                  {item.plant.likeCount} likes</div>


                </Col>
              </Row>
          </div>
      );
    })

    return (
      <div className="content">
          <ClipLoader
            css={override}
            size={150}
            color={"#49184f"}
            loading={this.state.loading}
          />
        <Grid fluid>
          <div className="card">
            <div className="header">
              <h4 className="title">Overzicht</h4>
              <p className="category">Voortgang van andere gebruikers</p>
            </div>
            <hr />
            <div className="content">
              <div id="main">
              <Modal 
                    className="plant-detail-modal"
                    isOpen={this.state.showModal}
                    contentLabel="onRequestClose Example"
                    onRequestClose={this.handleCloseModal}
                    shouldCloseOnOverlayClick={true}
                  >
                    <div className="modal-main-outer">
                      <div className="modal-main-inner">
                        <h3>Plant detail pagina</h3>
                        <table id="loaded-plant-table">
                          <tbody>
                          <tr>
                            <th>Data</th>
                            <th>Value</th>
                          </tr>
                          <tr>
                            <td>Gebruikersnaam </td>
                            <td><a href="#">{this.state.loadedPlantId.userHandle}</a></td>
                          </tr>
                          <tr>
                            <td>Plantnaam </td>
                            <td>{this.state.loadedPlantId.body}</td>
                          </tr>
                          <tr>
                            <td>Groei voortgang </td>
                            <td>{this.state.loadedPlantId.growthPercentage}%</td>
                          </tr>
                          <tr>
                            <td>Huidige grondvochtigheid </td>
                            <td>{this.state.loadedPlantId.currentSoilMoisture}</td>
                          </tr>
                          <tr>
                            <td>Gewenste grondvochtigheid </td>
                            <td>{this.state.loadedPlantId.desiredSoilMoisture}</td>
                          </tr>
                          <tr>
                            <td>Likes </td>
                            <td>{this.state.loadedPlantId.likeCount}</td>
                          </tr>
                          <tr>  
                            <td>Reacties van gebruikers </td>
                            <td className="cm-bx">
                              <div className="scrollable">
                                {this.state.showModal ? this.renderComments(this.state.loadedPlantId): null}
                                {comments}
                              </div>
                            </td>
                          </tr>
                          </tbody>                                              
                        </table>
                        <Row>
                      <div className="comment-input">
                            <input 
                                type="text" 
                                name="comment" 
                                placeholder="Enter comment here..." 
                                value={ this.state.comment }
                                onChange={ this.handleComment } 
                              />
                              <button value="Send" onClick={() => this.publishComment(this.state.loadedPlantId.plantId)}>Publish</button>
                          
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
                          
                      </div>
                      </Row>
                      <Row>
                        <button className="btn-close" onClick={this.handleCloseModal}>✖</button>
                      </Row>
                      </div>
                    </div>
                  </Modal>
              </div>
             {plants}
            </div>
          </div>
        </Grid>
      </div>
    );
  }
}

export default Feed;
