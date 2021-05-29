import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button ,Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';



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
      <Camera ref={ref => setCamera(ref)} style={styles.camera} type={type} ratio={'1:1'} />
    </View>
    <Button
        style={styles.button}
        title="Flip Camera"
        onPress={() => {
        setType(
            type === Camera.Constants.Type.back
            ? Camera.Constants.Type.front
            : Camera.Constants.Type.back
        );
        }}>
        <Text style={styles.text}> Flip </Text>
    </Button>
    <Button  title="Take Picture" onPress={() => takePicture()}/>
    <Button title="Pick an image from camera roll" onPress={pickImage} />  
    <Button  title="Save" onPress={() => navigation.navigate('Save' ,{image})}/> 
    {image && <Image source={{uri:image}} style={styles.takenImage} /> }
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
    }
}); 