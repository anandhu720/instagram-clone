import React,{useState} from 'react'
import { StyleSheet, TextInput, View, Button ,Image } from 'react-native';

import firebase from 'firebase';
require('firebase/firestore');
require('firebase/firebase-storage');

export default function Save(props,{navigation}) {
    const [caption,setCaption] = useState('');
    const image = props.route.params.image;

    const uploadImage = async () => {
        const uri = props.route.params.image;
        const response = await fetch(uri);
        const blob = await response.blob();
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
        const task = firebase.storage().ref().child(childPath).put(blob);
        console.log(childPath);

        const taskProgress = snapshot => {
            console.log(`transfered : ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
                // console.log(snapshot);
            })
        }


        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed" , taskProgress,taskError,taskCompleted);
    }

    const savePostData = (downloadURL) => {
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadURL,
                caption,
                creation : firebase.firestore.FieldValue.serverTimestamp()
            }).then((function() {
                props.navigation.popToTop();
            }))
    }

    return (
        <View style={styles.view}>
            <Image style={styles.image} source={{uri:image}} />
            <TextInput style={styles.textInput} 
                placeholder="captions ...." 
                onChangeText={(caption)=> setCaption(caption)}
            />
            <Button title="Save" 
                style={styles.button}
                onPress={() => uploadImage()}
            />
        </View>
    )
}



const styles = StyleSheet.create({
    view: {
         flex: 1,
     },
     image:{
        flex:1,
    },
    textInput:{
        margin:12,
    },
    button: {
    }
  });
  
