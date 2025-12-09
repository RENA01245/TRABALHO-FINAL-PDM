import { ActionTypes } from './types';

export const fetchPets = () => {
  return {
    type: ActionTypes.FETCH_PETS,
  };
};

export const updateUserSettings = (settings) => {
  return {
    type: ActionTypes.UPDATE_USER_SETTINGS,
    payload: settings,
  };
};

export const addPet = (pet) => {
  return {
    type: ActionTypes.ADD_PET,
    payload: pet,
  };
};

export const removePet = (petId) => {
  return {
    type: ActionTypes.REMOVE_PET,
    payload: petId,
  };
};