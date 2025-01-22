import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const handleSelectAndCropPhoto = async () => {
    setLoading(true);
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant access to your photo library.');
        setLoading(false);
        return;
      }

      // Open image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
      });

      if (!result.canceled) {
        const { uri } = result.assets[0];
        console.log(`[App] Selected image URI: ${uri}`);
        setSelectedImage(uri);

        // Open cropper
        const croppedResult = await ImageCropPicker.openCropper({
          path: uri, // Remove file:// prefix
          width: 1000,
          height: 1000,
          cropping: true,
          cropperCircleOverlay: false,
          avoidEmptySpaceAroundImage: true,
          compressImageQuality: 1,
          forceJpg: true,
        });

        console.log(`[App] Cropped image path: ${croppedResult.path}`);
        setCroppedImage(croppedResult.path);
      } else {
        console.log('[App] User canceled image picker.');
      }
    } catch (error) {
      console.error('[App] Error during selection or cropping:', error);
      Alert.alert('Error', 'Something went wrong while selecting or cropping the photo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Picker & Cropper Test</Text>
      <Button title="Select and Crop Photo" onPress={handleSelectAndCropPhoto} />
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      {selectedImage && <Text style={styles.info}>Selected Image: {selectedImage}</Text>}
      {croppedImage && <Text style={styles.info}>Cropped Image: {croppedImage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
});
