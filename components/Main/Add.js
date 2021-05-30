import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button ,Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';




export default function Add({navigation}) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');

    })();
  }, []);

  //takin picture function
  const takePicture = async () => {
      if(camera){
          const data = await camera.takePictureAsync(null);
          setImage(data.uri);
      }
  }

  // taking gallery picture function
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1,1],
      quality: 1,
    });

    // console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };



  if (hasCameraPermission === null || hasGalleryPermission === null) {
    return <View />;
  }
  if (hasGalleryPermission === false || hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
    <View style={styles.cameraContainer}>
    {image ? <Image source={{uri:image}} style={styles.takenImage} /> : <Camera ref={ref => setCamera(ref)} style={styles.camera} type={type} ratio={'1:1'} />}
    </View>
    <View style={styles.container1}>
    <MaterialCommunityIcons name="rotate-3d-variant"
        style={styles.button}
        size={30}
        title="Flip Camera"
        onPress={() => {
        setType(
            type === Camera.Constants.Type.back
            ? Camera.Constants.Type.front
            : Camera.Constants.Type.back
        );
        }}>
        <Text style={styles.text}> Flip </Text>
    </MaterialCommunityIcons>
    <MaterialCommunityIcons size={40} name="camera-retake-outline"  title="Take Picture" onPress={() => takePicture()}/>
    <MaterialCommunityIcons size={40} name="file-document-outline" title="Pick an image from camera roll" onPress={pickImage} />  
    <MaterialCommunityIcons size={40} name="post-outline"  title="Post" onPress={() => navigation.navigate('Save' ,{image})}/> 
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    cameraContainer:{
        flex:1,
        flexDirection:'row',
    },
    camera:{
        flex:1,
        aspectRatio:1,
    },
    takenImage:{
        flex:1,
        aspectRatio:1/1
    },
    container1: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingBottom:20,
      paddingLeft:10,
      paddingRight:10,
      paddingTop:10,
   },
}); 