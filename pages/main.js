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
import { collection, addDoc, serverTimestamp, updateDoc,
  } from 'firebase/firestore';

export default function Main() {
    const [recording, setRecording] = useState()
    const [recordingList, setRecordingList] = useState([])
    const [recordingFile, setRecordingFile] = useState();


    //use effect to save audio
    useEffect(() => {

    }, [])


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



    //stop recording 

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
        setRecordingFile(updatedRecordings[0].file);
    };

    const getDurationFormatted = async (milliseconds) => {
        const minutes = milliseconds / 1000 / 60;
        const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
        return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`;
    };

    //get  usedr recording list
    async function getRecordingList() {
        return recordingList.map((recordingListLines, index) => {
            return (
                <View key={index} style={styles.rows}>
                    <Text style={styles.fill} >

                        Recordings # {index + 1} | {recordingListLines.duration}

                    </Text>

                    <Ionicons onPress={() => recordingListLines.sound.replayAsync()} name="ios-play" size={24} color="gray" />

                    <Ionicons style={{ alignItems: 'flex-end' }} onPress={() => deleteRecordingByIndex(index)} name="remove-circle-sharp" size={24} color="gray" />

                    {/* <Button hidden="true" color="gray" onPress={() => recordingListLines.sound.replayAsync()} title='Play'></Button> */}

                </View>

            )
        })

    }

    //clear function
    async function clear() {
        alert("You have deleted all your recordings")
        setRecording([])
    }

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
        stopRecording().then(() => {
            saveSoundAndUpdateDoc()
        })
    }


    const saveSoundAndUpdateDoc = async (writing, recordingList) => {
        // const user = auth.currentUser;
        // const path = `[audio]/${user.uid}/[recoring]`;
        const path = `[audio]/[recoring]/`;
        const blob = await new Promise((resolve, reject) => {
            const fetchXHR = new XMLHttpRequest();
            fetchXHR.onload = function () {
                resolve(fetchXHR.response);
            };
            fetchXHR.onerror = function (e) {
                reject(new TypeError('Network request failed'));
            };
            fetchXHR.responseType = 'blob';
            fetchXHR.open('GET', recordingList, true);
            fetchXHR.send(null);
        }).catch((err) => console.log(err));

        const recordRef = ref(database, path);

        await uploadBytes(recordRef, blob)
            .then(async (snapshot) => {
                const downloadURL = await getDownloadURL(recordRef).then((recordURL) => {
                    const addDocRef = collection(database, 'recordings');
                    addDoc(addDocRef, {
                        creator: user.uid,
                        recordURL,
                        creation: serverTimestamp(),
                    })
                        .then(() => { })
                        .then(() => resolve())
                        .catch((err) => console.log(err));
                });
                blob.close();
            })
            .catch((err) => console.log(err));
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

            <Button borderRadius="5" paddingBottom="5" color="#e55d85" title={recording ? 'Stop Recording' : 'Start  Recording '} onPress={recording ? Save : start} />

            {/* <Button paddingBottom="5" borderRadius="5" color="#e55d85" title={recording ? 'Clear recordings' : 'Clear recordings'} onPress={clear} />
             */}






            {/* <Button style={{ borderRadius: "5" }} color="#5FC3E4" title={recording > 0 ? '' : 'Clear Recordings'} onPress={clear} /> */}

            <ScrollView paddingTop="20" style={styles.contentContainer}>
                { 
                console.log(recordingList)
                // recordingList.map((value, index) => (
                //     <Text key={index}>{value}</Text>
                // ))}
                }

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
        marginLeft: 10,
        marginRight: 40,
        width: "100%"

    },

    fill: {

        flex: 1,
        margin: 15,
        // alignItems: 'flex-end',
        // justifyContent: 'center',


    },

    contentContainer: {
        paddingTop:5,
        paddingVertical: 0,
        // borderTopColor: "black",
        // borderTopWidth: 1,
        width: 300
    },


});
