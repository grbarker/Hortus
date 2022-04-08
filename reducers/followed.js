import {
  FETCH_FOLLOWED, FETCH_FOLLOWED_SUCCESS, FETCH_FOLLOWED_FAILURE,
  LESS_FOLLOWED, SHOW_FOLLOWED, HIDE_FOLLOWED,
  FETCH_MORE_FOLLOWED_SUCCESS, FETCH_MORE_FOLLOWED_FAILURE
} from '../actions/followed'

const INITIAL_STATE = {
  fetching: false,
  fetched: false,
  page: null,
  links: {},
  items: [],
  error: null,
  showingFollowed: false
}
export default function followed(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_FOLLOWED:
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    case FETCH_FOLLOWED_SUCCESS:
      return {
        fetching: false,
        fetched: true,
        page: action.payload._meta.page,
        links: action.payload._links,
        items: action.payload.items,
        error: null,
        showingFollowed: true
      };
    case FETCH_MORE_FOLLOWED_SUCCESS:
      return Object.assign({}, state, {
        fetching: false,
        fetched: true,
        page: action.payload._meta.page,
        links: action.payload._links,
        items: state.items.concat(action.payload.items),
        error: null
      });
    case FETCH_FOLLOWED_FAILURE:
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload
      };
    case FETCH_MORE_FOLLOWED_FAILURE:
      return Object.assign({}, state, {
        fetching: false,
        fetched: false,
        error: action.payload
      });
    case LESS_FOLLOWED:
      return {
        ...state,
        links: {
          next: "/api/user/followed?per_page=10&page=2",
          prev: null,
          self: "/api/user/followed?per_page=10&page=1",
        },
        items: state.items.splice(0, 10)
      };
    case SHOW_FOLLOWED:
      return {
        ...state,
        showingFollowed: true
      };
    case HIDE_FOLLOWED:
      return {
        ...state,
        showingFollowed: false
      };
    default :
      return state
  }
}
