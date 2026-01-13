import { useState, useEffect } from "react";
import { authUseCases } from "../../di/container";
import User from "../../model/entities/user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = authUseCases.onAuthStateChanged(u => setUser(u));
    // tenta carregar usuário atual ao iniciar
    authUseCases.getCurrentUser().then(u => setUser(u)).catch(() => {});
    return () => unsub();
  }, []);

  async function login(userName: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const u = await authUseCases.login({ userName, password });
      setUser(u);
      return u;
    } catch (err: any) {
      setError(err?.message || "Erro ao entrar");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function signup(userName: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const u = await authUseCases.signup({ userName, password });
      setUser(u);
      return u;
    } catch (err: any) {
      setError(err?.message || "Erro ao cadastrar");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await authUseCases.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  return { user, loading, error, login, signup, logout };
}