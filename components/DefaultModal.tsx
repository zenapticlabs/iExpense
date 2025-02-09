import { Modal, Pressable, StyleSheet, View, Animated } from "react-native";
import { useState, useEffect, useRef } from "react";

interface DefaultModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const DefaultModal = ({ isVisible, onClose, children }: DefaultModalProps) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [dimOverlay, setDimOverlay] = useState(false);
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setDimOverlay(true);
        Animated.timing(opacityAnim, {
          toValue: 0.2,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 300);
    } else {
      opacityAnim.setValue(0);
      setDimOverlay(false);
    }
  }, [isVisible]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Dimmed overlay with controlled opacity */}
        {dimOverlay && (
          <Animated.View style={[styles.modalOverlay, { opacity: opacityAnim }]} />
        )}

        {/* Dismissable pressable area */}
        <Pressable style={styles.modalDismissArea} onPress={onClose} />

        {/* Modal content */}
        <View style={styles.modalContent}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    zIndex: 0,
  },
  modalDismissArea: {
    flex: 1,
    zIndex: 1,
  },
  modalContent: {
    width: "100%",
    maxHeight: "90%",
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 2,
  },
});

export default DefaultModal;
