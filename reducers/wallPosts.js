import { FETCH_WALL_POSTS, LESS_WALL_POSTS, FETCH_WALL_POSTS_SUCCESS, FETCH_WALL_POSTS_FAILURE,
  FETCH_MORE_WALL_POSTS_SUCCESS, FETCH_MORE_WALL_POSTS_FAILURE, SUBMIT_WALL_POST_SUCCESS,
  SUBMIT_WALL_POST_FAILURE, SHOW_WALL_POST_INPUT, HIDE_WALL_POST_INPUT, HIDE_REPLY_INPUT,
  SHOW_REPLY_INPUT
} from '../actions/wallPosts'

const INITIAL_STATE = {
  fetching: false,
  fetched: false,
  page: null,
  links: {},
  items: [],
  wallPostSuccessfull: false,
  error: null,
  showingWallPostInput: false,
  showingReplyInput: false,
  showingReplyInputNum: null,

}
export default function wallPosts(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SUBMIT_WALL_POST_SUCCESS:
      return {
        ...state,
        wallPostSuccessfull: true
      };
    case SUBMIT_WALL_POST_FAILURE:
      return {
        wallPostSuccessfull: false
      };
    case FETCH_WALL_POSTS:
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    case FETCH_WALL_POSTS_SUCCESS:
      return {
        fetching: false,
        fetched: true,
        page: action.payload._meta.page,
        links: action.payload._links,
        items: action.payload.items,
        error: null
      };
    case FETCH_MORE_WALL_POSTS_SUCCESS:
      return Object.assign({}, state, {
        fetching: false,
        fetched: true,
        page: action.payload._meta.page,
        links: action.payload._links,
        items: state.items.concat(action.payload.items),
        error: null
      });
    case FETCH_WALL_POSTS_FAILURE:
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload
      };
    case FETCH_MORE_WALL_POSTS_FAILURE:
      return Object.assign({}, state, {
        fetching: false,
        fetched: false,
        error: action.payload
      });
    case LESS_WALL_POSTS:
      return {
        ...state,
        links: {
          next: "/api/wall_posts?per_page=10&page=2",
          prev: null,
          self: "/api/wall_posts?per_page=10&page=1",
        },
        items: state.items.splice(0, 10)
      };
    case SHOW_WALL_POST_INPUT:
      return {
        ...state,
        showingWallPostInput: true
      };
    case HIDE_WALL_POST_INPUT:
      return {
        ...state,
        showingWallPostInput: false
      };
    case SHOW_REPLY_INPUT:
      return {
        ...state,
        showingReplyInput: true,
        showingReplyInputNum: action.payload
      };
    case HIDE_REPLY_INPUT:
      return {
        ...state,
        showingReplyInput: false,
        showingReplyInputNum: null
      };
    default :
      return state
  }
}
