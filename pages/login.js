import { ScrollView, View, Text, StyleSheet, TextInputComponent, Button, TouchableOpacity, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { TextInput } from 'react-native';


import { auth } from '../firebase/config';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


export default function Login({ navigation }) {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    // const navigation = useNavigation()


    const currentUser = async () => {

        const key = ' AIzaSyDucXCaTtcvkZZESEfWER38i-eR6mk1zFo'
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}`;


        const documentData = {
            email,
            password,
            returnSecureToken: true,
        }

        console.log(documentData);


        try {
            const response = await fetch(url, {

                headers: {
                    'Content-Type': "application"
                },

                method: "POST",
                body: JSON.stringify(documentData),
            });

            if (response) {
                // console.log('data ', data);
                return response.json();

            } else {
                console.log('Error,,,', response.statusText);
            }

        } catch (error) {
            console.error('Error:', error);
        }


    }





    const gotohomePage = (() => {

        currentUser().then((responseData) => {
            console.log('responseData', responseData);

            if (responseData.email ) {
                Alert.alert('Success', 'User Successfully Logged in successfully')
                navigation.navigate('main',{email: responseData.email})
            }
            else {

                Alert.alert("Invaild, Please Enter the Correct Email or Password")
            }

          
        })

        // signInWithEmailAndPassword(auth, email, password).then(() => {

        //     Alert.alert('Success', 'User Successfully Logged in successfully')
        //     // Alert.alert("Successfully Logged in")
        //     // setUP()
        //     navigation.navigate('main')


        // }).catch((error) => {

        //     Alert.alert("Error", 'User has entered imcorrect Password or email')

        //     document.getElementById('message').style.display = "block"
        //     document.getElementById('message').style.color = "red"
        //     document.getElementById('message').hidden = false

        // })

    })



    return (

        <View style={styles.container}>
            <View style={styles.topContainer} >
                <Text style={styles.appName} >Login Page</Text>
            </View>

            <View style={styles.bottomContainer}>
                <View style={styles.innerContainer} >

                    <View style={styles.inputContainer} >
                        {/* <Text id="message" hidden className="message">User entered the incorrect Username or Password! </Text> */}


                        <TextInput style={styles.TextInput} placeholder="E-mail" onChangeText={(value) => setEmail(value)} value={email} />
                        <TextInput secureTextEntry={true} autoCaplitalize='null' style={styles.TextInput} placeholder="Password" onChangeText={(value) => setPassword(value)} value={password} />

                        {/* onPress={(e)=>{e.gotohomePage()}  */}
                        <View style={styles.actionContainer} >
                            <TouchableOpacity onPress={gotohomePage} style={styles.actionButton} >

                                <Text style={styles.signIn} >
                                    Login</Text>


                            </TouchableOpacity  >

                            <View style={styles.actionSignButton}>

                                <Text style={styles.signUpAlready}>Don't have an account? </Text>
                                <TouchableOpacity mode='contained' onPress={() => navigation.navigate('signup')} style={{ marginLeft: 0 }} >
                                    <Text style={styles.signUp}  >Sign Up</Text>
                                </TouchableOpacity>

                            </View>
                        </View>

                    </View>


                </View>

            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingvertical: 80,
        backgroundColor: '#e2e2e2',
        alignItems: 'center',
        justifyContent: 'center',
    },

    topContainer: {
        flex: 1,
        // backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },

    appName: {
        // fontFamily: ' berskshire',
        fontSize: 40,
        color: '#e55d85',
        // alignItems: 'center',
        // justifyContent: 'center',
    },

    bottomContainer: {
        flex: 2,
        // backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        // height:200
    },

    innerContainer: {
        height: 350,
        width: 320,
        padding: 30,
        // flex: 1,
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },

    inputContainer: {
        // height:90,
        flex: 1,
        top: 20,
        // backgroundColor: "blue"
    },

    TextInput: {
        height: 45,
        width: 300,
        borderRadius: 20,
        borderWidth: 2,
        marginVertical: 10,
        padding: 10,
        borderColor: '#e55d85',


    },

    actionContainer: {
        height: 220,
        top: 10,
        // // backgroundColor: 'blue',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    actionButton: {
        // flex: 1,
        backgroundColor: '#e55d85',
        borderRadius: 20,
        height: 45,
        width: 300,
        paddingvertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: "center",
        // TextColor:'white'
    },
    actionSignButton: {
        flexDirection: 'row',
        // backgroundColor: '#e55d85',
        marginVertical: 10,
        borderRadius: 20,
        height: 45,
        width: 300,
        // paddingvertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: "center",
        // TextColor:'white'

    },

    signUp: {
        // flex: 1,
        // // backgroundColor: 'blue',
        textAlign: "center",
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: 19,
        color: '#e55d85',
        fontSize: 15,
        textDecorationLine: 'underline'
    },
    signUpAlready: {
        // flex: 1,
        // // backgroundColor: 'blue',
        textAlign: "center",
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: 19,
        color: 'black',
        fontSize: 15
    },
    signIn: {
        color: 'white',


    }

});
