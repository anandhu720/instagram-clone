import React, { useState } from 'react';
import {StyleSheet,View,Button,TextInput,Text,Image,FlatList,TouchableOpacity} from 'react-native';

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
            <TextInput onChangeText={(search) => fetchUsers(search)} placeholder="Search" />

            <FlatList 
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem = {({item}) => (
                    <TouchableOpacity
                        onPress={()=>props.navigation.navigate("Profile" , {uid : item.id})}
                    >
                        <Text>{item.username}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    view: {
        flex: 1,
        marginTop:60,
    }
})