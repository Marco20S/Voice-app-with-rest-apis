import { ScrollView, View, Text, StyleSheet, TextInputComponent, Button, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'

import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, database } from '../firebase/config'
import { setDoc } from 'firebase/firestore'
import { useNavigation } from '@react-navigation/native'


export default function Signup({ navigation }) {

    const [email, setEmail] = useState()
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    // const navigation = useNavigation()



    //adding new users to firesbase
    const newUsers = async () => {

        const newUser = { email, username, password }
        try {
            // collection in firebase where user will be added
            const userRef = await setDoc(doc(database, 'Users', newUser.email), newUser)


            console.log('user reference id', userRef.id);

            //adding user data to firebase/firestore
            setEmail('');
            setUsername('');
            setPassword('')


        } catch (error) {
            console.log(error);

        }

    }

    const newUser = async () => {

        const key = ' AIzaSyDucXCaTtcvkZZESEfWER38i-eR6mk1zFo'
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${key}`;


        const documentData = {
            field: {

                email: { stringValue: email },
                username: { stringValue: username },
                password: { stringValue: password }

            }
        }

        try {
            const response = await fetch(url, {

                headers:{
                    'Content-Type':"application"
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


    }

    //register users to app

    const register = (e) => {
        // e.preventDefault()



        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                newUsers()
                Alert.alert('Success', 'User Registered successfully')
                navigation.navigate('login')

            }).catch((error) => {

                console.log(error.message)
                Alert.alert("Warning", "An Error occured when trying to add new user ")

            })
    }

    return (


        <View style={styles.container}>
            <View style={styles.topContainer} >
                <Text style={styles.appName} >Sign Up Page</Text>
            </View>

            <View style={styles.bottomContainer}>
                <View style={styles.innerContainer} >

                    <View style={styles.inputContainer} >
                        <TextInput style={styles.TextInput} placeholder="E-mail" value={email} onChangeText={(text) => setEmail(text)} />
                        <TextInput style={styles.TextInput} placeholder="Username" value={username} onChangeText={(value) => setUsername(value)} />
                        <TextInput style={styles.TextInput} secureTextEntry={true} value={password} placeholder="Password" onChangeText={(value) => setPassword(value)} />

                        {/* <Button/> */}
                        <View style={styles.actionContainer} >
                            <TouchableOpacity onPress={register} style={styles.actionButton} >

                                <Text style={styles.signIn} >
                                    Sign Up</Text>

                            </TouchableOpacity >
                        </View>

                        {/* <View style={styles.actionContainer} >
                            <TouchableOpacity style={styles.actionButton} >

                                <Text style={styles.signIn} >
                                    Login</Text>


                            </TouchableOpacity >
                        </View> */}

                        <View style={styles.actionSignButton}>

                            <Text color style={styles.signUpAlready}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => { navigation.navigate('login') }} style={{ marginLeft: 0 }} >
                                <Text style={styles.signUp} > Login</Text>
                            </TouchableOpacity>

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
        flex: 0.9,
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
        height: 380,
        width: 320,
        padding: 14,
        // flex: 1,
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },

    inputContainer: {
        // height:90,
        flex: 1,
        top: 10,
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
        height: 70,
        top: 10,
        // backgroundColor: 'blue',
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
        color: 'red',
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
        color: 'white'

    }


});
