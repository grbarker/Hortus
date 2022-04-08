import {
  FETCH_OTHER_USER_PLANTS, LESS_OTHER_USER_PLANTS, FETCH_OTHER_USER_PLANTS_SUCCESS,
  FETCH_OTHER_USER_PLANTS_FAILURE, FETCH_MORE_OTHER_USER_PLANTS_SUCCESS,
  FETCH_MORE_OTHER_USER_PLANTS_FAILURE
} from '../actions/otherUserPlants'

const INITIAL_STATE = {
  fetching: false,
  fetched: false,
  page: null,
  links: {},
  initNextLink: null,
  initSelfLink: null,
  items: [],
  error: null,
  showingPostInput: false
}
export default function otherUserPlants(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_OTHER_USER_PLANTS:
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    case FETCH_OTHER_USER_PLANTS_SUCCESS:
      return {
        ...state,
        fetching: false,
        fetched: true,
        page: action.payload._meta.page,
        links: action.payload._links,
        initNextLink: action.payload._links.next,
        initSelfLink: action.payload._links.self,
        items: action.payload.items,
        error: null
      };
    case FETCH_MORE_OTHER_USER_PLANTS_SUCCESS:
      return Object.assign({}, state, {
        fetching: false,
        fetched: true,
        page: action.payload._meta.page,
        links: action.payload._links,
        items: state.items.concat(action.payload.items),
        error: null
      });
    case FETCH_OTHER_USER_PLANTS_FAILURE:
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload
      };
    case FETCH_MORE_OTHER_USER_PLANTS_FAILURE:
      return Object.assign({}, state, {
        fetching: false,
        fetched: false,
        error: action.payload
      });
    case LESS_OTHER_USER_PLANTS:
      return {
        ...state,
        links: {
          next: state.initNextLink,
          prev: null,
          self: state.initSelfLink,
        },
        items: state.items.splice(0, 10)
      };
    default :
      return state
  }
}
