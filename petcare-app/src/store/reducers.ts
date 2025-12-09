import { combineReducers } from 'redux';

// Example reducer for managing pet data
const petReducer = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_PETS_SUCCESS':
      return action.payload;
    case 'ADD_PET':
      return [...state, action.payload];
    case 'REMOVE_PET':
      return state.filter(pet => pet.id !== action.payload.id);
    default:
      return state;
  }
};

// Example reducer for managing user settings
const settingsReducer = (state = { theme: 'light' }, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    default:
      return state;
  }
};

// Combine all reducers
const rootReducer = combineReducers({
  pets: petReducer,
  settings: settingsReducer,
});

export default rootReducer;