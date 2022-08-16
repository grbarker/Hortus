import {
  FETCH_OTHER_USER_FOLLOWERS, LESS_OTHER_USER_FOLLOWERS, FETCH_OTHER_USER_FOLLOWERS_SUCCESS,
  FETCH_OTHER_USER_FOLLOWERS_FAILURE, FETCH_MORE_OTHER_USER_FOLLOWERS_SUCCESS,
  FETCH_MORE_OTHER_USER_FOLLOWERS_FAILURE
} from '../actions/otherUserFollowers'

const INITIAL_STATE = {
  fetching: false,
  fetched: false,
  page: null,
  links: {},
  initNextLink: null,
  initSelfLink: null,
  items: [],
  error: null,
}
export default function otherUserFollowers(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_OTHER_USER_FOLLOWERS:
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    case FETCH_OTHER_USER_FOLLOWERS_SUCCESS:
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
    case FETCH_MORE_OTHER_USER_FOLLOWERS_SUCCESS:
      return Object.assign({}, state, {
        fetching: false,
        fetched: true,
        page: action.payload._meta.page,
        links: action.payload._links,
        items: state.items.concat(action.payload.items),
        error: null
      });
    case FETCH_OTHER_USER_FOLLOWERS_FAILURE:
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload
      };
    case FETCH_MORE_OTHER_USER_FOLLOWERS_FAILURE:
      return Object.assign({}, state, {
        fetching: false,
        fetched: false,
        error: action.payload
      });
    case LESS_OTHER_USER_FOLLOWERS:
      return {
        ...state,
        links: {
          next: action.nextLink,
          prev: null,
          self: action.selfLink,
        },
        items: state.items.splice(0, 10)
      };
    default :
      return state
  }
}
