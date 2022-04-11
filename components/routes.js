import * as React from 'react'
import { View, Platform, StatusBar} from 'react-native'
import { connect } from 'react-redux'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { my_green, white } from '../utils/colors'
import Login from './login'
import AuthLoadingScreen from './authLoadingScreen'
import Home from './home2'
import Map from './mapwithmarkers'
import Profile from './profile'
import Location from './location'
import AddressCheck from './addressCheck'



const Stack = createNativeStackNavigator();

const headerStyle = {
  options: {
    headerTintColor: white,
    headerStyle: {
      backgroundColor: my_green,
    }
  }
}




class Routes extends React.Component {
  render() {
    const { isLoggedIn, isLoading, dispatch } = this.props

    if (isLoading) {
      // We haven't finished checking for the token yet
      return <AuthLoadingScreen />;
    }


    return (
      <Stack.Navigator>
        {isLoggedIn
          ? (
            <>
              <Stack.Screen name="Home" component={Home} options={headerStyle} />
              <Stack.Screen name="Map" component={Map} options={headerStyle} />
              <Stack.Screen name="Profile" component={Profile} options={headerStyle} />
              <Stack.Screen name="Location" component={Location} options={headerStyle} />
              <Stack.Screen name="AddressCheck" component={AddressCheck} options={headerStyle} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} options={headerStyle} />
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
    };
}

export default connect(mapStateToProps)(Routes);
