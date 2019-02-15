import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  NativeModules,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput
} from "react-native";

import Video from "react-native-video";

var ImagePicker = NativeModules.ImageCropPicker;

//import Share from "react-native-share";
import Share, { ShareSheet, Button } from "react-native-share";
import Fa5 from "react-native-vector-icons/FontAwesome5";
//import images from "./imageBase64";
import Icon from "react-native-vector-icons/Ionicons";
import { RectButton, BorderlessButton } from "react-native-gesture-handler";

var RNFS = require("react-native-fs");
import ProgressCircle from "react-native-progress-circle";
import RNFetchBlob from "rn-fetch-blob";
import { connect } from "react-redux";
import UUIDGenerator from "react-native-uuid-generator";

export default class ImagePick extends Component {
  constructor() {
    super();
    this.state = {
      image: null,
      images: null
    };
  }

  pickSingleWithCamera=()=> {
    ImagePicker.openCamera({
      cropping: true,
      width: 500,
      height: 500,
      includeExif: true,
      mediaType="photo"
    })
      .then(image => {
        console.log("received image", image);
        alert("Image Path", image.path);
        this.setState({
          image: {
            uri: image.path,
            width: image.width,
            height: image.height,
            mime: image.mime
          },
          images: null
        });
      })
      .catch(e => alert(e));
  }

