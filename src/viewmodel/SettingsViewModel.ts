import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { petUseCases, authUseCases } from '../di/container';
import { storageService } from '../infra/services/supabase/supabaseStorageService';
import Pet from '../model/entities/pet';
import User from '../model/entities/user';
import { useAlert } from '../view/context/AlertContext';

export const useSettingsViewModel = (navigation: any) => {
  const { showAlert } = useAlert();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);

  // Add Pet States
  const [isAddPetModalVisible, setIsAddPetModalVisible] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetObservations, setNewPetObservations] = useState('');
  const [newPetImageUri, setNewPetImageUri] = useState<string | null>(null);
  const [addingPet, setAddingPet] = useState(false);

  // Edit User Profile States
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false);
  const [editedPhone, setEditedPhone] = useState('');
  const [editedName, setEditedName] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const loadPets = async (userId: string) => {
    setLoading(true);
    try {
      const userPets = await petUseCases.getAllPetsByClientId(userId);
      setPets(userPets);
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (currentUser?.uID) {
        loadPets(currentUser.uID);
      }
    }, [currentUser])
  );

  useEffect(() => {
    const unsubscribe = authUseCases.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user?.uID) {
        loadPets(user.uID);
      } else {
        setPets([]);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const goToPetDetails = (pet: Pet) => {
    navigation.navigate('PetDetails', { pet });
  };

  const handleLogout = async () => {
    try {
      await authUseCases.logout();
      // Navigation will likely handle auth state change automatically if set up that way,
      // or we might need to reset navigation. For now, just logout.
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const startEditingProfile = () => {
    if (currentUser) {
      setEditedPhone(currentUser.telefone || '');
      setEditedName(currentUser.userName || '');
      setIsEditProfileModalVisible(true);
    }
  };

  const handleUpdateProfile = async () => {
    if (!currentUser) return;
    
    setUpdatingProfile(true);
    try {
      const updatedUser: User = {
        ...currentUser,
        userName: editedName,
        telefone: editedPhone
      };
      
      await authUseCases.updateUser(updatedUser);
      setCurrentUser(updatedUser); // Update local state immediately
      setIsEditProfileModalVisible(false);
      showAlert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      showAlert('Erro', 'Falha ao atualizar perfil. Tente novamente.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleAddPet = async () => {
    if (!currentUser?.uID) return;
    if (!newPetName.trim()) {
      showAlert('Erro', 'Por favor, informe o nome do pet.');
      return;
    }

    setAddingPet(true);
    try {
      let imageUrl = undefined;
      if (newPetImageUri) {
        const fileName = `${currentUser.uID}/${Date.now()}.jpg`;
        // Certifique-se de criar o bucket 'pet-photos' no Supabase
        imageUrl = await storageService.uploadImage(newPetImageUri, 'pet-photos', fileName);
      }

      const newPet: Pet = {
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        clientId: currentUser.uID,
        name: newPetName,
        breed: newPetBreed || null,
        age: newPetAge ? parseInt(newPetAge) : null,
        observations: newPetObservations || null,
        imageUrl: imageUrl,
      };

      await petUseCases.createPet(newPet);
      
      // Atualiza a lista de pets
      const updatedPets = await petUseCases.getAllPetsByClientId(currentUser.uID);
      setPets(updatedPets);
      
      // Limpa o formulário e fecha o modal
      setNewPetName('');
      setNewPetBreed('');
      setNewPetAge('');
      setNewPetObservations('');
      setNewPetImageUri(null);
      setIsAddPetModalVisible(false);
    } catch (error) {
      console.error('Erro ao adicionar pet:', error);
      showAlert('Erro', 'Erro ao adicionar pet. Tente novamente.');
    } finally {
      setAddingPet(false);
    }
  };

  return {
    currentUser,
    pets,
    loading,
    goToPetDetails,
    handleLogout,
    // Add Pet States & Functions
    isAddPetModalVisible,
    setIsAddPetModalVisible,
    newPetName,
    setNewPetName,
    newPetBreed,
    setNewPetBreed,
    newPetAge,
    setNewPetAge,
    newPetObservations,
    setNewPetObservations,
    newPetImageUri,
    setNewPetImageUri,
    handleAddPet,
    addingPet,
    // Edit User Profile
    isEditProfileModalVisible,
    setIsEditProfileModalVisible,
    editedPhone,
    setEditedPhone,
    editedName,
    setEditedName,
    updatingProfile,
    startEditingProfile,
    handleUpdateProfile
  };
};
