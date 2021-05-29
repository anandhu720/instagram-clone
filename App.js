import { StatusBar } from 'expo-status-bar';
import React,{Component} from 'react';
import { StyleSheet,View,Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from "firebase";
import Icon from 'react-native-vector-icons/FontAwesome';

//connecting redux with react
import {Provider} from 'react-redux';
import { createStore , applyMiddleware } from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';

const store = createStore(rootReducer , applyMiddleware(thunk));


import RegisterPage from "./components/auth/Register";
import LoginPage from "./components/auth/Login";
import MainPage from "./components/Main";
import AddScreen from "./components/Main/Add";
import SaveScreen from "./components/Main/Save";
import CommentScreen from "./components/Main/Comment";


const Stack = createStackNavigator();

//making a react component

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "*****************",
  authDomain: "***************",
  projectId: "*********************",
  storageBucket: "*******************",
  messagingSenderId: "**************",
  appId: "********************",
  measurementId: "*****************"
};

//verifying we are not running any firebase instance at the moment
if(firebase.apps.length === 0){
  //initalizing firebase
  firebase.initializeApp(firebaseConfig)
}

export class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loaded:false,
    }

  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if(!user){
        this.setState({
          loggedIn:false,
          loaded:true
        })
      }else{
        this.setState({
          loggedIn:true,
          loaded:true
        })
      }
    })
  }

  render() {
    const {loggedIn, loaded} = this.state;
    if(!loaded){
      return(
        <View style={styles.view}>
          <Icon name="instagram" size={50} color="red" />
        </View>
      )
    }
    if(!loggedIn){
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing"   screenOptions={{ headerShown: false }} >
            <Stack.Screen name="Login" component={LoginPage} navigation={this.props.navigation}/>
            <Stack.Screen name="Register" component={RegisterPage}/>
            
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main" >
            <Stack.Screen name="Main" component={MainPage} options={{ headerShown: false }}/>
            <Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="Comment" component={CommentScreen} navigation={this.props.navigation}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
}
}

export default App;


const styles = StyleSheet.create({
  view: {
      flex: 1,
      justifyContent: 'center',
      width: '100%',
      left:'40%',
  },
});
