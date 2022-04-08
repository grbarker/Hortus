import React, { Component, PropTypes } from 'react';


const renderTextArea = ({ input, label, type, meta: { touched, error, invalid, warning } }) => (
  <div className="text-input">
    <label  className="control-label">{label}</label>
    <div>
      <textarea {...input} className="form-control"  placeholder={label} type={type}/>
      {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
      </div>
    </div>
  </div>
)

export default renderField;
