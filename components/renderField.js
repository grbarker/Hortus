import React, { Component, PropTypes } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native'
import { red, orange } from '../utils/colors'

const formStates = ['active', 'autofilled', 'asyncValidating', 'dirty', 'invalid', 'pristine',
    'submitting', 'touched', 'valid', 'visited'];

const renderField = ({ input, label, type, placeholder, multiline, numberOfLines, style, meta, meta: { visited, touched, error, invalid, warning, dirty, pristine } }) => (

  <View>
    <TextInput {...input}
        autoCapitalize='none'
        autoCorrect={false}
        autoFocus={false}
        keyboardType='default'
        placeholder={placeholder}
        multiline={true}
        numberOfLines={6}
        onLayout={() => {console.log('======== LAYOUT CHANGE ========')}}
        style={style}
        value={input.value}
        onChangeText={input.onChange}
        onBlur={input.onBlur}
        onFocus={input.onFocus} />
      {touched && (
        (error && <Text style={{ fontSize: 20, color: red, }}>{error}</Text>) ||
        (warning && <Text style={{ fontSize: 20, color: orange }}>{warning}</Text>)
      )}
  </View>
)

export default renderField;
