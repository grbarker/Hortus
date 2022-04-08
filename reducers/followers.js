import {
  FETCH_FOLLOWERS, FETCH_FOLLOWERS_SUCCESS, FETCH_FOLLOWERS_FAILURE,
  LESS_FOLLOWERS, SHOW_FOLLOWERS, HIDE_FOLLOWERS,
  FETCH_MORE_FOLLOWERS_SUCCESS, FETCH_MORE_FOLLOWERS_FAILURE
} from '../actions/followers'

const INITIAL_STATE = {
  fetching: false,
  fetched: false,
  page: null,
  links: {},
  items: [],
  error: null,
  showingFollowers: false
}
export default function followers(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_FOLLOWERS:
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    case FETCH_FOLLOWERS_SUCCESS:
      return {
        fetching: false,
        fetched: true,
        page: action.payload._meta.page,
        links: action.payload._links,
        items: action.payload.items,
        error: null,
        showingFollowers: true
      };
    case FETCH_MORE_FOLLOWERS_SUCCESS:
      return Object.assign({}, state, {
        fetching: false,
        fetched: true,
        page: action.payload._meta.page,
        links: action.payload._links,
        items: state.items.concat(action.payload.items),
        error: null
      });
    case FETCH_FOLLOWERS_FAILURE:
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload
      };
    case FETCH_MORE_FOLLOWERS_FAILURE:
      return Object.assign({}, state, {
        fetching: false,
        fetched: false,
        error: action.payload
      });
    case LESS_FOLLOWERS:
      return {
        ...state,
        links: {
          next: "/api/user/followers?per_page=10&page=2",
          prev: null,
          self: "/api/user/followers?per_page=10&page=1",
        },
        items: state.items.splice(0, 10)
      };
    case SHOW_FOLLOWERS:
      return {
        ...state,
        showingFollowers: true
      };
    case HIDE_FOLLOWERS:
      return {
        ...state,
        showingFollowers: false
      };
    default :
      return state
  }
}
