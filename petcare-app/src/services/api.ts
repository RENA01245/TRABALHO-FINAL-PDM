import axios from 'axios';

const API_URL = 'https://api.example.com'; // Replace with your actual API URL

export const fetchPets = async () => {
  try {
    const response = await axios.get(`${API_URL}/pets`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching pets: ' + error.message);
  }
};

export const fetchPetDetails = async (petId) => {
  try {
    const response = await axios.get(`${API_URL}/pets/${petId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching pet details: ' + error.message);
  }
};

export const createPet = async (petData) => {
  try {
    const response = await axios.post(`${API_URL}/pets`, petData);
    return response.data;
  } catch (error) {
    throw new Error('Error creating pet: ' + error.message);
  }
};

export const updatePet = async (petId, petData) => {
  try {
    const response = await axios.put(`${API_URL}/pets/${petId}`, petData);
    return response.data;
  } catch (error) {
    throw new Error('Error updating pet: ' + error.message);
  }
};

export const deletePet = async (petId) => {
  try {
    await axios.delete(`${API_URL}/pets/${petId}`);
  } catch (error) {
    throw new Error('Error deleting pet: ' + error.message);
  }
};