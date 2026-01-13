import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useAuth } from "../../../viewmodel/auth/useAuth";

export default function LoginScreen() {
  const { login, signup, loading, error } = useAuth();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

  const submit = async () => {
    try {
      if (mode === "login") await login(userName, password);
      else await signup(userName, password);
      // navegar para tela principal (use sua navegação)
    } catch (e) {
      // erro já tratado no hook
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === "login" ? "Entrar" : "Cadastrar"}</Text>
      <TextInput placeholder="E-mail ou usuário" value={userName} onChangeText={setUserName} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title={loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar"} onPress={submit} disabled={loading} />
      <Button title={mode === "login" ? "Ir para cadastro" : "Ir para login"} onPress={() => setMode(mode === "login" ? "signup" : "login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, justifyContent: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 12, borderRadius: 4 },
  title: { fontSize: 20, marginBottom: 12, textAlign: "center" },
  error: { color: "red", marginBottom: 8, textAlign: "center" },
});