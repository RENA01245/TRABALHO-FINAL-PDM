import { useState } from 'react';
import { petUseCases } from '../di/container';
import Pet from '../model/entities/pet';
import { Alert } from 'react-native';
import { storageService } from '../infra/services/supabase/supabaseStorageService';

export const usePetDetailsViewModel = (navigation: any, initialPet: Pet) => {
  const [pet, setPet] = useState<Pet>(initialPet);
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  
  // Edit Form State
  const [editName, setEditName] = useState(pet.name);
  const [editBreed, setEditBreed] = useState(pet.breed || '');
  const [editAge, setEditAge] = useState(pet.age?.toString() || '');
  const [editObservations, setEditObservations] = useState(pet.observations || '');
  const [editImageUri, setEditImageUri] = useState<string | null>(null);

  const handleDeletePet = async () => {
    Alert.alert(
      "Excluir Pet",
      "Tem certeza que deseja excluir este pet?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              
              // Tenta deletar a imagem do storage se existir
              if (pet.imageUrl) {
                const imagePath = storageService.extractPathFromUrl(pet.imageUrl, 'pet-photos');
                if (imagePath) {
                  await storageService.deleteImage('pet-photos', imagePath).catch(err => {
                    console.warn("Falha ao deletar imagem do storage (não bloqueante):", err);
                  });
                }
              }

              await petUseCases.deletePet(pet.id);
              navigation.goBack();
            } catch (error) {
              console.error(error);
              Alert.alert("Erro", "Não foi possível excluir o pet.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleUpdatePet = async () => {
    if (!editName.trim()) {
      Alert.alert("Erro", "O nome do pet é obrigatório.");
      return;
    }

    try {
      setLoading(true);
      
      let imageUrl = pet.imageUrl;
      if (editImageUri) {
         // Se houver uma imagem anterior, tenta deletar para não acumular lixo
         if (pet.imageUrl) {
            const oldPath = storageService.extractPathFromUrl(pet.imageUrl, 'pet-photos');
            if (oldPath) {
               await storageService.deleteImage('pet-photos', oldPath).catch(console.warn);
            }
         }

         // Assuming client ID is part of path structure
         const fileName = `${pet.clientId}/${Date.now()}.jpg`;
         // Ensure bucket exists or handle error
         imageUrl = await storageService.uploadImage(editImageUri, 'pet-photos', fileName);
      }

      const updatedPet: Pet = {
        ...pet,
        name: editName,
        breed: editBreed || null,
        age: editAge ? parseInt(editAge) : null,
        observations: editObservations || null,
        imageUrl: imageUrl
      };

      await petUseCases.updatePet(updatedPet);
      setPet(updatedPet);
      setIsEditModalVisible(false);
      setEditImageUri(null);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o pet.");
    } finally {
      setLoading(false);
    }
  };

  return {
    pet,
    loading,
    isEditModalVisible,
    setIsEditModalVisible,
    editName, setEditName,
    editBreed, setEditBreed,
    editAge, setEditAge,
    editObservations, setEditObservations,
    editImageUri, setEditImageUri,
    handleDeletePet,
    handleUpdatePet
  };
};
