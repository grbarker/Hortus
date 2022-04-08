import axios from 'axios';
//Get a location that may have multiple gardens(community garden)
export const FETCH_LOCATIONS = 'FETCH_LOCATIONS';
export const FETCH_LOCATIONS_SUCCESS = 'FETCH_LOCATIONS_SUCCESS';
export const FETCH_LOCATIONS_FAILURE = 'FETCH_LOCATIONS_FAILURE';
export const FETCH_OWN_LOCATION = 'FETCH_OWN_LOCATION';
export const FETCH_OWN_LOCATION_DENIED = 'FETCH_OWN_LOCATION_DENIED';

export function getLocations(dispatch, token, uri) {
  var uri = 'http://34.221.120.52' + uri
  return function (dispatch)  {
    console.log("Trying to DEBUG this get request for the next set of posts!!!", token, ", ", uri)
    axios.get(uri, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      dispatch(getLocationsSuccess(response.data)) && console.log(response.data)
    })
    .catch(error => {
       dispatch(getMoreLocationsFailure(error.response.data)) && console.log(error.response.data.error)
    })
    };
}

export function getLocationsSuccess(data) {
  return {
    type: FETCH_LOCATIONS_SUCCESS,
    payload: data
  };
}

export function getLocationsFailure(data) {
  return {
    type: FETCH_LOCATIONS_FAILURE,
    payload: data.error
  };
}

export function getOwnLocation(data) {
  return {
    type: FETCH_OWN_LOCATION,
    payload: data
  };
}


export function getOwnLocationDenied() {
  return {
    type: FETCH_OWN_LOCATION_DENIED,
  };
}
