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
    console.log(props);
    
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
                                <MaterialCommunityIcons name="heart-outline" size={26} />
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
    users:store.usersState.users,
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