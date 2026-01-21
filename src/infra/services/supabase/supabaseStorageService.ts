import { supabase } from "./supabase";
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

export class SupabaseStorageService {
  /**
   * Faz upload de uma imagem para o bucket do Supabase
   * @param imageUri URI da imagem (file://...)
   * @param bucketName Nome do bucket (ex: 'pet-photos')
   * @param path Caminho/Nome do arquivo no bucket
   * @returns URL pública da imagem
   */
  async uploadImage(imageUri: string, bucketName: string, path: string): Promise<string> {
    try {
      // 1. Lê o arquivo como base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      });

      // 2. Faz o upload usando base64-arraybuffer
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(path, decode(base64), {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) {
        throw new Error(`Erro no upload: ${error.message}`);
      }

      // 3. Obtém a URL pública
      const { data: publicData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(path);

      return publicData.publicUrl;
    } catch (error: any) {
      throw new Error(`Falha ao fazer upload da imagem: ${error.message}`);
    }
  }

  /**
   * Deleta uma imagem do bucket
   * @param bucketName Nome do bucket
   * @param path Caminho do arquivo
   */
  async deleteImage(bucketName: string, path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([path]);

    if (error) {
      throw new Error(`Erro ao deletar imagem: ${error.message}`);
    }
  }

  /**
   * Extrai o caminho do arquivo a partir da URL pública
   * @param url URL pública da imagem
   * @param bucketName Nome do bucket
   * @returns Caminho do arquivo ou null se não conseguir extrair
   */
  extractPathFromUrl(url: string, bucketName: string): string | null {
    try {
      // Formato padrão: .../storage/v1/object/public/bucket-name/folder/file.jpg
      const target = `/storage/v1/object/public/${bucketName}/`;
      const parts = url.split(target);
      if (parts.length === 2) {
        return decodeURIComponent(parts[1]);
      }
      return null;
    } catch (error) {
      console.error("Erro ao extrair path da URL:", error);
      return null;
    }
  }
}

export const storageService = new SupabaseStorageService();
