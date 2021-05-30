import React,{useState,useEffect} from 'react'
import {StyleSheet,View,Button,TextInput,Text,Image,FlatList,TouchableOpacity} from 'react-native';

import firebase from 'firebase';
require('firebase/firestore');
import {connect} from 'react-redux';

function Profile(props) {
    const [userPosts , setUserPosts] = useState([]);
    const [user,setUser] = useState(null);
    const [following, setFollowing] = useState(false);
    
    useEffect(() => {
        const {currentUser , posts} = props;

        if(props.route.params.uid === firebase.auth().currentUser.uid){
            setUser(currentUser);
            setUserPosts(posts);
        }else{
                firebase.firestore().collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if(snapshot.exists){
                        setUser(snapshot.data());
                    }else{
                        console.log('does not exist');
                    }
                })
                
                firebase.firestore().collection("posts")
                    .doc(props.route.params.uid)
                    .collection("userPosts")
                    .orderBy("creation", "asc")
                    .get()
                    .then((snapshot) => {
                        let posts = snapshot.docs.map(doc => {
                            const data = doc.data();
                            const id = doc.id;
                            return {id,...data}
                        })
                        setUserPosts(posts);
                    })

                if(props.following.indexOf(props.route.params.uid) > -1){
                    setFollowing(true);
                }else{
                    setFollowing(false);
                }
        }
    },[props.route.params.uid , props.following])


    const onFollow = () => {
        // setFollowing(true);
        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .set({})
    }

    const onUnFollow = () => {
        // setFollowing(false);
        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .delete()
    }

    const onLogOut = () => {
        firebase.auth().signOut();
    }


    if(user === null){
        return <View/>
    }
    // console.log(props.following);
    return (
        <View style={styles.view}>
            <View style={styles.infoContainer}>
                <Text>{user.username}</Text>
                <Text>{user.email}</Text>
                {props.route.params.uid === firebase.auth().currentUser.uid ? <Button title="log out" onPress={()=> onLogOut()} /> : null }
                {props.route.params.uid === firebase.auth().currentUser.uid ? <Text>{props.following.length}</Text> : null }
                {props.route.params.uid != firebase.auth().currentUser.uid && 
                    <View>
                        {following === true ? 
                        <Button title="following" 
                            onPress={() => onUnFollow()}
                        />    :
                        <Button title="follow" 
                            onPress={() => onFollow()}
                        />
                    }
                    </View>
                }
            </View>
            <View style={styles.photoContainer}>
                <FlatList 
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({item}) => (
                        <View style={styles.containerImage}>
                        {/* {console.log(userPosts)} */}
                        <TouchableOpacity
                                 onPress={()=>props.navigation.navigate("Feed" , {email : item.email})}
                        >
                        <Image 
                            style={styles.image}
                            source={{uri:item.downloadURL}}
                        />
                        </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        </View>
    )
}


const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following:store.userState.following,
})

Profile = connect(mapStateToProps,null)(Profile);

export default Profile;


const styles = StyleSheet.create({
    view: {
        flex: 1,
        marginTop:60
    },
    infoContainer:{
        margin:20,

    },
    image:{
        flex:1,
        aspectRatio:1/1,
        height:130
    },
    containerImage:{
        flex:1/3,
    }
})