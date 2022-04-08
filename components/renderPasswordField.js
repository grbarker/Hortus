import React, { Component, PropTypes } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native'
import { red, orange } from '../utils/colors'


const renderPasswordField = ({ input, label, type, placeholder, style, meta: { touched, error, invalid, warning } }) => (
  <View>
    <TextInput {...input}
        style={style}
        autoCapitalize='none'
        autoCorrect={false}
        autoFocus={false}
        keyboardType='default'
        placeholder={placeholder}
        secureTextEntry={true}
        value={input.value}
        onChangeText={input.onChange} />
      {touched && (
        (error && <Text style={{ fontSize: 20, color: red, }}>{error}</Text>) ||
        (warning && <Text style={{ fontSize: 20, color: orange }}>{warning}</Text>)
      )}
  </View>
)

export default renderPasswordField;
