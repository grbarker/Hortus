import {
  FETCH_USER, FETCH_USER_SUCCESS, FETCH_USER_FAILURE,
  FETCH_OTHER_USER, FETCH_OTHER_USER_SUCCESS, FETCH_OTHER_USER_FAILURE,
  SET_CURRENT_USER, SET_OTHER_USER, SET_USER, SET_USER_ID, GO_BACK_PROFILE,
  NO_BACK_PROFILE
} from '../actions/user'

const INITIAL_STATE = {
  fetching: false,
  fetched: false,
  user: {},
  error: null,
  showCurrentUser: false,
  otherUserBool: false,
  otherUserID: null,
  otherFetching: false,
  otherFetched: false,
  otherUser: {},
  otherError: null,
  usersList: [],
  usersIdList: [],
  goBack: false
}
export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        showCurrentUser: true,
        otherUserBool: false,
        otherFetched: false,
      };
    case SET_OTHER_USER:
      return {
        ...state,
        fetched: false,
        showCurrentUser: false,
        otherUserBool: true,
        otherUserID: action.payload,
      };
    case SET_USER:
      return {
        ...state,
        usersList: action.payload
      };
    case SET_USER_ID:
      return {
        ...state,
        usersIdList: action.payload
      };
    case GO_BACK_PROFILE:
      return {
        ...state,
        goBack: true
      };
    case NO_BACK_PROFILE:
      return {
        ...state,
        goBack: false
      };
    case FETCH_USER:
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        fetching: false,
        fetched: true,
        user: action.payload
      };
    case FETCH_USER_FAILURE:
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload.error
      };
    case FETCH_OTHER_USER:
      return {
        ...state,
        otherFetching: true,
        otherFetched: false,
      };
    case FETCH_OTHER_USER_SUCCESS:
      return {
        ...state,
        otherFetching: false,
        otherFetched: true,
        otherUser: action.payload
      };
    case FETCH_OTHER_USER_FAILURE:
      return {
        ...state,
        otherFetching: false,
        otherFetched: false,
        otherError: action.payload.error
      };
    default :
      return state
  }
}
