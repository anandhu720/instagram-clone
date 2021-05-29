import React,{useState,useEffect} from 'react'
import {StyleSheet,View,Button,TextInput,Text,Image,FlatList} from 'react-native';
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
        <View>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({item}) => (
                    <View>
                        {/* {console.log(item)} */}
                        {item.user != undefined && <Text>{item.user.username}</Text>}
                        <Text>{item.text}</Text>
                    </View>
                )}
            />


            <View>
                <TextInput placeholder="add comment"
                    onChangeText={(text) => setText(text)} 
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



