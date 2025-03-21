import { Modal, Pressable, StyleSheet, View, Animated, KeyboardAvoidingView, Platform } from "react-native";
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
      {/* Dimmed overlay with controlled opacity */}
      {dimOverlay && (
        <Animated.View
          style={[styles.modalOverlay, { opacity: opacityAnim }]}
        />
      )}

      {/* Dismissable pressable area */}
      <Pressable className="flex-1 z-10" onPress={onClose} />

      {/* Modal content */}
      <View className="bg-white absolute z-20 bottom-0 left-0 right-0 max-h-[80vh] rounded-t-xl pb-8">
        {children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default DefaultModal;
