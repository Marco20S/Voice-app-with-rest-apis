import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from './firebase/config';
import { collection, doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';



import Main from './pages/main';
import Login from './pages/login';
import Signup from './pages/signup';


export default function App() {

  const Stack = createNativeStackNavigator();
  // const Stack = createStackNavigator();

  useEffect(() => {
    console.log("outside ===== OnAuth change")

    auth.onAuthStateChanged(async (username) => {

      if (username) {
        console.log("OnAuth change", username)

        // const emailRef = await getDoc(doc(database, 'admin', user.email))
        // const emailRef = doc(collection(database, 'admin', user.email))
        // const onSnapshot = await getDoc(emailRef)

        // console.log('Email Reference from firestore', emailRef.data());

        // if ( emailRef.exists()) {

        //   console.log('Document database',  emailRef.data());
        //   //setUP(EmailRef)

        //   // navigate('/')
        // }
        // else {
        //   //setUP()
        // }

        

        const docRef = doc(database, 'users', username.email);
        const docSnap = await getDoc(docRef);
        console.log(docRef.firestore.toJSON());

        if (docSnap.exists()) {
          const emailRef = docSnap.data();

          // do something with emailRef
          console.log('Document database', emailRef);
          // setUP(emailRef)


        } else {
          console.log("No such document exists!");

        }

      } else {
        // setUP(null)
      }

    })
  }, [])

  return (
    // <View style={styles.container}>

    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='login' component={Login} />
        <Stack.Screen name='signup' component={Signup} />
        <Stack.Screen name='main' component={Main} />
      </Stack.Navigator>
    </NavigationContainer>

    // {/* <Login/> */}
    // {/* <Signup/> */}
    // {/* <Main/> */}
    // {/* <Text>Open up App.js to start working on your app!</Text> */}
    // <StatusBar style="auto" />
    // </View>
  );
}

// export default () =>{

//   <NavigationContainer>
//     <App/>
//   </NavigationContainer>
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e2e2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
