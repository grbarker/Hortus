import axios from 'axios';

export const FETCH_USER_PLANTS = 'FETCH_USER_PLANTS';
export const FETCH_USER_PLANTS_SUCCESS = 'FETCH_USER_PLANTS_SUCCESS';
export const FETCH_USER_PLANTS_FAILURE = 'FETCH_USER_PLANTS_FAILURE';
export const FETCH_MORE_USER_PLANTS_SUCCESS = 'FETCH_MORE_USER_PLANTS_SUCCESS';
export const FETCH_MORE_USER_PLANTS_FAILURE = 'FETCH_MORE_USER_PLANTS_FAILURE';
export const LESS_USER_PLANTS = 'LESS_USER_PLANTS';
export const SHOW_PLANT_INPUT = 'SHOW_PLANT_INPUT';
export const HIDE_PLANT_INPUT = 'HIDE_PLANT_INPUT';
export const SUBMIT_USER_PLANT_SUCCESS = 'SUBMIT_USER_PLANT_SUCCESS';
export const SUBMIT_USER_PLANT_FAILURE = 'SUBMIT_USER_PLANT_FAILURE';

const api = "http://34.221.120.52/api/user/plants/"

export function getUserPlants(dispatch, token, uri_end) {
  var uri_end = uri_end
  var uri = 'http://34.221.120.52' + uri_end
  return function (dispatch)  {
    console.log("Trying to DEBUG this get request for the next set of plants!!!", token, ", ", uri)
    axios.get(uri, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      (uri_end === '/api/user/plants')
      ? dispatch(getUserPlantsSuccess(response.data)) && console.log(response.data, 'GETTING FIRST SET OF PLANTS AGAIN AFTER A PLANT SUBMISSION')
      : (dispatch(getMoreUserPlantsSuccess(response.data)) && console.log('GETTING MORE PLANTS'))
    })
    .catch(error => {
       dispatch(getMoreUserPlantsFailure(error)) && console.log(error)
    })
    };
}


export function submitUserPlant(dispatch, token, selectedGarden, gardenName, gardenID, plantText) {
  var uri = 'http://34.221.120.52/api/user/plant'
  return function (dispatch)  {
    console.log("Trying to DEBUG this axios POST request for submitting a user plant!!!", token, ", ", plantText)
    axios({
      method: 'post',
      url: uri,
      headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        "selectedGarden": selectedGarden,
        "gardenName": gardenName,
        "gardenID": gardenID,
        "plantName": plantText,
      }
    })
    .then((response) => {
      dispatch(getUserPlants(dispatch, token, '/api/user/plants'))
    })
    .catch(error => {
       dispatch(submitUserPlantFailure(error)) && console.log('ERROR ! ! !', error)
    })
    };
}


export function lessUserPlants() {
  return {
    type: LESS_USER_PLANTS,
  };
}

export function showPlantInput() {
  return {
    type: SHOW_PLANT_INPUT,
  };
}

export function hidePlantInput() {
  return {
    type: HIDE_PLANT_INPUT,
  };
}

export function getUserPlantsSuccess(data) {
  return {
    type: FETCH_USER_PLANTS_SUCCESS,
    payload: data
  };
}

export function getUserPlantsFailure(data) {
  return {
    type: FETCH_USER_PLANTS_FAILURE,
    payload: data.error
  };
}

export function getMoreUserPlantsSuccess(data) {
  return {
    type: FETCH_MORE_USER_PLANTS_SUCCESS,
    payload: data
  };
}

export function getMoreUserPlantsFailure(data) {
  return {
    type: FETCH_MORE_USER_PLANTS_FAILURE,
    payload: data.error
  };
}

export function submitUserPlantSuccess(data) {
  return {
    type: SUBMIT_USER_PLANT_SUCCESS,
    payload: data
  };
}

export function submitUserPlantFailure(data) {
  return {
    type: SUBMIT_USER_PLANT_FAILURE,
    payload: data.error
  };
}
