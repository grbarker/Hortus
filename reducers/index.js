import { combineReducers } from 'redux';
import auth from './auth.js';
import user from './user.js'
import posts from './posts.js';
import plants from './plants.js';
import followers from './followers.js';
import followed from './followed.js';
import userposts from './userposts.js';
import userplants from './userplants.js';
import wallPosts from './wallPosts.js';
import otherWallPosts from './otherWallPosts.js';
import locations from './locations.js';
import usergardens from './usergardens.js';
import map from './map.js';
import otherUserPlants from './otherUserPlants.js';
import otherUserGardens from './otherUserGardens.js';
import otherUserPosts from './otherUserPosts.js';
import otherUserFollowers from './otherUserFollowers.js';
import otherUserFollowed from './otherUserFollowed.js';
import { reducer as formReducer } from 'redux-form'

const rootReducer = combineReducers({
  auth, //<--Login
  user, //<--User
  posts, //<--Posts
  plants, //<--Plants
  followers, //<--Followers
  followed, //<--Followed
  userposts, //<--UserPosts
  userplants, //<--UserPlants
  wallPosts, //<--WallPosts
  otherWallPosts, //<--WallPosts
  locations, //<--Locations
  usergardens, //<-- UserGardens
  map, //<-- Map
  form: formReducer, //<--PlantForm
  otherUserPlants, //<--OtherUserPlants
  otherUserPosts, //<--OtherUserPosts
  otherUserGardens, //<--OtherUserGardens
  otherUserFollowers,
  otherUserFollowed,
});

export default rootReducer;
