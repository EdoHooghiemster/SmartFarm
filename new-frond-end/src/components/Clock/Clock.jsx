import React, { Component } from "react";
import axios from 'axios';
import Button from "components/CustomButton/CustomButton.jsx";

class AlarmClock extends React.Component {
    constructor() {
      super();
      this.state = {
        currentTime: '',
        alarmTime: '',
        alarmTime2: '',
        nextAlarm: '',
        
      };
      this.setAlarmTime = this.setAlarmTime.bind(this);
      this.saveAlarm = this.saveAlarm.bind(this);
      this.saveAlarm2 = this.saveAlarm2.bind(this);
      this.setAlarmTime2 = this.setAlarmTime2.bind(this);

    }
  
    componentDidMount(){
      this.setState({
        nextAlarm: this.props.nextAlarm,

      })
      this.clock = setInterval(
        () => this.setCurrentTime(),
        1000
      )
      this.interval = setInterval(
        () => this.checkAlarmClock(),
      1000)
    }
  
    componentWillUnmount(){
      clearInterval(this.clock);
      clearInterval(this.interval);
    }
  
    setCurrentTime(){
      this.setState({
        currentTime: new Date().toLocaleTimeString('en-US', { hour12: false })
      });
    }
  
    setAlarmTime(event) {
      event.preventDefault();
      const inputAlarmTimeModified = event.target.value + ':00'
      this.setState({
        alarmTime: inputAlarmTimeModified
      })
    }
    
    setAlarmTime2(event) {
      event.preventDefault();
      const inputAlarmTimeModified = event.target.value + ':00'
      this.setState({
        alarmTime2: inputAlarmTimeModified
      })
    }
    saveAlarm(){
        const header = localStorage.getItem('jwt token')
        var lightsOff = this.state.alarmTime
        axios({
          method: 'post',
          url: `https://europe-west1-smartbroeikas.cloudfunctions.net/api/broeikas/timelightsoff/${this.props.id}`,
          headers: {Authorization:header},
          data: {
            lightsOff
          }
        })
        .then(result => {
          alert("succes")          
          this.setState({
              alarmTime : lightsOff
            })       
          }).catch(e => {
            alert("failed")
          })
    }

    saveAlarm2(){
      const header = localStorage.getItem('jwt token')
      var lightsOn = this.state.alarmTime2
      axios({
        method: 'post',
        url: `https://europe-west1-smartbroeikas.cloudfunctions.net/api/broeikas/timelightson/${this.props.id}`,
        headers: {Authorization:header},
        data: {
          lightsOn
        }
      })
      .then(result => {
        alert("succes")          
        this.setState({
            alarmTime2 : lightsOn
          })       
        }).catch(e => {
          alert("failed")
        })
      
      
  }

        checkAlarmClock(){

       
        if(this.state.currentTime === this.state.nextAlarm) {
          alert("its time!");
          axios({
            method: 'post',
            url: `https://europe-west1-smartbroeikas.cloudfunctions.net/api/broeikas/turnlightoff/${this.props.id}`,
          })
          .then(res => {
            alert(res)
          })
          .catch(e => {
            alert(e)
          })
        } else {
          console.log("not yet");
        }
        
    }
  
    render() {
      return (
        <div>
          <h4>
            Huidige tijd: {this.state.currentTime}
          </h4>
          <h4>
            Lampen gaan uit om: {this.props.lightOff}
          </h4>
          <h4>
            Lampen gaan aan om: {this.props.lightOn}
          </h4>
          <h4>{this.alarmMessage}
          </h4>
          <form onSubmit={this.saveAlarm}>
           <p>Tijd lichten uit: <input type="time" onChange={this.setAlarmTime}></input>
            <Button bsStyle="info" onClick={ ()=>{this.saveAlarm()}} fill type="submit">
              Opslaan
            </Button></p> 
          </form>
          <h4>{this.alarmMessage2}
          </h4>
          <form onSubmit={this.saveAlarm2}>
          <p> Tijd lichten aan: <input type="time" onChange={this.setAlarmTime2}></input>
            <Button bsStyle="info" onClick={ ()=>{this.saveAlarm2()}} fill type="submit">
              Opslaan
            </Button>
          </p> 
          </form>

        </div>
      );
    }
  }
  
export default AlarmClock