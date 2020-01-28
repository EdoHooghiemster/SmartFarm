import React, { Component } from "react";
import { Grid, Row, Col, Card } from "react-bootstrap";
import '../assets/css/feed.css';
import axios from 'axios';
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import 'font-awesome/css/font-awesome.css';

class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
        plants: [],
        liked: [],
        loading: true,
        active: false
    }
}

toggle(likeState, plantId) {
  if(likeState == "like" ) {
    this.likePlant(plantId);
  } else { 
    this.dislikePlant(plantId);
  }

}



likePlant(plantId) {
    this.setState({ loading: true })
    axios.get("https://europe-west1-smartbroeikas.cloudfunctions.net/api/plant/" + plantId + "/like", {
      params:{}, 
      headers: { 'Authorization': localStorage.getItem('jwt token') }
    }).then(result => {
      if (result.status === 200) {
        this.state.liked.push(plantId);
        console.log(this.state.liked);
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
    if( localStorage.getItem('jwt token') == null ){
        this.redirect();
    }
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
    this.setState({ loading: false })
    console.log(e);
  });
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
              console.log('Matched on: ' + item.plant.id); // Deze plantenId's zijn geliked
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
      //console.log(this.state.plants[i].plant.id);
      if(x == this.state.liked[i]) {
        console.log('Reached true ' + 'iteration: ' + i + ' for id '+ x);
        return true;
      }
      if(i == this.state.liked.length - 1) {
        console.log('Reached false, end of loop');
        return false;
      }
 
    }
  }

  componentWillMount() {
    this.logPlants();
    this.getCurrentLikes();
  }

  componentDidMount() {
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

    const plants = this.state.plants.map((item, index) => {
      
      return (
          <div>
              <Row key={index} className="plant-box">
                <Col key={item.plant.id} md={12}>
                  <div className="plant-image">
                    {/* <img src="https://www.key2.com.au/wp-content/uploads/2019/02/indoor-rubber-plant.jpg" /> */}
                    <img src={item.plant.imgUser} />
                  </div>
                  <div className="plant-title">
                    <h5>Plant</h5>
                    <h3>{item.plant.body}</h3>
                    <h5>By: <a href="#">{item.plant.userHandle}</a></h5>
                  </div>
                  <div className="plant-soort">
                    <h5>Percentage</h5>
                    <h3>{item.plant.growthPercentage}%</h3>
                    <h5>Volgroeid</h5>
                  </div>
                  <div className="plant-comments">
                    <h5>View details</h5>
                    <div className="plant-comments-inner">
                      <button src="#">Details</button>
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
                    
                    {/* {this.state.liked.map(x  => {
                      this.isLiked(item.plant.id);
                      if(x == item.plant.id) {
                        return(
                          <i 
                            className="fa fa-heart"
                            onClick={() => this.toggle('unlike', item.plant.id)}
                          />
                        )           
                      }
                      else {
                        return(
                          <i 
                            className="fa fa-heart-o"
                            onClick={() => this.toggle('like', item.plant.id)}
                          />
                        )
                      }
                    })} */}
                      {/* {this.state.active && ( // Like
                        <i 
                          className="fa fa-heart-o"
                          onClick={() => this.toggle('like', item.plant.id)}
                        />
                      )}
                      {!this.state.active && ( // Dislike
                        <i 
                          className="fa fa-heart"
                          onClick={() => this.toggle('unlike', item.plant.id)}
                        />
                      )} */}
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
             {plants}
            </div>
          </div>
        </Grid>
      </div>
    );
  }
}

export default Feed;
