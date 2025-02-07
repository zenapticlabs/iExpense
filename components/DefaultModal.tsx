import { useState } from "react";
import { Button, Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface DefaultModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const DefaultModal = ({ isVisible, onClose, children }: DefaultModalProps) => {
  return (
    <Modal
      animationType="slide" // Options: "slide", "fade", "none"
      transparent={true} // Makes the background transparent
      visible={isVisible}
      onRequestClose={onClose} // Handles back button on Android
    >
      <View style={styles.modalContainer}>
        <Pressable style={styles.modalOverlay} onPress={onClose}></Pressable>
        <View style={styles.modalContent}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: "white",
  },
});

export default DefaultModal;
