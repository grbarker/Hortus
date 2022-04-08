/*This is a first pass at getting the different locations into the store.
The data schema for the state(e.g. INITIAL_STATE) will change in the future
when the database schema is changed so it can serve the locations
itself which will increase speed. The schema should end up like the commented
 out section at the bottom of the file */
import {
  FETCH_LOCATIONS, FETCH_LOCATIONS_SUCCESS, FETCH_LOCATIONS_FAILURE,
  FETCH_OWN_LOCATION, FETCH_OWN_LOCATION_DENIED
} from '../actions/locations'

const INITIAL_STATE = {
  fetching: false,
  fetched: false,
  items: [],
  error: null,
  ownLocation: null
}
export default function locations(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_LOCATIONS:
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    case FETCH_LOCATIONS_SUCCESS:
      return {
        fetching: false,
        fetched: true,
        items: action.payload,
        error: null
      };
    case FETCH_LOCATIONS_FAILURE:
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload
      };
    case FETCH_OWN_LOCATION:
      return {
        ...state,
        ownLocation: action.payload
      };
    case FETCH_OWN_LOCATION_DENIED:
      return {
        ...state,
        ownLocation: null
      };
    default :
      return state
  }
}

/*
import { FETCH_LOCATIONS, LESS_LOCATIONS, FETCH_LOCATIONS_SUCCESS, FETCH_LOCATIONS_FAILURE } from '../actions/locations'

const INITIAL_STATE = {
 fetching: false,
 fetched: false,
 page: null,
 links: {},
 items: [],
 error: null
}
export default function locations(state = INITIAL_STATE, action) {
 switch (action.type) {
   case FETCH_LOCATIONS:
     return {
       ...state,
       fetching: true,
       fetched: false,
     };
   case FETCH_LOCATIONS_SUCCESS:
     return {
       fetching: false,
       fetched: true,
       page: action.payload._meta.page,
       links: action.payload._links,
       items: state.items.concat(action.payload.items),
       error: null
     };
   case FETCH_LOCATIONS_FAILURE:
     return {
       ...state,
       fetching: false,
       fetched: false,
       error: action.payload
     };
   case LESS_LOCATIONS:
     return {
       ...state,
       links: {
         next: "/api/locations?per_page=10&page=2",
         prev: null,
         self: "/api/locations?per_page=10&page=1",
       },
       items: state.items.splice(0, 10)
     };
   default :
     return state
 }
}
*/
