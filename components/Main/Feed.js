import React,{useState,useEffect} from 'react'
import {StyleSheet,View,Button,TextInput,Text,Image,FlatList,TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import firebase from 'firebase';
require('firebase/firestore');
import {connect} from 'react-redux';



function Feed(props) {
    const [userPosts , setUserPosts] = useState([]);
    const [user,setUser] = useState(null);
    const [posts,setPosts] = useState([]);
    const [like,setLike] = useState("heart-outline");
    console.log(props);
    
    useEffect(() => {
         if(props.usersLoaded == props.following.length && props.following.length !== 0) {


            props.feed.sort((x,y) => {
                return x.creation - y.creation;
            })

            setPosts(props.feed);
        }


    },[props.usersLoaded,props.feed])

    // console.log(posts);

    const onLikePress = (userId,postId) => {
        setLike("heart");
        firebase.firestore().collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
    }

    const onDisLikePress = (userId,postId) => {
        setLike("heart-outline");
        firebase.firestore().collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
    }

    console.log(like);

    return (
        <View style={styles.view}>

            <View style = {styles.container}>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate("Add")}
                >
                    <MaterialCommunityIcons name='camera-outline' size={26} style = {styles.headerIconLeft}/>
                </TouchableOpacity>
                <Text style = {styles.header} >Instagram</Text>
                <MaterialCommunityIcons name='telegram' size={26} style = {styles.headerIconRight}/>
            </View>

            <View style={styles.photoContainer}>
                <FlatList 
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({item}) => (
                        <View style={styles.containerImage}>
                            <View style={styles.container1}>
                            <MaterialCommunityIcons name="circle" size={24}/>
                            <TouchableOpacity
                                 onPress={()=>props.navigation.navigate("Profile" , {uid : item.user.uid})}
                            >
                                <Text style={styles.username}>{item.user.username}</Text>
                            </TouchableOpacity>
                            </View>
                            <Image 
                                style={styles.image}
                                source={{uri:item.downloadURL}}
                            />
                            <View style={styles.container1}>
                                {item.currentUserLike ? <MaterialCommunityIcons name="heart" size={26} onPress={()=> onDisLikePress(item.user.uid,item.id)}/>
                                :<MaterialCommunityIcons name="heart-outline" size={26} onPress={()=> onLikePress(item.user.uid,item.id)}/>
                                }
                                <MaterialCommunityIcons name="comment-outline" style={{marginLeft:10}} size={26} onPress={()=> props.navigation.navigate("Comment",{postId : item.id,uid: item.user.uid})} />
                            </View>
                            <Text style={styles.caption}>{item.caption}</Text>
                            <TouchableOpacity onPress={()=> props.navigation.navigate("Comment",{postId : item.id,uid: item.user.uid})}><Text style={styles.caption}>view all comment</Text></TouchableOpacity>
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
    feed:store.usersState.feed,
    usersLoaded:store.usersState.usersLoaded,

})

Feed = connect(mapStateToProps,null)(Feed);

export default Feed;


const styles = StyleSheet.create({
    view: {
        flex: 1,
        marginTop:50,
        marginBottom:20
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
        marginBottom:20
    },
    username:{
        fontSize:20,
        fontWeight:'bold',
        marginLeft:10
    },
    logoHeading:{
        width:'100%'
    },
    logo:{
        fontSize:23,
        fontWeight:'bold',
        padding:5,
        left:10,
        marginBottom:5,
        marginTop:0,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingBottom:10
     },
     container1: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        padding:10
     },
     header: {
        // width: 100,
        fontSize:23,
        fontWeight:'bold',
     },
     headerIconLeft:{
         left:10
     },
     headerIconRight:{
         right:10,
         marginTop:0,
    },
    caption: {
        fontSize:15,
        left:10,
        right:10,
        marginBottom:5
    },

})