import {
  FETCH_USER_PLANTS, LESS_USER_PLANTS, FETCH_USER_PLANTS_SUCCESS,
  FETCH_USER_PLANTS_FAILURE, FETCH_MORE_USER_PLANTS_SUCCESS,
  FETCH_MORE_USER_PLANTS_FAILURE, SUBMIT_USER_PLANT_SUCCESS,
  SUBMIT_USER_PLANT_FAILURE, SHOW_PLANT_INPUT, HIDE_PLANT_INPUT
} from '../actions/userplants'

const INITIAL_STATE = {
  fetching: false,
  fetched: false,
  page: null,
  links: {},
  items: [],
  error: null,
  showingPlantInput: false
}
export default function userplants(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SUBMIT_USER_PLANT_SUCCESS:
      return {
        ...state,
        plantSuccessfull: true
      };
    case SUBMIT_USER_PLANT_FAILURE:
      return {
        plantSuccessfull: false
      };
    case FETCH_USER_PLANTS:
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    case FETCH_USER_PLANTS_SUCCESS:
      return {
        fetching: false,
        fetched: true,
        page: action.payload._meta.page,
        links: action.payload._links,
        items: action.payload.items,
        error: null
      };
    case FETCH_MORE_USER_PLANTS_SUCCESS:
      return Object.assign({}, state, {
        fetching: false,
        fetched: true,
        page: action.payload._meta.page,
        links: action.payload._links,
        items: state.items.concat(action.payload.items),
        error: null
      });
    case FETCH_USER_PLANTS_FAILURE:
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload
      };
    case FETCH_MORE_USER_PLANTS_FAILURE:
      return Object.assign({}, state, {
        fetching: false,
        fetched: false,
        error: action.payload
      });
    case LESS_USER_PLANTS:
      return {
        ...state,
        links: {
          next: "/api/user/plants?per_page=10&page=2",
          prev: null,
          self: "/api/user/plants?per_page=10&page=1",
        },
        items: state.items.splice(0, 10)
      };
    case SHOW_PLANT_INPUT:
      return {
        ...state,
        showingPlantInput: true
      };
    case HIDE_PLANT_INPUT:
      return {
        ...state,
        showingPlantInput: false
      };
    default :
      return state
  }
}
