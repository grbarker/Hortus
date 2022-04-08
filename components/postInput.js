import React, { Component } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native'
import TextButton from './TextButton'
import Moment from 'react-moment';
import 'moment-timezone';
import { connect } from 'react-redux'
import { white, black, gray, purple, green, blue, my_green, my_blue, pink, lightPurp, red, orange} from '../utils/colors'
import { Constants, Location, Permissions } from 'expo';
import { getPosts, submitUserPost, submitUserPostFetch } from '../actions/posts'

class PostInput extends Component {
    constructor (props) {
        super(props);
        this.state = {
            postText: "",
            token: "",
            error: ""
        };
    }

    submitUserPost = (e) => {
      const { dispatch, token } = this.props
      const { postText } = this.state
      e.preventDefault();
      dispatch(submitUserPost(dispatch, token, postText));
      this.setState({
        postText: ""
      })
    }


  render() {
    return (
      <ScrollView>
        <TextInput
            style={styles.postInputField}
            placeholder='Whatcha got to say?'
            autoCapitalize='none'
            autoCorrect={false}
            autoFocus={false}
            keyboardType='email-address'
            value={this.state.postText}
            onChangeText={(text) => this.setState({ postText: text })} />
        <Button onPress={(e) => this.submitUserPost(e)} title="Submit"/>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
      token: state.auth.token
    };
}


export default connect(mapStateToProps)(PostInput);

const styles = StyleSheet.create ({
   container: {
      padding: 5,
      marginTop: 3,
      backgroundColor: '#f0f4f0',
      alignItems: 'center',
   },
   text: {
     fontSize: 20,
      color: black
   },
   postInputField: {
     margin: 5,
     padding: 5,
     backgroundColor: '#f0f4f0',
     borderWidth: 2,
     borderColor: my_green,

   }
})
