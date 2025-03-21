import React, { useRef } from "react";
import { View, PanResponder, StyleSheet } from "react-native";

interface SwipeToCloseGestureProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function SwipeToCloseGesture({
  onClose,
  children,
}: SwipeToCloseGestureProps) {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy > 150) {
          onClose();
        }
      },
    })
  ).current;

  return (
    <View {...panResponder.panHandlers} className="flex flex-col flex-1">
      <View className="flex-row justify-center items-center pt-2 px-4 w-full">
        <View className="h-1.5 w-8 bg-[#DDDDDD] rounded-md" />
      </View>
      {children}
    </View>
  );
}
