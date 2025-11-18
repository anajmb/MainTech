import { EllipsisVertical } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from "react-native";

export default function TresPontinhos() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  const handleRemover = () => {
    // coloque aqui a lógica para remover membro
    close();
  };

  const handleMudarEquipe = () => {
    // coloque aqui a lógica para mudar de equipe
    close();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggle} style={styles.button} activeOpacity={0.7}>
        <EllipsisVertical size={19} />
      </TouchableOpacity>

      {open && (
        <>
          {/* backdrop para fechar ao tocar fora */}
          <Pressable style={styles.backdrop} onPress={close} />

          <View style={styles.menu}>
            <TouchableOpacity onPress={handleRemover} style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Remover membro</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleMudarEquipe} style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Mudar de equipe</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  button: {
    padding: 6,
    // ajuste posicionamento se necessário
  },
  backdrop: {
    position: "absolute",
    top: -1000, // cobre mais área para impedir toques indesejados (ajuste conforme necessidade)
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: 1,
  },
  menu: {
    position: "absolute",
    top: 28, // posiciona logo abaixo do botão
    right: 0,
    backgroundColor: "#E9E9E9",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    zIndex: 2,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  menuText: {
    fontSize: 14,
    color: "#222",
  },
});