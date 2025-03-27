import { View, Text } from "@/components/Themed";
import React, { memo, useEffect, useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, Image } from "react-native";
import DefaultModal from "../DefaultModal";
import SwipeToCloseDrawer from "../SwipeToCloseGesture";

const ReceiptPreviewDrawer = ({ isVisible, onClose }: any) => {
  const [loading, setLoading] = useState(false);

  return (
    <DefaultModal isVisible={isVisible} onClose={onClose}>
      <SwipeToCloseDrawer onClose={onClose}>
        <View>
          {loading == true ? (
            <View className="flex-1 p-5 min-h-[85vh]">
              <Text className="text-[22px] font-bold mb-6 text-[#1E1E1E]">
                 Analyzing Receipt
                </Text>
                <View className="flex-1 flex items-center justify-center ">
                <Image
                      source={require("@/assets/images/analyze-reciept.svg")}
                      resizeMode="contain"
                    />
                    <Text className="text-[16px] font-normal text-[#1E1E1E]">
                    Analyzing you receipt. Please wait...
                    </Text>
                </View>
            </View>
          ) : (
            <View>
              <ScrollView className="flex-1 p-5">
                <Text className="text-[22px] font-bold mb-6 text-[#1E1E1E]">
                  Receipt Preview
                </Text>
                <Text className="text-[20px] font-normal mb-6 text-[#1E1E1E]">
                  Receipt.pdf
                </Text>
                <View className="h-[457px] rounded-lg !bg-[#DADADA] border-[#DDDDDD] flex items-center justify-center p-4">
                  <Image
                    source={require("@/assets/images/receipt-template.png")}
                    resizeMode="contain"
                  />
                </View>

                <View className="flex-row justify-between gap-4 mt-5">
                  <TouchableOpacity className="p-2.5 rounded-lg bg-[#E120201A] h-[56px] flex items-center justify-center w-[60px]">
                    <Image
                      source={require("@/assets/images/Trash.svg")}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 p-2.5 rounded-lg bg-[#F5F5F5] h-[56px] flex items-center justify-center">
                    <Text className="text-[#1E1E1E] font-semibold text-[17px] text-center font-sfpro ">
                      Change Receipt
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
              <View className="flex-row justify-between p-5 border-t border-[#DDDDDD]">
                <TouchableOpacity
                  onPress={onClose}
                  className="flex-1 mr-2 p-2.5 rounded-lg bg-[#F5F5F5] h-[56px] "
                >
                  <Text className="text-[#1E1E1E] text-lg text-center font-sfpro font-medium">
                    Back
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 ml-2 h-[56px] p-2.5 rounded-lg bg-blue-900 flex flex-row justify-center items-center gap-3 bg-gradient-to-r from-[#17317F] to-[#2958E5]"
                  onPress={() => setLoading(true)}
                >
                  <Image
                    source={require("@/assets/images/stars.svg")}
                    resizeMode="contain"
                  />
                  <Text className="!text-white text-lg text-center font-sfpro font-medium ">
                    Upload
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </SwipeToCloseDrawer>
    </DefaultModal>
  );
};

export default memo(ReceiptPreviewDrawer);
