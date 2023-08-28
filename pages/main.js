import { View, Text, ViewComponent, StyleSheet, Button } from 'react-native'
import { PermissionsAndroid, Platform } from 'react-native';
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import ReactNativeAsyncStorage from 'react-native-async-storage/src/storage';

export default function Main() {
    const [recording, setRecording] = useState()
    const [recordingList, setRecordingList] = useState([])
    const [list, setList] = useState()


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

                        Recordings #{index + 1} | {recordingListLines.duration}

                    </Text>

                    <Button onPress={() => recordingListLines.sound.replayAsync()} title='Play'></Button>

                </View>

            )
        })

    }


    //clear function
    async function clear() {
        alert("You have deleted all your recordings")
        setRecording([])
    }

    return (
        <View>
            <Text style={{ fontSize: 20, alignItems: 'center', color: 'gray' }}>Voice Recorder Application{"\n"}</Text>

            <View style={styles.container} >
                {/* <View style={styles.container} /> */}
                <Ionicons style={styles.mic} name="ios-mic-outline" size={150} color="gray" />



            </View>

            <Button title={recording ? 'Stop Recording' : 'Start Recording'} onPress={recording ? stopRecording : start} />



            <View>
                {Object.values(getRecordingList()).map((value, index) => (
                    <Text key={index}>{value}</Text>
                ))}
            </View>

            <Button title={recording > 0 ? '' : 'Clear Recordings'} onPress={clear} />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {

        width: 230,
        height: 230,
        borderRadius: 1000,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },

    mic: {

        paddingLeft: 15,
        alignItems: 'center',
        justifyContent: 'center',

    },

    rows: {
        flexDirection: 'row',
        // paddingLeft: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 40

    },

    fill: {

        flex: 1,
        margin: 15,
        // paddingLeft: 15,
        alignItems: 'center',
        justifyContent: 'center',

    },


});
