import React, { Component } from 'react'
import {StyleSheet,View,Button,TextInput,Text,Image} from "react-native";
import firebase from "firebase";

import loginimg from "../../assets/instalogin.png"


export class Login extends Component {
    constructor(props){  
        super(props);  

        this.state = {
            email:"",
            password:"",
        }
        this.onSignUp = this.onSignIn.bind(this);
    }

    onSignIn(){
        //grabbing the value of state
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          console.log(userCredential);
          // ...
        })
        .catch((error) => {
          console.log(error);
          alert("Account didn't exist!!");
        });
    }

    render() {
        return (
            <View style={styles.view}>
                <Image source={loginimg} style={styles.loginimg} />
                    <View><TextInput style={styles.viewInput} placeholder="Email Id" onChangeText={(email)=>this.setState({email})} /></View>
                    <View><TextInput style={styles.viewInput} placeholder="Password" secureTextEntry={true} onChangeText={(password)=>this.setState({password})} /></View>
                    <View style={styles.viewButton}><Button onPress={()=> this.onSignIn()} title="Sign In" /></View>
                    <View style={styles.messg}>
                        <Text style={styles.signupText}>Don't have an account?<Text style={{color: 'blue'}} title="Register" onPress={()=> this.props.navigation.navigate('Register')}  >Sign Up</Text></Text>    
                    </View>
            </View>
        )
        }
}

export default Login;


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
         borderBottomColor:"black",
         height: 40,
         padding: 5,
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
  