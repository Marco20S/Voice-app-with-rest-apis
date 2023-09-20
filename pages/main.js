import { View, Text, ViewComponent, StyleSheet, Button, ScrollViewBase } from 'react-native'
import { PermissionsAndroid, Platform } from 'react-native';
import React, { useEffect, useState } from 'react'
// import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
// import ReactNativeAsyncStorage from 'react-native-async-storage/src/storage';

// import storage from 'react-native-async-storage';
import { database, storage } from '../firebase/config';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, updateDoc, } from 'firebase/firestore';

export default function Main() {
    const [recording, setRecording] = useState()
    const [recordingList, setRecordingList] = useState([])
    const [recordingFile, setRecordingFile] = useState([]);


    //use effect to save audio
    useEffect(() => {
        getAllRecordinglist()
    }, [])



    //apis for firebase

    //get user's recording list or single recording data --- read

    const getAllRecordinglist = async () => {

        const key = ' AIzaSyDucXCaTtcvkZZESEfWER38i-eR6mk1zFo'
        const url = `https://firestore.googleapis.com/v1/projects/voice-record-app-4ccfd/databases/(default)/documents/recordings/?key=${key}`;


        // const response = await fetch(url)
        // const data = response.json();

        // if (response.ok) {
        //     const doc = data.doc;
        //     console.log("all documents", doc);

        // } else {

        //     console.log('failed to get documents', error);
        // }


        await fetch(url).then(
            responses => responses.json()
        ).then(
            (json) => {
                // console.log(json.documents)
                const documents = json.documents

                let myRecordArray = []

                documents.forEach(doc => {
                    const idarray = doc.name.split('/')
                    // console.log(idarray[idarray.length - 1]);

                    const id = idarray[idarray.length - 1];

                    myRecordArray.push({
                        id: id,
                        ...doc.fields
                    })

                });


                console.log(" records ..........", myRecordArray);

                setRecordingFile(myRecordArray)

            }
        )
            .catch(
                error => console.log("error", error)
            );







    }


    const getRecord = async () => {

        const key = ' AIzaSyDucXCaTtcvkZZESEfWER38i-eR6mk1zFo'
        const url = `https://firestore.googleapis.com/v1/projects/voice-record-app-4ccfd/databases/(default)/documents/recordings/?key=${key}`;

        const response = await fetch(url, {
            method: "GET",
            // headers: {
            //   Authorization: `Bearer ${accessToken}`,
            // },
        });


        if (response.ok) {
            const data = response.json();
            console.log("Record retrieved Successfully", data);

        } else {

            console.log('Failed to get documents', error);
        }
    }

    const getList = () => {

        getAllRecordinglist()

    }


    //create record in firestore
    const createRecord = async () => {

        const url = `https://firestore.googleapis.com/v1/projects/voice-record-app-4ccfd/databases/(default)/documents/recordings/`;

        const recordTitle = `Recording${randomNumberInRange(1, 100)}`

        //data structure for firebase
        const documentData = {
            fields: {

                "recordTitle": { stringValue: recordTitle },
                "recordURL": { stringValue: "recordURL" },
                "creation": { stringValue: new Date().toDateString() },
            }


        };

        try {
            const response = await fetch(url, {

                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${accessToken}`,
                },
                method: "POST",
                body: JSON.stringify(documentData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('data ', data);
            } else {
                console.log('Error,,,', response.statusText);
            }

        } catch (error) {
            console.error('Error:', error);
        }

        // const response = await fetch(url, {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     //   Authorization: `Bearer ${accessToken}`,
        //     },
        //     body: JSON.stringify(documentData),
        // })
        // .then(
        //     response => response.json()
        // ).then(
        //     data => console.log('data ', data)

        // );

        // if (response.ok) {
        //     const addedData = await response.json();
        //     console.log("Document created successfully:", addedData);
        //   } else {
        //     const error = await response.text();
        //     console.error("Failed to create document:", error);
        //   }

        // const addedData = await response.json();
        // console.log("Document created successfully:", addedData);
    }

    // delete record

    const deleteRecord = async (id) => {

        // const documentId = "your-document-id";

        const url = `https://firestore.googleapis.com/v1/projects/voice-record-app-4ccfd/databases/(default)/documents/recordings/${id}`;

        const response = await fetch(url, {

            // headers: {
            //     Authorization: `Bearer ${accessToken}`,
            // },

            method: "DELETE",
        });

        if (response.ok) {
            console.log("Document deleted successfully");
        } else {
            const data = await response.json();
            console.error("Failed to delete document:", data.error);
        }


    }










    // start recording function
    async function start() {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    {
                        title: 'Microphone Permissions',
                        message: 'This app needs access to your microphone to record audio.',
                        buttonPositive: 'OK',
                        buttonNegative: 'Cancel',
                    }
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Microphone permission denied');
                    return;
                }
            }

            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const { recording } = await Audio.Recording.createAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );
            setRecording(recording);
        } catch (error) {
            console.error(error);
        }
    }



    //stop recording   --- create api

    const stopRecording = async () => {
        setRecording(undefined);

        await recording.stopAndUnloadAsync();
        let allRecordings = [...recordingList];
        const { sound, status } = await recording.createNewLoadedSoundAsync();

        allRecordings.push({
            sound: sound,
            duration: await getDurationFormatted(status.durationMillis),
            file: recording.getURI(),
        });

        setRecordingList(allRecordings);
        // setRecordingFile(updatedRecordings[1].file);


        const currentRecording = {
            sound: sound,
            duration: await getDurationFormatted(status.durationMillis),
            file: recording.getURI(),
        }

        saveSoundAndUpdateDoc(currentRecording)
    };


    //getting the duration of record 
    const getDurationFormatted = async (milliseconds) => {
        const minutes = milliseconds / 1000 / 60;
        const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
        return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`;
    };



    function getRecordingList() {
        console.log("test",recordingFile );
        return recordingFile.map((recordingListLines, index) => {
            return (
                    <View key={index} style={styles.rows}>
                   <Text style={styles.fill} >

                        Recordings # {index + 1} {recordingListLines.duration}

                         {/* get all records from firebase  */}
                        {recordingListLines.id} |  {recordingListLines.duration}

                        {/* {getList()
                        } */}


                    </Text>

                <Text style={{color:"black"}}>
                  {/* {recordingListLines.recordTitle.stringValue } */}
                  {/* {recordingListLines.recordURL.stringValue } */}
                </Text>

                <Ionicons onPress={() => recordingListLines.sound.replayAsync()} name="ios-play" size={24} color="gray" />

                    <Ionicons style={{ alignItems: 'flex-end' }} onPress={() => deleteRecord(recordingListLines.id)} name="remove-circle-sharp" size={24} color="gray" />

                {/* <Button hidden="true" color="gray" onPress={() => recordingListLines.sound.replayAsync()} title='Play'></Button> */}

            </View>

        )})
    }

    //clear function
    async function clear() {
        alert("You have deleted all your recordings")
        setRecording([])
    }

    //delete function  ---- delete api
    async function deleteRecordingByIndex(index) {
        // Assuming 'recordings' is an array containing the recordings
        // Check if the index is within the valid range

        console.log(index);
        let updatedRecordings = [...recordingList]
        if (index >= 0 && index < recordingList.length) {

            // Use the splice() method to remove the recording at the specified index

            updatedRecordings.splice(index, 1);
            console.log('Recording deleted successfully!');
        } else {
            console.log('Invalid index!');
        }

        setRecordingList(updatedRecordings)
    }

    const Save = () => {
        stopRecording()
        // .then(() => {
        //     saveSoundAndUpdateDoc()
        // })
    }


    const saveSoundAndUpdateDoc = async (currentRecording) => {
        // const user = auth.currentUser;
        // const path = `[audio]/${user.uid}/[recoring]`;

        console.log(currentRecording);


        const recordTitle = `Recording${randomNumberInRange(1, 100)}`
        const path = `[audio]/${recordTitle}`
        console.log(path);

        const blob = await new Promise((resolve, reject) => {
            const fetchXHR = new XMLHttpRequest();
            fetchXHR.onload = function () {
                resolve(fetchXHR.response);
            };
            fetchXHR.onerror = function (e) {
                reject(new TypeError('Network request failed'));
            };
            fetchXHR.responseType = 'blob';
            fetchXHR.open('GET', currentRecording.file, true);
            fetchXHR.send(null);
        }).catch((err) => console.log(err));

        const recordRef = ref(storage, path);

        let recordURL = ''

        // await uploadBytes(recordRef, blob)
        //     .then(() => {
        //         getDownloadURL(recordRef)
        //             .then(async (_recordURL) => {
        //                 console.log("line 184", _recordURL);
        //                 await addDoc(collection(database, 'recordings'), {
        //                     recordTitle: recordTitle,
        //                     recordURL: _recordURL,
        //                     creation: serverTimestamp(),
        //                 });
        //                 recordURL = _recordURL
        //             })
        //             .catch((err) => console.log(err));

        //         blob.close();
        //     })
        //     .catch((err) => console.log(err));



        createRecord();

    };

    const randomNumberInRange = (min, max) => {
        return Math.floor(Math.random()
            * (max - min + 1)) + min;
    };



    return (
        <View style={{ width: '100%', flex: 1, paddingTop: 60, paddingBottom: 40, alignItems: 'center', }}>

            <Text style={{ fontSize: 20, alignItems: 'center', color: 'black' }}>Voice Recorder Application</Text>

            <Text>{"\n"}</Text>

            <View style={styles.container} >
                {/* <View style={styles.container} /> */}

                {recording ? <Ionicons name="stop" paddingLeft={10} size={100} color="white" /> : <Ionicons style={styles.mic} name="ios-mic-outline" size={150} color="white" />}


            </View>
            <Text>{"\n"}</Text>

            <Button borderRadius="5" paddingBottom="5" color="#e55d85" title={recording ? 'Stop Recording' : 'Start  Recording '} onPress={recording ? stopRecording : start} />

            {/* <Button paddingBottom="5" borderRadius="5" color="#e55d85" title={recording ? 'Clear recordings' : 'Clear recordings'} onPress={clear} />
             */}






            {/* <Button style={{ borderRadius: "5" }} color="#5FC3E4" title={recording > 0 ? '' : 'Clear Recordings'} onPress={clear} /> */}

            <ScrollView paddingTop="20" style={styles.contentContainer}>
                {/* {Object.values(getRecordingList()).map((value, index) => (
                    <Text key={index}>{value}</Text>
                ))} */}
                {getRecordingList()}

            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {

        width: 230,
        height: 230,
        borderRadius: 1000,
        backgroundColor: '#e55d87',
        alignItems: 'center',
        justifyContent: 'center',
    },

    mic: {

        paddingLeft: 15,
        alignItems: 'center',
        justifyContent: 'center',

    },

    rows: {
        borderTopColor: 'white',
        width: 230,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // marginLeft: 0,
        // marginRight: 10,
        width: "100%"

    },

    fill: {

        flex: 1,
        margin: 15,
        // alignItems: 'flex-end',
        // justifyContent: 'center',


    },

    contentContainer: {
        paddingTop: 5,
        paddingVertical: 0,
        borderColor: "black",
        borderWidth: 1,
        width: "100%",
        paddingHorizontal: 15
    },


});
