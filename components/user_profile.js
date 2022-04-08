import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Button, time } from 'react-native'
import Moment from 'react-moment';
import 'moment-timezone';
import TextButton from './TextButton'
import { MapView } from 'expo';
import { connect } from 'react-redux'
import { white } from '../utils/colors'
import { getUserPosts, getUserPostsSuccess, getUserPostsFailure } from '../actions/userposts'
import { getUserPlants, getUserPlantsSuccess, getUserPlantsFailure } from '../actions/userplants'

class Profile extends Component {
  static navigationOptions = ({ navigation }) => {

    return {
      title: 'Profile',
      headerRight: (
        <Button
          onPress={() => navigation.navigate('Auth')}
          title="Logout"
          color= {white}
        />
      )
    }
  }

  async componentDidMount() {
    const { dispatch, token } = this.props
    console.log(token);
    try {
      let response = await fetch(
        `http://@34.221.120.52/api/user/posts`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let responseJSON = await response.json();
      //console.log(responseJSON)
      dispatch(getUserPostsSuccess(responseJSON))
    } catch (error) {
      console.error(error);
    }
    try {
      let response = await fetch(
        `http://@34.221.120.52/api/user/plants`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let responseJSON = await response.json();
      //console.log(responseJSON)
      dispatch(getUserPlantsSuccess(responseJSON))
    } catch (error) {
      console.error(error);
    }
  }


  toMap = () => {
    this.props.navigation.navigate('Map');
  }


  toHome = () => {
    this.props.navigation.navigate('Home');
  }



  render() {
    const { post_items, plant_items, fetching, fetched_posts, fetched_plants } = this.props
    if (fetched_posts == true && fetched_plants == true) {
      return (
        <ScrollView>
          <View>
            <MapView
              style={{ flex: 5}}
              initialRegion={{
                latitude: 45.487292,
                longitude: -122.635435,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
          </View>
          <View style = {styles.postplantscontainer}>
            <View style = {styles.container}>
              <Text style = {styles.text}>Your Profile Page!</Text>
            </View>
            <TextButton style={{margin: 20}} onPress={this.toMap}>
              Map
            </TextButton>
            <View>
              {post_items.map((post_item, index) => (
                <View key = {post_item.id} style = {styles.container}>
                  <Text style = {styles.text}>Post:</Text>
                  <Text style = {styles.text}>{post_item.user}</Text>
                  <Text style = {styles.text}>{post_item.body}</Text>
                </View>
              ))}
            </View>
            <View>
              {plant_items.map((plant_item, index) => (
                <View key = {plant_item.id} style = {styles.container}>
                  <Text style = {styles.text}>Plant: {plant_item.name}</Text>
                  <Text style = {styles.text}>Grower: {plant_item.grower}</Text>
                  <Text style = {styles.text}>
                    Planted: <Moment element={Text} fromNow>{plant_item.timestamp}</Moment>
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )
    } else {
      return (
        <View>
          <Text>Hello broseph</Text>
        </View>
      )
    }
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
      fetched_posts: state.userposts.fetched,
      fetched_plants: state.userplants.fetched,
      post_items: state.userposts.items,
      plant_items: state.userplants.items,
      token: state.auth.token
    };
}


export default connect(mapStateToProps)(Profile);

const styles = StyleSheet.create ({
   container: {
      padding: 5,
      marginTop: 3,
      backgroundColor: '#d9f9b1',
      alignItems: 'center',
   },
   popupcontainer: {
      flex: 2,
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
