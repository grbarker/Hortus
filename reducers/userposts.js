import { FETCH_USER_POSTS, LESS_USER_POSTS, FETCH_USER_POSTS_SUCCESS,
  FETCH_USER_POSTS_FAILURE, FETCH_MORE_USER_POSTS_SUCCESS,
  FETCH_MORE_USER_POSTS_FAILURE, SHOW_POST_INPUT, HIDE_POST_INPUT,
  SUBMIT_USER_POST_SUCCESS, SUBMIT_USER_POST_FAILURE
} from '../actions/userposts'

const INITIAL_STATE = {
  fetching: false,
  fetched: false,
  page: null,
  links: {},
  items: [],
  postSuccessfull: false,
  error: null,
  showingPostInput: false
}
export default function userposts(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SUBMIT_USER_POST_SUCCESS:
      return {
        ...state,
        postSuccessfull: true
      };
    case SUBMIT_USER_POST_FAILURE:
      return {
        postSuccessfull: false
      };
    case FETCH_USER_POSTS:
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    case FETCH_USER_POSTS_SUCCESS:
      return {
        fetching: false,
        fetched: true,
        page: action.payload._meta.page,
        links: action.payload._links,
        items: action.payload.items,
        error: null
      };
    case FETCH_MORE_USER_POSTS_SUCCESS:
      return Object.assign({}, state, {
        fetching: false,
        fetched: true,
        page: action.payload._meta.page,
        links: action.payload._links,
        items: state.items.concat(action.payload.items),
        error: null
      });
    case FETCH_USER_POSTS_FAILURE:
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload
      };
    case FETCH_MORE_USER_POSTS_FAILURE:
      return Object.assign({}, state, {
        fetching: false,
        fetched: false,
        error: action.payload
      });
    case LESS_USER_POSTS:
      return {
        ...state,
        links: {
          next: "/api/user/posts?per_page=10&page=2",
          prev: null,
          self: "/api/user/posts?per_page=10&page=1",
        },
        items: state.items.splice(0, 10)
      };
    case SHOW_POST_INPUT:
      return {
        ...state,
        showingPostInput: true
      };
    case HIDE_POST_INPUT:
      return {
        ...state,
        showingPostInput: false
      };
    default :
      return state
  }
}
