import React, { Component } from 'react'
import {StyleSheet,View,Button,TextInput,Text,Image} from "react-native";
import firebase from "firebase";

import instasignup from "../../assets/instalogin.png"


export class Register extends Component {

    constructor(props){  
        super(props);  

        this.state = {
            email:"",
            password:"",
            name:"",
            username:"",
        }

        this.onSignUp = this.onSignUp.bind(this);
    }

    onSignUp(){
        //grabbing the value of state
        const { email, password, name,username } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            firebase.firestore().collection("users")
                .doc(firebase.auth().currentUser.uid)
                .set({
                    name,
                    email,
                    username
                })
            console.log(userCredential);
        })
        .catch((error) => {
            console.log(error.message);
        });

    }

    render() {
        return (
            <View style={styles.view}>
                <Image source={instasignup} style={styles.loginimg} />
               <View ><TextInput style={styles.viewInput} placeholder="Full Name" onChangeText={(name)=>this.setState({name})}/></View>
               <View ><TextInput style={styles.viewInput} placeholder="User Name" onChangeText={(username)=>this.setState({username})}/></View>
               <View ><TextInput style={styles.viewInput} placeholder="Email Id" onChangeText={(email)=>this.setState({email})} /></View>
               <View ><TextInput style={styles.viewInput} placeholder="Password" secureTextEntry={true} onChangeText={(password)=>this.setState({password})} /></View>
               <View style={styles.viewButton}><Button onPress={()=> this.onSignUp()} title="Sign Up" /></View>
               <View style={styles.messg}>
               <Text style={styles.signupText}>Already have an account?<Text style={{color: 'blue'}} title="Login" onPress={()=> this.props.navigation.navigate('Login')}  >Sign In</Text></Text>
               </View>
            </View>
        )
    }
}

export default Register


const styles = StyleSheet.create({
    view: {
         flex: 1,
         justifyContent: 'center',
         width: '80%',
         padding:'10%',
         margin:'10%'
     },
     viewInput: {
         margin:'2%',
         borderBottomColor:"white",
         height:40,
         padding:5,
     },
     viewButton: {
         margin:"2%",
     },
     loginimg: {
        height:200,
        width:200,
        marginBottom:10,
        left:10,
    },
    messg:{
        marginTop:15,
    }
  });
  