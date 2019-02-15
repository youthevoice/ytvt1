import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";

import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Button,
  PermissionsAndroid,
  Platform
} from "react-native";

import RNFetchBlob from "rn-fetch-blob";

var RNFS = require("react-native-fs");
import Icon from "react-native-vector-icons/Ionicons";

export default class PickFile extends Component {
  _pFile = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        ); // I used redux saga here. 'yield' keywoard. You don't have to use that. You can use async - await or Promises.

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          DocumentPicker.show(
            {
              filetype: [DocumentPickerUtil.video()]
            },
            (error, res) => {
              url = res.uri;

              RNFetchBlob.fs
                .stat(res.uri) // Relative path obtained from document picker
                .then(stats => {
                  console.log(stats);
                  var str1 = "file://";
                  var str2 = stats.path;
                  correctpath = str1.concat(str2);
                  console.log(
                    correctpath,
                    res.fileName,
                    res.fileName.replace(/(.*)\.(.*?)$/, "$1")
                  );
                  onlyfileName = res.fileName.replace(/(.*)\.(.*?)$/, "$1");
                  this.props.navigation.navigate("CVideo", {
                    correctpath: correctpath,
                    fileName: res.fileName,
                    onlyfileName: onlyfileName
                  });
                  // this._updateRNFB(correctpath, res.fileName, onlyfileName);
                })
                .catch(err => {
                  console.log(err);
                });

              // this._updateRNFB(realPath, res.fileName, onlyfileName);
            }
          );
        }
      } else {
        console.log("notttt  grantedddd");
      }
    } catch (e) {
      console.log(e);
    }
  };

  _updateRNFB = (realPath, fileName1, onlyfileName) => {
    console.log("upload started....");
    let task = RNFetchBlob.fetch(
      "POST",
      "https://youthevoice.com/postcomment",
      {
        "Content-Type": "application/octet-stream"
      },
      [
        {
          name: onlyfileName,

          filename: fileName1,

          // upload a file from asset is also possible in version >= 0.6.2
          data: RNFetchBlob.wrap(realPath)
        }
      ]
    )
      .uploadProgress({ interval: 1000 }, (loaded, total) => {
        console.log("progress " + Math.floor((loaded / total) * 100) + "%");
      })
      .then(res => {
        console.log(res.text());
      })
      .catch(err => {
        console.log(err);
      });
  };

  uploadFile = async () => {
    var uploadUrl = "https://youthevoice.com/postcomment"; // For testing purposes, go to http://requestb.in/ and create your own link
    // create an array of objects of the files you want to upload
    var files = [
      {
        name: "test",
        filename: "test.aac",
        filepath: RNFS.DocumentDirectoryPath + "/test.aac"
      }
    ];

    var uploadBegin = response => {
      var jobId = response.jobId;
      console.log("UPLOAD HAS BEGUN! JobId: " + jobId);
    };

    var uploadProgress = response => {
      var percentage = Math.floor(
        (response.totalBytesSent / response.totalBytesExpectedToSend) * 100
      );
      console.log("UPLOAD IS " + percentage + "% DONE!");
    };

    RNFS.uploadFiles({
      toUrl: uploadUrl,
      files: files,
      method: "POST",
      headers: {
        Accept: "application/json"
      },
      fields: {
        hello: "world"
      },
      begin: uploadBegin,
      progress: uploadProgress
    })
      .promise.then(response => {
        if (response.statusCode == 200) {
          console.log("FILES UPLOADED!"); // response.statusCode, response.headers, response.body
        } else {
          console.log("SERVER ERROR");
        }
      })
      .catch(err => {
        if (err.description === "cancelled") {
          // cancelled by user
        }
        console.log(err);
      });
  };

  render() {
    return (
      <Button onPress={this._pFile} title="Pick File..." color="#841584" />
    );
  }
}
