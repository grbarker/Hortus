import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Button, Platform } from 'react-native'
import TextButton from './TextButton'
import AlteredTextButton from './AlteredTextButton'
import Moment from 'react-moment';
import 'moment-timezone';
import { MapView } from 'expo';
import { connect } from 'react-redux'
import { white, black, gray, purple, green, blue, my_green, my_blue, pink, lightPurp, red, orange} from '../utils/colors'
import { submitUserPost, hidePostInput, showPostInput } from '../actions/posts'
import { setCurrentUser } from '../actions/user'
import Posts  from './posts'
import Plants from './plants'
import PostInput from './postInput'
import PostForm from './postForm'
import { Constants, Location, Permissions } from 'expo';
import { Ionicons } from '../node_modules/@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome'
import Icons from 'react-native-vector-icons/Ionicons'


class Home extends Component {


  static navigationOptions = ({ navigation }) => {

    return {
      title: 'Home',
      headerRight: (
        <Button
          onPress={() => navigation.navigate('Auth')}
          title="Logout"
          color= {white}
        />
      ),
      headerLeft: (
        <TouchableOpacity
          style={styles.newposticon}
          onPress={navigation.getParam('togglePostInput')}
        >
          <Ionicons name="ios-chatbubbles" size={26} color="white" />
        </TouchableOpacity >
      )
    }
  }

  state = {
    locationResult: null
  }

  componentDidMount() {
    this.props.navigation.setParams({ togglePostInput: this.togglePostInput });
  }

  togglePostInput = (e) => {
    const { dispatch, showingPostInput } = this.props
    showingPostInput
    ? dispatch(hidePostInput())
    : dispatch(showPostInput())
    e.preventDefault();
  }

  postSubmit = (values) => {
    const { dispatch, token} = this.props

    dispatch(submitUserPost(dispatch, token, values.post))
    // print the form values to the console
    console.log(values);
    }

  toMap = () => {
    this.props.navigation.navigate('Map',
      {placingGarden: false}
    );
  }

  toProfile = () => {
    const { dispatch } = this.props
    dispatch(setCurrentUser())
    this.props.navigation.navigate('Profile');
  }

  _getLocationAsync = async () => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    this.setState({
      locationResult: 'Permission to access location was denied',
    });
  }

  let location = await Location.getCurrentPositionAsync({});
  this.setState({
    locationResult: JSON.stringify(location)
  });
  alert(this.state.locationResult)
  };


  render() {
    const { showingPostInput, navigation } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.iconButtonsContainer}>
          {Platform.OS === 'ios'
          ? <Icons.Button
              name="ios-map"
              color={my_green}
              backgroundColor="#f0f4f0"
              onPress={this.toMap}
            >
              Map
            </Icons.Button>
          : <Icons.Button
              name="md-map"
              color={my_green}
              borderWidth="3"
              borderRadius="3"
              borderColor={my_green}
              backgroundColor="#f0f4f0"
              onPress={this.toMap}
            >
              Map
            </Icons.Button>
          }
          {Platform.OS === 'ios'
          ? <Icon.Button
              name="user"
              color={my_green}
              backgroundColor="#f0f4f0"
              onPress={this.toProfile}
            >
              Profile
            </Icon.Button>
          : <Icon.Button
              name="user"
              color={my_green}
              backgroundColor="#f0f4f0"
              onPress={this.toProfile}
            >
              Profile
            </Icon.Button>
          }
          {Platform.OS === 'ios'
          ? <Icon.Button
            name="pencil"
            color={my_green}
            backgroundColor="#f0f4f0"
            onPress={this.togglePostInput}
            >
              Got something to say?
            </Icon.Button>
          : <Icon.Button
            name="pencil"
            color={my_green}
            backgroundColor="#f0f4f0"
            onPress={this.togglePostInput}
            >
              Got something to say?
            </Icon.Button>
        }
        </View>
        <ScrollView style={styles.scrollViewContainer}>
            <View>
            {showingPostInput
              ? <PostForm onSubmit={this.postSubmit}/>
              : null
            }
            </View>
          <View>
            <Plants navigation={navigation}/>
            <Posts />
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
      token: state.auth.token,
      showingPostInput: state.posts.showingPostInput,
    };
}


export default connect(mapStateToProps)(Home);

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 5,
    marginTop: 3,
    backgroundColor: '#f0f4f0',
    alignItems: 'center',
   },
  scrollViewContainer: {
      width: '100%'
    },
  iconButtonsContainer: {
     maxHeight: 50,
     width: '100%',
     flex: 1,
     flexDirection: 'row',
     justifyContent: 'space-evenly',
     borderBottomWidth: 3,
     borderColor: my_green,
   },
  myGreenTextButton: {
     margin: 5,
     padding: 5,
     borderColor: my_green,
     borderWidth: 2,
     borderRadius: 5
   },
  newposticon: {
     marginLeft: 10,
   },
  profileText: {
     fontSize: 24,
     color: my_green
   },
  text: {
     fontSize: 20,
      color: black
   }
})
