import {
  FETCH_PLANTS, LESS_PLANTS, FETCH_PLANTS_SUCCESS, FETCH_PLANTS_FAILURE,
  FETCH_MORE_PLANTS_SUCCESS, FETCH_MORE_PLANTS_FAILURE  } from '../actions/plants'

const INITIAL_STATE = {
  fetching: false,
  fetched: false,
  page: null,
  links: {},
  items: [],
  error: null
}
export default function plants(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PLANTS:
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    case FETCH_PLANTS_SUCCESS:
      return {
        fetching: false,
        fetched: true,
        page: action.payload._meta.page,
        links: action.payload._links,
        items: state.items.concat(action.payload.items),
        error: null
      };
    case FETCH_PLANTS_FAILURE:
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload
      };
    case FETCH_MORE_PLANTS_SUCCESS:
      return Object.assign({}, state, {
        fetching: false,
        fetched: true,
        page: action.payload._meta.page,
        links: action.payload._links,
        items: state.items.concat(action.payload.items),
        error: null
      });
    case FETCH_MORE_PLANTS_FAILURE:
      return Object.assign({}, state, {
        fetching: false,
        fetched: false,
        error: action.payload
      });
    case LESS_PLANTS:
      return {
        ...state,
        links: {
          next: "/api/plants?per_page=10&page=2",
          prev: null,
          self: "/api/plants?per_page=10&page=1",
        },
        items: state.items.splice(0, 10)
      };
    default :
      return state
  }
}
