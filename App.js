import * as React from 'react'
import { View, Platform, StatusBar} from 'react-native'
import { Provider } from 'react-redux'
import rootReducer from './reducers/index.js'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { my_green, white } from './utils/colors'
import { Constants } from 'expo-constants'
import Routes from './components/routes'

function UdaciStatusBar ({...props}) {
  return (
    <View style={{
      height: 20,
      backgroundColor: my_green
    }}>
      <StatusBar
        translucent={true}
        backgroundColor={my_green}
        barStyle={"light-content"}
        {...props}
      />
    </View>
  )
}
function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(
      thunk,
    ),
  );
  return createStore(rootReducer, initialState, enhancer);
}
const store = configureStore({});


export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <UdaciStatusBar />
          <NavigationContainer>
            <Routes />
          </NavigationContainer>
        </View>
      </Provider>
    )
  }
}
