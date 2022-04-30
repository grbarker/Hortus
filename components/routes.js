import * as React from 'react'
import { View, Platform, StatusBar, TouchableOpacity, StyleSheet, Button} from 'react-native'
import { connect } from 'react-redux'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { my_green, white, black } from '../utils/colors'
import Login from './login'
import AuthLoadingScreen from './authLoadingScreen'
import Home from './home2'
import Map from './mapConMarkers'
import Profile from './profile'
import Location from './location'
import AddressCheck from './addressCheck'
import {
  Ionicons, MaterialCommunityIcons, SimpleLineIcons,FontAwesome
} from '@expo/vector-icons';
import { hidePostInput, showPostInput } from '../actions/posts'
import { logout, setLogin, setSignUp } from '../actions/auth'



const Stack = createNativeStackNavigator();



class Routes extends React.Component {



  togglePostInput = (e) => {
    const { dispatch, showingPostInput } = this.props
    showingPostInput
    ? dispatch(hidePostInput())
    : dispatch(showPostInput())
    e.preventDefault();
  }


  render() {
    const { isLoggedIn, isLoading, dispatch, navigation, loginScreen } = this.props

    if (isLoading) {
      // We haven't finished checking for the token yet
      return <AuthLoadingScreen />;
    }


    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: my_green,
          },
          headerTintColor: '#fff',
          headerRight: () => (
            <Button
            onPress={() => dispatch(logout())}
            title="Logout"
            color= {white}
            />
          )
        }}
      >
        {isLoggedIn
          ? (
            <>
              <Stack.Screen
                name="Home"
                component={Home}
                options={{
                  title: "Home",
                  headerLeft: () => (
                    <TouchableOpacity
                      style={styles.newposticon}
                      onPress={this.togglePostInput}
                    >
                      <Ionicons name="ios-chatbubbles" size={26} color={white} />
                    </TouchableOpacity >
                  )
                }}
              />
              <Stack.Screen
                name="Map"
                component={Map}
                options={{ title: 'Map' }}
              />
              <Stack.Screen
                name="Profile"
                component={Profile}
                options={{
                  title: 'Profile',
                }}
              />
              <Stack.Screen
                name="Location"
                component={Location}
                options={{ title: 'Location' }}
              />
              <Stack.Screen
                name="AddressCheck"
                component={AddressCheck}
                options={{
                  title: 'Address Check',
                  headerLeft: () => (
                    <TouchableOpacity
                      style={styles.newposticon}
                      onPress={this.togglePostInput}
                    >
                      <Ionicons name="ios-chatbubbles" size={26} color={white} />
                    </TouchableOpacity >
                  )
                 }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name={loginScreen ? 'Log In' : 'Sign Up'}
                component={Login}
                options={{
                  title: loginScreen ? 'Log In' : 'Sign Up',
                  headerRight: () => (
                    <Button
                    onPress={() => loginScreen ? dispatch(setSignUp()) : dispatch(setLogin())}
                    title={loginScreen ? 'Sign Up' : 'Log In'}
                    color={white}
                    />
                  )
                 }}
              />
            </>
          )
        }
      </Stack.Navigator>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
    return {
      token: state.auth.token,
      isLoggedIn: state.auth.isLoggedIn,
      isLoading: state.auth.isLoading,
      showingPostInput: state.posts.showingPostInput,
      loginScreen: state.auth.loginScreen
    };
}

export default connect(mapStateToProps)(Routes);

const styles = StyleSheet.create ({
  newposticon: {
     marginLeft: 10,
   }
})
