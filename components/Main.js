import React, { Component } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import FeedScreen from "./Main/Feed";
import ProfileScreen from "./Main/Profile";
import SearchScreen from "./Main/Search";

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return(null)
}

import firebase from "firebase";

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser,fetchUserPosts,fetchUserFollowing,clearData} from "../redux/actions/index";

export class Main extends Component {
    componentDidMount(){
        this.props.clearData();
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUserFollowing();
    }
    render() {
        return (
            <Tab.Navigator initialRouteName="Feed" labeled={false} barStyle={{ backgroundColor: 'white' }} activeColor="black">
                <Tab.Screen name="Feed" component={FeedScreen} 
                    options={{tabBarIcon : ({color,size}) => (
                        <MaterialCommunityIcons name="home" color={color} size={26} /> )
                }} />
                <Tab.Screen name="Search" component={SearchScreen}  navigation={this.props.navigation}
                    options={{tabBarIcon : ({color,size}) => (
                        <MaterialCommunityIcons name="magnify" color={color} size={26} /> )
                }} />
                <Tab.Screen name="New" component={EmptyScreen} 
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Add");
                        }
                    }) } 
                    options={{tabBarIcon : ({color,size}) => ( 
                        <MaterialCommunityIcons name="plus-box" color={color} size={26} /> )
                }} />
                <Tab.Screen name="Profile" component={ProfileScreen} 
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Profile",{uid: firebase.auth().currentUser.uid});
                        }
                    }) } 
                    options={{tabBarIcon : ({color,size}) => (
                        <MaterialCommunityIcons name="account-circle" color={color} size={26} /> )
                }} />
            </Tab.Navigator>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})

const mapDispatchToProps = (dispatch) => bindActionCreators({fetchUser,fetchUserPosts,fetchUserFollowing,clearData} , dispatch);
Main = connect(mapStateToProps ,mapDispatchToProps)(Main);
export default Main;



