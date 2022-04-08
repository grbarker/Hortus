import React, { Component } from 'react';
import { Button } from 'react-native'
import { MapView } from 'expo';
import { connect } from 'react-redux'
import { white } from '../utils/colors'

class Map extends Component {
  static navigationOptions = ({ navigation }) => {

    return {
      title: 'Home',
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
    gardens: [],
    coords: [],
    locations_for_markers: [],
    locationsReady: false,
  };

  componentDidMount() {
    this.fetchMarkerData();
  }

  async fetchMarkerData() {
    const { token } = this.props
    const { state } = this.state
    console.log(token);
    try {
      let response = await fetch(
        `http://@34.221.120.52/api/gardens/map`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let responseJSON = await response.json();
      //console.log("This is the response!!!!!", responseJSON )
      this.setState({
        isLoading: false,
        gardens: responseJSON.items
      })
    } catch (error) {
      console.error(error);
    }
    console.log("This is the state!!!!!", state)
  }

  containsObject = (coord, garden, index, altcoords, alt_locations_for_markers, nomatch) => {
    console.log(index, 'ALTCOORDS:', altcoords);
    if (index === 0) {
      altcoords = altcoords.concat([coord]);
      alt_location_for_markers = { coord: coord, address: garden.address, gardens: [garden.name] };
      alt_locations_for_markers = alt_locations_for_markers.concat([alt_location_for_markers]);
      console.log(index, 'Alt_coords:', altcoords);
      console.log(index, 'Alt_locations_for_markers:', alt_locations_for_markers);
      return {
        altcoords,
        alt_locations_for_markers
      }
    } else if (index > 0) {
      console.log(index, 'MADE IT TO HERE !!!!!!!!!!!!!!!!');
      console.log(index, 'ALTCOORDS:', altcoords);
      var i;
      for (i = 0; i < altcoords.length; i++) {
        console.log(altcoords[i]);
          console.log(garden.lat);
        if (altcoords[i].latitude === garden.lat) {
          console.log(index, "COORDS ARRAY INCLUDES coord !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
          console.log(alt_locations_for_markers[i].gardens.concat(garden.name))
          alt_locations_for_markers[i].gardens = alt_locations_for_markers[i].gardens.concat(garden.name)
          console.log(alt_locations_for_markers[i].gardens)
          return {
            altcoords,
            alt_locations_for_markers
          }
        } else {
          console.log(index, "COORDS DO NOT MATCH coord !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
          nomatch = true;
          console.log(nomatch);

        }
      }
      if (nomatch === true) {
        altcoords = altcoords.concat([coord]);
        alt_location_for_markers = { coord: coord, address: garden.address, gardens: [garden.name] };
        alt_locations_for_markers = alt_locations_for_markers.concat([alt_location_for_markers]);
        console.log(index, ', var i=', i);
        console.log(index, alt_locations_for_markers[i]);
        return {
          altcoords,
          alt_locations_for_markers
        }
      }
    }

  }


  render() {
    const { isLoading, gardens, coords, locations_for_markers } = this.state
    var altcoords = [];
    var alt_locations_for_markers = [];
    var nomatch = false;


    return (
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 45.487292,
          longitude: -122.635435,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
      {isLoading
        ? null
        : (gardens.map((garden, index) => {
            console.log(index, garden);
            console.log(index);
            const coord = { latitude: garden.lat, longitude: garden.lon};
            console.log(index, coord);
            var coords_locs = this.containsObject(coord, garden, index, altcoords, alt_locations_for_markers)
            console.log(index, 'coords_locs', coords_locs);
            console.log(index, 'coords_from_altcoords', coords_locs.altcoords);
            console.log(index, 'alt_locations_for_markers_from_altcoords', coords_locs.alt_locations_for_markers);
            altcoords = coords_locs.altcoords
            alt_locations_for_markers = coords_locs.alt_locations_for_markers
            console.log(index, '!!!!!!!________altcoords', altcoords);
            console.log(index, '!!!!!!!_________alt_locations_for_markers', alt_locations_for_markers);
          })
          && alt_locations_for_markers.map((location, index) => {
            const metadata = `Status: ${location.statusValue}`;
            console.log(location.coord);
            console.log(location.address);
            console.log(location.gardens);

            return (
              <MapView.Marker
                key={index}
                coordinate={location.coord}
                title={location.address}
                description={metadata}
              />
            );
          })
          )
      }
      </MapView>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
      token: state.auth.token
    };
}

export default connect(mapStateToProps)(Map);