  pickSingleBase64(cropit) {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: cropit,
      includeBase64: true,
      includeExif: true
    })
      .then(image => {
        console.log("received base64 image");
        this.setState({
          image: {
            uri: `data:${image.mime};base64,` + image.data,
            width: image.width,
            height: image.height
          },
          images: null
        });
      })
      .catch(e => alert(e));
  }

  cleanupImages() {
    ImagePicker.clean()
      .then(() => {
        console.log("removed tmp images from tmp directory");
      })
      .catch(e => {
        alert(e);
      });
  }

  cleanupSingleImage() {
    let image =
      this.state.image ||
      (this.state.images && this.state.images.length
        ? this.state.images[0]
        : null);
    console.log("will cleanup image", image);

    ImagePicker.cleanSingle(image ? image.uri : null)
      .then(() => {
        console.log(`removed tmp image ${image.uri} from tmp directory`);
      })
      .catch(e => {
        alert(e);
      });
  }

  cropLast() {
    if (!this.state.image) {
      return Alert.alert(
        "No image",
        "Before open cropping only, please select image"
      );
    }

    ImagePicker.openCropper({
      path: this.state.image.uri,
      width: 200,
      height: 200
    })
      .then(image => {
        console.log("received cropped image", image);
        this.setState({
          image: {
            uri: image.path,
            width: image.width,
            height: image.height,
            mime: image.mime
          },
          images: null
        });
      })
      .catch(e => {
        console.log(e);
        Alert.alert(e.message ? e.message : e);
      });
  }

  pickSingle(cropit, circular = false, mediaType) {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: cropit,
      cropperCircleOverlay: circular,
      compressImageMaxWidth: 400,
      compressImageMaxHeight: 400,
      compressImageQuality: 0.5,
      compressVideoPreset: "MediumQuality",
      includeExif: true
    })
      .then(image => {
        console.log("received image", image);
        this.setState({
          image: {
            uri: image.path,
            width: image.width,
            height: image.height,
            mime: image.mime
          },
          images: null
        });
      })
      .catch(e => {
        console.log(e);
        Alert.alert(e.message ? e.message : e);
      });
  }

  pickMultiple() {
    ImagePicker.openPicker({
      multiple: true,
      width: 720,
      cropping: true
    })
      .then(images => {
        this.setState({
          image: null,
          images: images.map(i => {
            console.log("received image", i);
            return {
              uri: i.path,
              width: i.width,
              height: i.height,
              mime: i.mime
            };
          })
        });
        console.log("imagesss areeee..", this.state);
      })
      .catch(e => alert(e));
  }

  scaledHeight(oldW, oldH, newW) {
    return (oldH / oldW) * newW;
  }

  AllComments = props => {
    const comments = props.comments;

    return (
      <View
        style={{
          backgroundColor: "#fff",
          elevation: 2
        }}
      >
        {comments.map(data => (
          <View
            style={{
              borderLeftWidth: 2,
              borderLeftColor: "red"
            }}
          >
            <Comment comment={data} />
          </View>
        ))}
      </View>
    );
  };

  renderVideo(video) {
    console.log("rendering video");
    return (
      <View style={{ height: 300, width: 300 }}>
        <Video
          source={{ uri: video.uri, type: video.mime }}
          style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
          rate={1}
          paused={false}
          volume={1}
          muted={false}
          resizeMode={"cover"}
          onError={e => console.log(e)}
          onLoad={load => console.log(load)}
          repeat={true}
        />
      </View>
    );
  }

  renderImage(image) {
    return (
      <Image
        style={{ width: 300, height: 300, resizeMode: "contain" }}
        source={image}
      />
    );
  }

  renderAsset(image) {
    if (image.mime && image.mime.toLowerCase().indexOf("video/") !== -1) {
      return this.renderVideo(image);
    }

    return this.renderImage(image);
  }

  _updateRNFB = async fileName => {
    //alert("Uoloaddddd");

    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        ); // I used redux saga here. 'yield' keywoard. You don't have to use that. You can use async - await or Promises.

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("upload started....");
          this.setState({ isUploading: true });
          console.log(
            this.state.audioPath,
            this.state.onlyFileName,
            this.state.fileName
          );
          task = RNFetchBlob.fetch(
            "POST",
            "https://youthevoice.com/postcomment",
            {
              "Content-Type": "application/octet-stream"
            },
            [
              {
                name: fileName,
                filename: fileName + ".mp4",

                // upload a file from asset is also possible in version >= 0.6.2
                data: RNFetchBlob.wrap(this.state.audioPath)
              }
            ]
          );
          this.setState({ task: task });

          task.uploadProgress({ interval: 1000 }, (loaded, total) => {
            this.setState({
              uploadStatus: Math.floor((loaded / total) * 100)
            });
            console.log("progress " + Math.floor((loaded / total) * 100) + "%");
          });

          task
            .then(res => {
              console.log("from resppooo", res.text());
              this.setState({
                uploadStatus: 100,
                isUploading: false
              });
            })
            .catch(err => {
              console.log("task erroroooooo", err);
            });
        }
      }
    } catch (e) {
      console.log("Cancellllll", e);
      this.setState({ task: "", isUploading: false });
    }
  };

  startUploadCancel = () => {
    Alert.alert(
      "Upload Cancel",
      "Do you want to cancel Upload...",
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("Cancel Pressed");
            return;
          },
          style: "cancel"
        },
        { text: "OK", onPress: () => this.uploadCancel() }
      ],
      { cancelable: false }
    );
  };
  uploadCancel = () => {
    this.state.task.cancel();
    this.setState({ uploadCancel: true, isUploading: false });
    console.log("from state", this.state.task);
    //console.log("from fun", err + taskid);
  };

  _submitTextAudio = (articleId, screenName) => async () => {
    _uuid = await UUIDGenerator.getRandomUUID();
    console.log(_uuid);

    axios
      .post("https://youthevoice.com/postTextAudioComment", {
        textComment: this.state.commentText,
        audioId: "Flintstone",
        userId: this.props.userId,
        articleId: _uuid,
        timeBeforeUpload: new Date(),
        audioUpload: "",
        timeAfterUpoad: ""
      })
      .then(function(response) {
        this._updateRNFB(_uuid);
        console.log(response);
      })
      .catch(function(error) {
        console.log("errrorrrr", error);
      });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#bf360c" />

        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="ios-arrow-round-back" color="#fff" size={30} />
              <Text style={styles.logo}>Back...</Text>
            </View>
          </TouchableOpacity>
          <View>
            <BorderlessButton
              onPress={() => this.props.navigation.toggleDrawer()}
            >
              <Icon name="ios-search" color="#ffffff" size={30} />
            </BorderlessButton>
          </View>
        </View>

        <View style={styles.MainContainer}>
          <TextInput
            style={styles.TextInputStyleClass}
            //underlineColorAndroid="transparent"
            placeholder={"Add Your Voice..."}
            placeholderTextColor={"#9E9E9E"}
            numberOfLines={10}
            multiline={true}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 20
            }}
          >
            <BorderlessButton>
              <Text> Submit Comment </Text>
            </BorderlessButton>
            <BorderlessButton>
              <Text style={{ paddingLeft: 10 }}> Cancel </Text>
            </BorderlessButton>
          </View>
        </View>

        <TouchableOpacity
          onPress={this.pickSingleWithCamera}
          style={styles.button}
        >
          <Text style={styles.text}>Select Multiple</Text>
        </TouchableOpacity>

        <ScrollView>
          {this.state.image ? this.renderAsset(this.state.image) : null}
          {this.state.images
            ? this.state.images.map(i => (
                <View key={i.uri}>{this.renderAsset(i)}</View>
              ))
            : null}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    backgroundColor: "blue",
    marginBottom: 10
  },
  text: {
    color: "white",
    fontSize: 20,
    textAlign: "center"
  },
  container: { flex: 1, backgroundColor: "#e3f2fd" },
  question: {
    padding: 10,
    fontSize: 20,
    fontWeight: "bold"
  },
  qoption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15
  },
  label: {
    fontSize: 16,
    fontWeight: "normal",
    marginBottom: 48
  },
  card: {
    backgroundColor: "#ffffff",
    elevation: 3,
    marginVertical: 2
  },
  cardseparator: {
    borderBottomColor: "#d1d0d4",
    borderBottomWidth: 1
  },
  cardHeader: {
    fontSize: 18,
    padding: 5,
    color: "#bf360c",
    fontWeight: "bold"
  },
  cardImage: {
    width: null,
    height: 100
  },
  cardText: {
    fontSize: 14,
    padding: 5
  },
  headerBar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#1b5e20",
    elevation: 3,
    paddingHorizontal: 15,

    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#9e9e9e",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 1,
    shadowOpacity: 1.0
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    paddingLeft: 5,
    letterSpacing: 2
  },
  bottomBarItem: {
    alignItems: "center",
    justifyContent: "center"
  },
  MainContainer: {
    paddingTop: Platform.OS === "ios" ? 20 : 0,
    justifyContent: "center",
    marginVertical: 20,
    marginHorizontal: 5
  },

  TextInputStyleClass: {
    textAlign: "center",
    height: 50,
    // borderWidth: 2,
    //borderColor: "#9E9E9E",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    height: 150
  }
});
