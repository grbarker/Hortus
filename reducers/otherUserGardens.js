import { FETCH_OTHER_USER_GARDENS, LESS_OTHER_USER_GARDENS, FETCH_OTHER_USER_GARDENS_SUCCESS,
  FETCH_OTHER_USER_GARDENS_FAILURE, FETCH_MORE_OTHER_USER_GARDENS_SUCCESS,
  FETCH_MORE_OTHER_USER_GARDENS_FAILURE, UPDATE_PICKER_CHOICE
} from '../actions/otherUserGardens'

const INITIAL_STATE = {
  fetching: false,
  fetched: false,
  page: null,
  links: {},
  items: [],
  gardenChoice: {},
  gardenSuccessfull: false,
  error: null,
}
export default function otherUserGardens(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_PICKER_CHOICE:
      return {
        ...state,
        gardenChoice: action.payload
      };
    case FETCH_OTHER_USER_GARDENS:
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    case FETCH_OTHER_USER_GARDENS_SUCCESS:
      return {
        fetching: false,
        fetched: true,
        page: action.payload._meta.page,
        links: action.payload._links,
        items: action.payload.items,
        gardenChoice: action.payload.items[0],
        error: null
      };
    case FETCH_MORE_OTHER_USER_GARDENS_SUCCESS:
      return Object.assign({}, state, {
        fetching: false,
        fetched: true,
        page: action.payload._meta.page,
        links: action.payload._links,
        items: state.items.concat(action.payload.items),
        error: null
      });
    case FETCH_OTHER_USER_GARDENS_FAILURE:
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload
      };
    case FETCH_MORE_OTHER_USER_GARDENS_FAILURE:
      return Object.assign({}, state, {
        fetching: false,
        fetched: false,
        error: action.payload
      });
    case LESS_OTHER_USER_GARDENS:
      return {
        ...state,
        links: {
          next: "/api/gardens?per_page=10&page=2",
          prev: null,
          self: "/api/gardens?per_page=10&page=1",
        },
        items: state.items.splice(0, 10)
      };
    default :
      return state
  }
}
