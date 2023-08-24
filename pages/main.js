import { View, Text, ViewComponent, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

export default function Main() {
    return (
        <View>
            <Text style={{ fontSize: 20, alignItems:'center', color:'gray'}}>Voice Recorder Application{"\n"}</Text>

            <View style={styles.container} >
                {/* <View style={styles.container} /> */}
                <Ionicons style={styles.mic} name="ios-mic-outline" size={150} color="gray" />
            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        
        width:230,
        height:230,
        borderRadius:1000,
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
    },

    mic: {

        paddingLeft:15,
        alignItems: 'center',
        justifyContent: 'center',

    },
});
