import React, { useState } from 'react';
import {StyleSheet,View,Button,TextInput,Text,Image,FlatList,TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import firebase from 'firebase';
require('firebase/firestore');

export default function Search(props) {
    const [users,setUsers] = useState([]);

    const fetchUsers = (search) => {
        firebase.firestore()
            .collection("users")
            .where('name' , '>=' , search)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return {id,...data}
                });
                setUsers(users);
            })
    }


    return (
        <View style={styles.view}>
            <TextInput onChangeText={(search) => fetchUsers(search)} placeholder="Search" 
                style={styles.search}
            />

            <FlatList 
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem = {({item}) => (
                    <View style={styles.container}>
                        <MaterialCommunityIcons name="circle" size={25}/>
                        <TouchableOpacity
                        onPress={()=>props.navigation.navigate("Profile" , {uid : item.id})}
                        >
                            <Text style={styles.username}>{item.username}</Text>
                        </TouchableOpacity>
                    </View> 
                )}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    view: {
        flex: 1,
        marginTop:60,
    },
    search:{
        height:40,
        padding:10
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingBottom:20,
        paddingLeft:10,
        paddingRight:10,
        paddingTop:10,
     },
     username:{
         left:10,
         fontSize:20,
     },
})