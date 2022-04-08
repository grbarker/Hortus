import React, { Component } from 'react';
import { ScrollView, ListView, View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native'
import { Callout } from 'react-native-maps';
import { MapView, Marker } from 'expo';
import { connect } from 'react-redux'
import { white, grey, my_green, my_blue, purple } from '../utils/colors'
import { LocationInfo } from './location_info'
import CalloutView from './marker_callout'
import { getLocationsSuccess, getLocationsFailure, getOwnLocation, getOwnLocationDenied } from '../actions/locations'
import { getAddresses, getAddressesSuccess, getAddressesFailure } from '../actions/map'
import { Constants, Location, Permissions } from 'expo';
import axios from 'axios';

class Map extends Component {
  static navigationOptions = ({ navigation }) => {

    return {
      title: 'Map',
      headerRight: (
        <Button
          onPress={() => navigation.navigate('Auth')}
          title="Logout"
          color= {white}
        />
      )
    }
  }
  state = {
    isLoading: true,
    ownLocation: null,
    errorMessage: null,
  };

  alertMarkerInfo = (location) => {
   alert(location.address)
  }
  alertCalloutPress = () => {
   alert("Callout Has Been Pressed!!!")
  }

  openInfoWindow = (location) => {
    this.setState({
     infoWindowOpen: true,
     selectedLocation: location
   })
  }
  closeInfoWindow = (event) => {
    const { infoWindowOpen } = this.state
    if (infoWindowOpen) {
      this.setState({
       infoWindowOpen: false,
       selectedLocation: null
     })
   } else {
     console.log(event.nativeEvent.coordinate)
   }
  }

  checkCoords = (event) => {
    const { navigation, dispatch, token } = this.props

    //console.log(event.nativeEvent.coordinate)
    //console.log(event.nativeEvent.coordinate.latitude)
    //console.log(event.nativeEvent.coordinate.longitude)
    return axios({
      method: 'POST',
      url: `http://34.221.120.52/api/user/reverse_geocode`,
      headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        "lat": event.nativeEvent.coordinate.latitude,
        "lon": event.nativeEvent.coordinate.longitude
      }
    })
    .then((response) => {
      //console.log('RESPONSE     RESPONSE     RESPONSE', response.data.results)
      dispatch(getAddressesSuccess(response.data.results))
      this.props.navigation.navigate('AddressCheck');
      //console.log('REDIRECT SUCCESSFULL REDIRECT SUCCESSFULL REDIRECT SUCCESSFULL')
    })
    .catch(error => {
      //console.log('ERROR RESPONSE! ! !', error.response)
      dispatch(getAddressesFailure(error.response.data.error))

    })
  }

  toLocation = (location) => {
    this.props.navigation.navigate('Location', {
      location: location
    });
  }

  _getLocationAsync = async () => {
    const { dispatch, ownLocation, globalState } = this.props
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      dispatch(getOwnLocationDenied())
    }
    let ownLocationObj = await Location.getCurrentPositionAsync({});
    dispatch(getOwnLocation(ownLocationObj))
    this.setState({ ownLocation: ownLocationObj });
  };
  _getLocation = () => {
    const { dispatch, ownLocation } = this.props
    let { status } = Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      dispatch(getOwnLocationDenied())
    }
    if (ownLocation) {
      console.log('The current location of the phone is already in the store')
    } else {
      let ownLocationObj = Location.getCurrentPositionAsync({});
      dispatch(getOwnLocation(ownLocationObj))
    }
  };

  alterPhoneLocation = (ownLocation) => {
    const { coords } = this.state.ownLocation
    var newLat = coords.latitude + 1
    var newLng = coords.longitude + 1
  }

  async fetchMarkerData() {
    const { dispatch, token } = this.props
    const { ownLocation } = this.state
    //console.log(token);
    //console.log('ownLocation', ownLocation);
    //console.log('state', this.state);
    try {
      let response = await fetch(
        `http://@34.221.120.52/api/locations`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let responseJSON = await response.json();
      //console.log("This is the response!!!!!", responseJSON )
      dispatch(getLocationsSuccess(responseJSON))
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {
    //const { placingGarden } = this.prop

    //console.log('this.props.navigation : ', this.props.navigation)
    //console.log('this.props.navigation.state.params: ', this.props.navigation.state.params)
    //console.log(placingGarden)
    this.fetchMarkerData();
    this._getLocationAsync();
  }


  render() {
    const { fetched, locations, globalState, navigation, addresses, placingMap } = this.props
    const { ownLocation } = this.state
    //console.log('Own Location In Render Function', ownLocation)
    /*{(ownLocation !== null)
      ? console.log('Coords: ', ownLocation.coords)
      : null
    } */
    //console.log(ownLocation.coords.longitude)
    //console.log('navigation.state.params in RENDER: ', navigation.state.params)
    //console.log('-- IS THIS THE PLACING MAP -- IS THIS THE PLACING MAP -- ',  placingMap)

    return (
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      {ownLocation
        ? <MapView style={{ flex: 5, justifyContent: 'flex-end' }}
              initialRegion={{
                latitude: ownLocation.coords.latitude,
                longitude: ownLocation.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={ (event) => this.checkCoords(event) }
            >
            {(placingMap == true || placingMap == undefined)
              ? null
              : (locations
                  ? (locations.map((location, index) => {
                      //console.log(index, location);
                      //console.log(index, ": INDEX");
                      const coord = { latitude: location.latitude, longitude: location.longitude };
                      const metadata = `Status: ${location.statusValue}`;
                      //console.log('coord: ', coord);
                      const gardens = location.gardens.toString();

                      return (
                        <MapView.Marker
                          key={index}
                          coordinate={coord}
                          title={location.address}
                          description={gardens}
                          image={require('../utils/img/rose64px.png')}
                          onCalloutPress={() => {
                            this.props.navigation.navigate('Location', { location })
                            }
                          }
                        >
                          <Callout style={{padding: 0, }}>
                            <CalloutView location={location} />
                          </Callout>
                        </MapView.Marker>
                      );
                    }))
                  : null
                )
            }
        </MapView>
        : null
      }
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
      token: state.auth.token,
      locations: state.locations.items,
      storeOwnLocation: state.locations.ownLocation,
      globalState: state,
      addresses: state.map.addresses,
      placingMap: state.map.placingMap,
    };
}

export default connect(mapStateToProps)(Map);

const styles = StyleSheet.create ({
   mapcontainer: {
      padding: 5,
      marginTop: 5,
      backgroundColor: '#d9f9b1',
      justifyContent: 'flex-end',
      alignItems: 'center',
   },
   popupcontainer: {
      flex: 3,
      padding: 2,
      marginTop: 1,
      backgroundColor: '#d9f9b1',
      justifyContent: 'space-evenly',
   },
   text: {
     fontSize: 20,
      color: '#4f603c'
   }
})

/*An attempt at a pop up window/infowidow. Got it function, but when the marker
was pressed, the map would jump and changed zoom I believe. Was a very jarring
experience. Ended up going with the CalloutView component built into the react
native maps.

{infoWindowOpen
? <View style = {styles.popupcontainer}>
    <Text style={{fontSize: 16, color: 'grey'}}>{selectedLocation.address}</Text>
    <Text style={{fontSize: 16, color: 'grey'}}>---------------------------------</Text>
    <View style={{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
    }}>
      <View>
        <Text style={{fontSize: 18, color: 'grey'}}>{selectedLocation.gardens.length + ' gardens'}</Text>
        {selectedLocation.gardens.map((garden, index) => {
          return (
            <Text key={index} style={{fontSize: 16, color: 'grey'}}>{garden}</Text>
          )
        })}
      </View>
      <View>
        <Text style={{fontSize: 18, color: 'grey'}}>{selectedLocation.plants.length + ' plants'}</Text>
        {selectedLocation.plants.map((plant, index) => {
          return (
            <Text key={index} style={{fontSize: 16, color: 'grey'}}>{plant}</Text>
          )
        })}
      </View>
    </View>
  </View>
: null
}

*/
