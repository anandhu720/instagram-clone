import React,{useState,useEffect} from 'react'
import {StyleSheet,View,Button,TextInput,Text,Image,FlatList,TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import firebase from 'firebase';
require('firebase/firestore');

import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {fetchUsersData} from "../../redux/actions/index";

function Comment(props) {
    const [comments,setComments] = useState([]);
    const [postId,setPostId] = useState('');
    const [text,setText] = useState('');

    useEffect(() => {

        function matchUserToComment(comments){
            for(let i=0;i<comments.length;i++){
                // if(comments[i].hasOwnProperty('user')){
                //     continue;
                // }

                const user = props.users.find(x => x.uid === comments[i].create);
                // console.log(user);
                if(user == undefined){
                    props.fetchUsersData(comments[i].create,false);
                }else{
                    comments[i].user = user;
                }
            }

            setComments(comments);
        }

        if(props.route.params.postId != postId) {
            firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .doc(props.route.params.postId)
                .collection("comments")
                .get()
                .then((snapshot) => {
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id , ...data};
                    })

                    matchUserToComment(comments);
                })
                setPostId(props.route.params.postId);
        }else{
            matchUserToComment(comments);
        }
    },[props.route.params.postId,props.users])

    const onCommentSend = () => {
        firebase.firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.postId)
        .collection("comments")
        .add({
            create: firebase.auth().currentUser.uid,
            text
        })  
    }

    // console.log(comments);


    return (
        <View style = {styles.view}>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({item}) => (
                    <View>
                        {/* {console.log(item)} */}
                        {item.user != undefined && 
                        <View style={styles.container1}>
                            <MaterialCommunityIcons name="circle" size={24}/>
                            <TouchableOpacity
                                onPress={()=>props.navigation.navigate("Profile" , {uid : item.user.uid})}
                            >
                            <Text style={styles.username}>{item.user.username}</Text>
                            </TouchableOpacity>
                        </View>}
                        <Text style={styles.userComment}>{item.text}</Text>
                        <View style={styles.container1}>
                            <MaterialCommunityIcons name="thumb-up-outline" size={12} style={styles.userLike}>Like</MaterialCommunityIcons>
                            <MaterialCommunityIcons name="thumb-down-outline" size={12} style={styles.userDisLike}>DisLike</MaterialCommunityIcons>
                        </View>
                    </View>
                )}
            />


            <View style = {styles.container}>
                <TextInput placeholder="add comment"
                    onChangeText={(text) => setText(text)} 
                    style={styles.commentTextBox}
                />
                <MaterialCommunityIcons name="send" size={26} onPress={() => onCommentSend()}/>
            </View>

        </View>
    )
}



const mapStateToProps = (store) => ({
    users: store.usersState.users
})

const mapDispatchToProps = (dispatch) => bindActionCreators({fetchUsersData} , dispatch);
Comment = connect(mapStateToProps ,mapDispatchToProps)(Comment);
export default Comment;


const styles = StyleSheet.create({
    view:{
        flex:1,
        justifyContent: 'center',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingBottom:20,
        paddingLeft:10,
        paddingRight:10
     },
     container1: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        padding:10
     },
     commentTextBox:{
        //  height:40
     },
     username:{
         fontSize:20,
         paddingLeft:10
     },
     userComment:{
         left:20,
         fontSize:16
     },
     userLike:{
         left:30,
         marginTop:10
     },
     userDisLike:{
        left:50,
        marginTop:10
    }
})
