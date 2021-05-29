import React,{useState,useEffect} from 'react'
import {StyleSheet,View,Button,TextInput,Text,Image,FlatList} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import firebase from 'firebase';
require('firebase/firestore');
import {connect} from 'react-redux';

function Feed(props) {
    const [userPosts , setUserPosts] = useState([]);
    const [user,setUser] = useState(null);
    const [posts,setPosts] = useState([]);
    
    useEffect(() => {
        let posts = [];
        if(props.usersLoaded == props.following.length) {
            for(let i=0;i<props.following.length;i++) {
                const user = props.users.find(el => el.uid === props.following[i]);
                if(user != undefined){
                    posts = [...posts, ...user.posts];
                }
            }

            posts.sort((x,y) => {
                return x.creation - y.creation;
            })

            setPosts(posts);
        }


    },[props.usersLoaded])

    // console.log(posts);


    return (
        <View style={styles.view}>
            <View style={styles.photoContainer}>
                <FlatList 
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({item}) => (
                        <View style={styles.containerImage}>
                            <Text style={styles.username}>{item.user.username}</Text>
                            <Image 
                                style={styles.image}
                                source={{uri:item.downloadURL}}
                            />
                            <View>
                                {/* <MaterialCommunityIcons name="heart" size={26} /> */}
                                <MaterialCommunityIcons name="comment" size={26} onPress={()=> props.navigation.navigate("Comment",{postId : item.id,uid: item.user.uid})} />
                            </View>
                            <Text>{item.caption}</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    )
}


const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following:store.userState.following,
    users:store.usersState.users,
    usersLoaded:store.usersState.usersLoaded,

})

Feed = connect(mapStateToProps,null)(Feed);

export default Feed;


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
        // aspectRatio:1/1,
        height:500
    },
    containerImage:{
        flex:1/3,
    },
    username:{
        fontSize:20
    }
})