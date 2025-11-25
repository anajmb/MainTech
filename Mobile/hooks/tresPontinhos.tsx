import { EllipsisVertical } from "lucide-react-native";
import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Pressable, Modal } from "react-native";
import { api } from "@/lib/axios";

export default function TresPontinhos({
  memberId,
  onRemoved,
}: {
  memberId: number;
  onRemoved?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const iconRef = useRef<View>(null);

  const removeMember = async () => {
    try {
      await api.delete(`/teamMember/delete/${memberId}`);
      close();
      if (onRemoved) onRemoved(); // remove da UI
    } catch (error) {
      console.log("Erro ao remover membro:", error);
    }
  };

  const toggle = () => {
    if (!open) {
      iconRef.current?.measureInWindow((x, y, width, height) => {
        setPos({
          x: x - 100,
          y: y + height + 5,
        });
      });
    }
    setOpen((v) => !v);
  };

  const close = () => setOpen(false);

  return (
    <View ref={iconRef}>
      <TouchableOpacity onPress={toggle} style={{ padding: 4 }}>
        <EllipsisVertical size={20} />
      </TouchableOpacity>

      <Modal transparent visible={open} animationType="fade" onRequestClose={close}>
        <Pressable style={styles.fullscreen} onPress={close} />
        <View style={[styles.menu, { top: pos.y, left: pos.x }]}>
          <TouchableOpacity style={styles.menuItem} onPress={removeMember}>
            <Text style={styles.text}>Remover membro</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menu: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    zIndex: 999,
  },
  menuItem: {
    paddingVertical: 8,
  },
  text: {
    fontSize: 14,
    color: "#222",
  },
});
