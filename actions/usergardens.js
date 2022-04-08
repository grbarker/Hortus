import axios from 'axios';

//Get category
export const FETCH_USER_GARDENS = 'FETCH_GARDENS';
export const FETCH_USER_GARDENS_SUCCESS = 'FETCH_GARDENS_SUCCESS';
export const FETCH_USER_GARDENS_FAILURE = 'FETCH_GARDENS_FAILURE';
export const FETCH_MORE_USER_GARDENS_SUCCESS = 'FETCH_MORE_GARDENS_SUCCESS';
export const FETCH_MORE_USER_GARDENS_FAILURE = 'FETCH_MORE_GARDENS_FAILURE';
export const LESS_USER_GARDENS = 'LESS_GARDENS';
export const SUBMIT_USER_GARDEN_SUCCESS = 'SUBMIT_USER_GARDEN_SUCCESS';
export const SUBMIT_USER_GARDEN_FAILURE = 'SUBMIT_USER_GARDEN_FAILURE';
export const UPDATE_PICKER_CHOICE = 'UPDATE_PICKER_CHOICE';
export const SHOW_GARDEN_INPUT = 'SHOW_GARDEN_INPUT';
export const HIDE_GARDEN_INPUT = 'HIDE_GARDEN_INPUT';

const api = "http://34.221.120.52/api/user/gardens"

export function getUserGardens(dispatch, token, uri_end) {
  var uri_end = uri_end
  var uri = 'http://34.221.120.52' + uri_end
  return function (dispatch)  {
    console.log("Trying to DEBUG this get request for the next set of gardens!!!", token, ", ", uri)
    axios.get(uri, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      (uri_end === '/api/user/gardens')
      ? (dispatch(getUserGardensSuccess(response.data)) && console.log('GETTING FIRST SET OF GARDENS AGAIN AFTER A GARDEN SUBMISSION'))
      : (dispatch(getMoreUserGardensSuccess(response.data)) && console.log('GETTING MORE GARDENS'))
    })
    .catch(error => {
       dispatch(getMoreUserGardensFailure(error.response.data)) && console.log(error.response.data.error)
    })
    };
}



export function submitUserGarden(dispatch, token, gardenName, gardenAddress) {
  var uri = 'http://34.221.120.52/api/user/garden'
  return function (dispatch)  {
    console.log("Trying to DEBUG this axios GARDEN request for submitting a user garden!!!", token, ", Garden Name:  ", gardenName, ", Garden Address", gardenAddress)
    axios({
      method: 'POST',
      url: uri,
      headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        "gardenName": gardenName,
        "gardenAddress": gardenAddress
      }
    })
    .then((response) => {
      dispatch(getUserGardens(dispatch, token, '/api/user/gardens'))
    })
    .catch(error => {
       dispatch(submitUserGardenFailure(error.response.status)) && console.log('ERROR ! ! !', error.response.status)
    })
    };
}

export function updatePicker(garden) {
  return {
    type: UPDATE_PICKER_CHOICE,
    payload: garden
  }
}

export function lessUserGardens() {
  return {
    type: LESS_USER_GARDENS,
  };
}

export function showGardenInput() {
  return {
    type: SHOW_GARDEN_INPUT,
  };
}

export function hideGardenInput() {
  return {
    type: HIDE_GARDEN_INPUT,
  };
}

export function getUserGardensSuccess(data) {
  return {
    type: FETCH_USER_GARDENS_SUCCESS,
    payload: data
  };
}

export function getUserGardensFailure(data) {
  return {
    type: FETCH_USER_GARDENS_FAILURE,
    payload: data.error
  };
}

export function getMoreUserGardensSuccess(data) {
  return {
    type: FETCH_MORE_USER_GARDENS_SUCCESS,
    payload: data
  };
}

export function getMoreUserGardensFailure(data) {
  return {
    type: FETCH_MORE_USER_GARDENS_FAILURE,
    payload: data.error
  };
}

export function submitUserGardenSuccess(data) {
  return {
    type: SUBMIT_USER_GARDEN_SUCCESS,
    payload: data
  };
}

export function submitUserGardenFailure(error_message) {
  return {
    type: SUBMIT_USER_GARDEN_FAILURE,
    payload: error_message
  };
}
