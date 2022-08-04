import React, { Component, PropTypes } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native'
import ModalSelector from 'react-native-modal-selector'
import { white, black, gray, purple, green, blue, my_green, my_blue, pink, lightPurp, red, orange} from '../utils/colors'



const renderSelector = ({ input, data, garden, style, placeholder, label, type, meta: { touched, error, invalid, warning } }) => (
  <View className="text-input">
    <View>
      <ModalSelector
          data={data}
          keyExtractor= {item => item.id}
          labelExtractor= {item => item.name}
          supportedOrientations={['landscape', 'portrait']}
          accessible={true}
          scrollViewAccessibilityLabel={'Scrollable options'}
          cancelButtonAccessibilityLabel={'Cancel Button'}
          onChange={input.onChange}>
          <TextInput {...input}
              style={styles.input}
              editable={false}
              placeholder={placeholder}
              value={garden}/>

      </ModalSelector>
      {touched && ((error && <Text>{error}</Text>) || (warning && <Text>{warning}</Text>))}
    </View>
  </View>
)

export default renderSelector;


const styles = StyleSheet.create ({
   container: {
      padding: 5,
      marginTop: 3,
      backgroundColor: '#f0f4f0',
      alignItems: 'center',
   },
   errorContainer: {
     padding: 5,
     marginTop: 3,
     marginBottom: 30,
     backgroundColor: '#d9f9b1',
     alignItems: 'center',
   },
   input: {
     borderWidth:1,
     borderColor:'#ccc',
     backgroundColor: my_green,
     borderRadius: 8,
     margin: 5,
     padding:10,
     fontSize: 16,
     color: white,
     textAlign: 'center'

   },
})
