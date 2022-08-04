import React, { Component } from 'react';
import { ScrollView, ListView, View, Text, TouchableOpacity, StyleSheet, Button, Dimensions, Alert } from 'react-native'
import MapView from 'react-native-maps';
import { Callout, Marker } from 'react-native-maps';
import { connect } from 'react-redux'
import { white, grey, my_green, my_blue, purple } from '../utils/colors'
import CalloutView from './marker_callout'
import { goToLocation, getLocationsSuccess, getLocationsFailure, getOwnLocation, getOwnLocationDenied } from '../actions/locations'
import { getAddresses, getAddressesSuccess, getAddressesFailure } from '../actions/map'
import { Constants, Permissions } from 'expo';
import * as Location from 'expo-location';
import axios from 'axios';

class Map extends Component {

  state = {
    isLoading: true,
    ownLocation: null,
    errorMessage: null,
    hybrid: false
  };

  alertMarkerInfo = (location) => {
   alert(location.address)
  }
  alertCalloutPress = () => {
   alert("Callout Has Been Pressed!!!")
  }
  alertMapPress = (event) => {
    console.log("This is the MapView press event:____________", event.nativeEvent)
   alert("The Map Has Been Pressed!!!")
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
    return axios({
      method: 'POST',
      url: `http://45.79.227.26/api/user/reverse_geocode`,
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
      console.log('RESPONSE     RESPONSE     RESPONSE', response.data.results)
      dispatch(getAddressesSuccess(response.data.results))
      this.props.navigation.navigate('AddressCheck');
      console.log('REDIRECT SUCCESSFULL REDIRECT SUCCESSFULL REDIRECT SUCCESSFULL')
    })
    .catch(error => {
      console.log('ERROR RESPONSE! ! !', error.response)
      //dispatch(getAddressesFailure(error.response.data.error))

    })
  }

  toLocation = (location) => {
    this.props.navigation.navigate('Location', {
      location: location
    });
  }

  _getLocationAsync = async () => {
    const { dispatch } = this.props
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      dispatch(getOwnLocationDenied())
    }
    let ownLocationObj = await Location.getCurrentPositionAsync({
      maximumAge: 60000, // only for Android
      accuracy: Platform.OS == "ios" ? Location.Accuracy.Lowest : Location.Accuracy.Low
    });
    console.log("____________Location from map component:____________", ownLocationObj);
    dispatch(getOwnLocation(ownLocationObj))
  };
  _getLocation = () => {
    const { dispatch, ownLocation } = this.props
    let { status } = Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      dispatch(getOwnLocationDenied())
    }
    if (ownLocation) {
      console.log('The current location of the phone is already in the store')
    } else {
      let ownLocationObj = Location.getCurrentPositionAsync({});
      console.log("Location:____________", ownLocationObj);
      dispatch(getOwnLocation(ownLocationObj))
    }
  };

  alterPhoneLocation = (ownLocation) => {
    const { coords } = this.state.ownLocation
    var newLat = coords.latitude + 0.92
    var newLng = coords.longitude + 1.17
  }

  async fetchMarkerData() {
    const { dispatch, token } = this.props
    const { ownLocation } = this.state
    //console.log(token);
    //console.log('ownLocation', ownLocation);
    //console.log('state', this.state);
    try {
      let response = await fetch(
        `http://@45.79.227.26/api/locations`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let responseJSON = await response.json({limit: '5mb'});
      console.log("This is the response!!!!!", responseJSON )
      dispatch(getLocationsSuccess(responseJSON))
    } catch (error) {
      console.error(error);
    }
  }

  mapMarkers = () => {
    const { locations } = this.props
    locations.map((location, index) => {
      if (index < 3) {
        const coord = { latitude: location.latitude, longitude: location.longitude };
        const metadata = `Status: ${location.statusValue}`;
        console.log("[][]][][][][][][][][][][][][][][][][][][][][]");
        console.log("Location Marker:____________", coord);

        return (
          <Marker
            key={index}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={location.address}
            image={require('../utils/img/rose64px.png')}
            onCalloutPress={() => {
              this.props.navigation.navigate('Location', { location })
              }
            }
          >
            <Callout style={{padding: 0 }}>
              <CalloutView location={location} />
            </Callout>
          </Marker>
        )
      }
    })
  }
  goToLocation = (location, index) => {
    const { dispatch } =this.props
    dispatch(goToLocation(location))
    this.props.navigation.navigate('Location', { index })
  }
  changeMapType = () => {
    this.setState({
      hybrid: !this.state.hybrid
    }, () => {
      console.log(this.state)
    })

  }

  componentDidMount() {
    const { locations, ownLocation } = this.props
    //const { placingGarden } = this.prop

    //console.log('this.props.navigation : ', this.props.navigation)
    //console.log('this.props.navigation.state.params: ', this.props.navigation.state.params)
    //console.log(placingGarden)
    this._getLocationAsync();
    console.log('Location from the redux store:', ownLocation)
    console.log(locations ? 'Locations loaded' : 'Locations not loaded')
    //this.fetchMarkerData();
    /*locations.map((location, index) => {
      index > 20 ? console.log(location) : null
      //console.log('Location index:____________', index)
      //console.log('Location address:____________', location.address)
    })*/

  }


  render() {
    const { fetched, locations, globalState, navigation, addresses, placingMap, ownLocation } = this.props
    const { hybrid } = this.state
    const loc = locations[0]

    return (
      <View>
        {((ownLocation !== undefined && ownLocation !== null))
          ? <MapView style={styles.map}
            initialRegion={{
              latitude: ownLocation ? ownLocation.coords.latitude : 46.483361,
              longitude: ownLocation ? ownLocation.coords.longitude : -123.624380,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            mapType={hybrid == false ? "standard" : "hybrid"}
            onPress={ (event) => placingMap == true? this.checkCoords(event) : null}
          >
          {(placingMap == true || placingMap == undefined)
            ? null
            : ((locations !== undefined && locations !== null)
                ? (locations.map((location, index) => {
                    const coord = { latitude: location.latitude, longitude: location.longitude };
                    const metadata = `Status: ${location.statusValue}`;
                    //console.log("[][]][][][][][][][][][][][][][][][][][][][][]");
                    //console.log("Location Marker:____________", coord);

                    return (
                      <Marker
                        key={index}
                        coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                        title={location.address}
                        image={require('../utils/img/rose64px.png')}
                        onCalloutPress={() => {this.goToLocation(location, index)}}
                      >
                        <Callout style={{padding: 0 }}>
                          <CalloutView location={location} />
                        </Callout>
                      </Marker>
                    )
                  }))
                : null
              )}
          </MapView>
          : null
        }
        <View style={styles.typeButton}>
          <Button
            onPress={this.changeMapType}
            title={hybrid == false ? "Hybrid" : "Standard"}
            color={white}
            accessibilityLabel="Change the map type"
            >
            {hybrid ? "hybrid" : "standard"}
            </Button>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
      token: state.auth.token,
      locations: state.locations.items,
      ownLocation: state.locations.ownLocation,
      globalState: state,
      addresses: state.map.addresses,
      placingMap: state.map.placingMap,
      mapType: state.map.mapType,
    };
}

export default connect(mapStateToProps)(Map);

const styles = StyleSheet.create ({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
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
 },
 typeButton: {
   position: "absolute",
   bottom: 75,
   right:15,
   height: 40,
   borderRadius: 10,
   backgroundColor: my_green,
   color: white
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
