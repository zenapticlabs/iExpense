import {
  StyleSheet,
  Pressable,
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { WebView } from "react-native-webview";
import { Styles } from "@/Styles";
import ExtraForms from "./ExpenseTypeComponents/ExtraForms";
import CurrencyDropdown from "@/components/CurrencyDropdown";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import commonService from "@/services/commonService";
import * as DocumentPicker from "expo-document-picker";
const baseS3Url = "https://iexpense-receipts.s3.amazonaws.com/";

interface ExpenseFormExpenseFormProps {
  payload: any;
  errors: any;
  setPayload: (value: any) => void;
  exchangeRates: any;
}

export default function ExpenseFormExpenseForm({
  payload,
  setPayload,
  errors,
  exchangeRates,
}: ExpenseFormExpenseFormProps) {
  const [convertedCurrency, setConvertedCurrency] = useState("usd");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);

  useEffect(() => {
    if (payload.receipt_currency && payload.receipt_amount) {
      const convertedAmount =
        (exchangeRates[convertedCurrency.toUpperCase()] /
          exchangeRates[payload.receipt_currency?.toUpperCase()]) *
        payload.receipt_amount;
      setConvertedAmount(convertedAmount);
    }
  }, [
    payload,
    payload.receipt_currency,
    payload.receipt_amount,
    convertedCurrency,
  ]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"], // Allows images and PDFs
        multiple: false,
      });

      if (result.assets && result.assets[0]) {
        const file = result.assets[0];
        setPayload({
          ...payload,
          file: file,
        });
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isImageFile = (file: any) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];
    if (
      file?.mimeType?.startsWith("image/") ||
      file?.type?.startsWith("image/")
    ) {
      return true;
    }
    if (file?.name) {
      const extension = file.name.toLowerCase().match(/\.[^.]*$/)?.[0];
      return extension && imageExtensions.includes(extension);
    }
    if (typeof file === "string") {
      const extension = file.toLowerCase().match(/\.[^.]*$/)?.[0];
      return extension && imageExtensions.includes(extension);
    }
    return false;
  };

  const isPdfFile = (file: any) => {
    if (
      file?.mimeType === "application/pdf" ||
      file?.type === "application/pdf"
    ) {
      return true;
    }
    if (file?.name) {
      const extension = file.name.toLowerCase().match(/\.[^.]*$/)?.[0];
      return extension === ".pdf";
    }
    if (typeof file === "string") {
      const extension = file.toLowerCase().match(/\.[^.]*$/)?.[0];
      return extension === ".pdf";
    }
    return false;
  };

  return (
    <View style={{ flexDirection: "column", gap: 16 }}>
      <View>
        <Text style={Styles.generalInputLabel}>Expense type</Text>
        <View style={[Styles.generalInput, Styles.disabledInput]}>
          {payload?.expense_type}
        </View>
      </View>
      <ExtraForms
        expense_type={payload?.expense_type}
        payload={payload}
        setPayload={setPayload}
        errors={errors}
      />
      <View>
        <Text style={Styles.generalInputLabel}>Date</Text>
        <TouchableOpacity style={[styles.inputContainer, Styles.generalInput]}>
          <Text style={Styles.textSm}>Nov 5, 2024</Text>
          <Ionicons name="calendar-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.amountContainer}>
        <Text style={Styles.generalInputLabel}>Receipt amount</Text>
        <View style={styles.currencyInputContainer}>
          <CurrencyDropdown
            value={payload?.receipt_currency}
            onChange={(value) =>
              setPayload({ ...payload, receipt_currency: value })
            }
          />
          <TextInput
            style={[Styles.generalInput, { flex: 1, marginLeft: 16 }]}
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={payload?.receipt_amount}
            onChangeText={(text) =>
              setPayload({ ...payload, receipt_amount: text })
            }
          />
        </View>

        <Text style={Styles.generalInputLabel}>Converted report amount</Text>
        <View style={styles.currencyInputContainer}>
          <CurrencyDropdown
            value={convertedCurrency}
            onChange={(value) => setConvertedCurrency(value)}
          />
          <TextInput
            style={[Styles.generalInput, { flex: 1, marginLeft: 16 }]}
            placeholder="0.00"
            keyboardType="decimal-pad"
            defaultValue="0"
            editable={false}
            value={convertedAmount.toString()}
          />
        </View>
      </View>
      <View>
        <Text style={Styles.generalInputLabel}>Justification</Text>
        <TextInput
          style={Styles.generalInput}
          placeholder="Enter justification"
          value={payload?.justification}
          onChangeText={(text) =>
            setPayload({ ...payload, justification: text })
          }
        />
        {errors?.justification && (
          <Text className="text-red-500 pl-4 mt-1">{errors.justification}</Text>
        )}
      </View>
      <View>
        <Text style={Styles.generalInputLabel}>Note</Text>
        <TextInput
          style={Styles.generalInput}
          placeholder="Enter note"
          value={payload?.note}
          onChangeText={(text) => setPayload({ ...payload, note: text })}
        />
        {errors?.note && (
          <Text className="text-red-500 pl-4 mt-1">{errors.note}</Text>
        )}
      </View>
      <View>
        <Text style={Styles.generalInputLabel}>Attached receipt</Text>
        {payload?.file && (
          <Pressable
            onPress={() => setIsPreviewModalVisible(true)}
            className="flex flex-row items-center p-3 bg-gray-100 rounded-lg mb-2 active:bg-gray-200"
          >
            <View style={styles.fileIconContainer}>
              <Ionicons name="document-outline" size={24} color="#666" />
            </View>
            <View style={styles.fileDetailsContainer}>
              <Text style={styles.fileNameText}>{payload.file.name}</Text>
              <Text style={styles.fileSizeText}>
                {formatFileSize(payload.file.size)}
              </Text>
            </View>
            <Ionicons
              name="close-circle-outline"
              size={24}
              color="#666"
              onPress={() => setPayload({ ...payload, file: null })}
            />
          </Pressable>
        )}
        {payload?.filename && (
          <Pressable
            onPress={() => setIsPreviewModalVisible(true)}
            className="flex flex-row items-center p-3 bg-gray-100 rounded-lg mb-2 active:bg-gray-200"
          >
            <View style={styles.fileIconContainer}>
              <Ionicons name="document-outline" size={24} color="#666" />
            </View>
            <View style={styles.fileDetailsContainer}>
              <Text style={styles.fileNameText}>{payload.filename}</Text>
            </View>
            <Ionicons
              name="close-circle-outline"
              size={24}
              color="#666"
              onPress={() =>
                setPayload({ ...payload, filename: null, s3_path: null })
              }
            />
          </Pressable>
        )}
        <TouchableOpacity style={styles.uploadContainer} onPress={pickDocument}>
          <Ionicons name="cloud-upload-outline" size={24} color="#666" />
          <Text style={styles.uploadText}>Upload file</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isPreviewModalVisible}
        onRequestClose={() => setIsPreviewModalVisible(!isPreviewModalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalUploadTitle}>Uploaded receipt</Text>
            {payload?.file && (
              <View style={styles.uploadContent}>
                {isImageFile(payload.file) ? (
                  <Image
                    source={{ uri: payload.file.uri }}
                    style={styles.previewImage}
                    resizeMode="contain"
                  />
                ) : isPdfFile(payload.file) ? (
                  <WebView
                    source={{ uri: payload.file.uri }}
                    style={styles.pdfPreview}
                    javaScriptEnabled={true}
                  />
                ) : (
                  <View>
                    <Ionicons name="document-outline" size={40} color="#666" />
                    <Text style={styles.fileName}>{payload.file.name}</Text>
                    <Text style={styles.fileSize}>
                      {formatFileSize(payload.file.size)}
                    </Text>
                  </View>
                )}
              </View>
            )}
            {payload?.filename && (
              <View style={styles.uploadContent}>
                {isImageFile(payload.filename) ? (
                  <Image
                    source={{ uri: baseS3Url + payload.s3_path }}
                    style={styles.previewImage}
                    resizeMode="contain"
                  />
                ) : isPdfFile(payload.filename) ? (
                  <WebView
                    source={{ uri: baseS3Url + payload.s3_path }}
                    style={styles.pdfPreview}
                    javaScriptEnabled={true}
                  />
                ) : (
                  <View>
                    <Ionicons name="document-outline" size={40} color="#666" />
                    <Text style={styles.fileName}>{payload.filename}</Text>
                    <Text style={styles.fileSize}>
                      {formatFileSize(payload.file.size)}
                    </Text>
                  </View>
                )}
              </View>
            )}
            <View style={styles.btnsContainer}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setIsPreviewModalVisible(false)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  currencyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadContainer: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  uploadText: {
    color: "#666",
    marginTop: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000080",
    zIndex: 99,
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 24,
    alignItems: "flex-start",
    shadowColor: "#000",
    width: "95%",
    zIndex: 99,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalUploadTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1e1e1e",
    lineHeight: 26,
    width: "100%",
    fontFamily: "SFProDisplay",
    paddingBottom: 16,
  },
  uploadContent: {
    minHeight: 200,
    width: "100%",
    borderRadius: 8,
    marginBlock: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  fileInfoContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  fileName: {
    fontSize: 16,
    color: "#1e1e1e",
    marginTop: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  fileSize: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  emptyUploadContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  btnsContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    marginTop: 16,
    gap: 16,
    alignItems: "center",
  },

  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 20,
    elevation: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonUpload: {
    backgroundColor: "#17317F",
    color: "white",
  },
  uploadBtnText: {
    color: "white",
  },
  buttonClose: {
    backgroundColor: "#F5F5F5",
    color: "white",
  },
  textStyle: {
    color: "#1E1E1E",
    fontWeight: "500",
    textAlign: "center",
    fontSize: 17,
    fontFamily: "SFProDisplay",
  },
  selectedFileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 8,
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  fileDetailsContainer: {
    marginLeft: 12,
    flex: 1,
  },
  fileNameText: {
    fontSize: 14,
    color: "#1e1e1e",
    fontWeight: "500",
  },
  fileSizeText: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  pdfPreview: {
    width: "100%",
    height: 400,
    borderRadius: 8,
  },
});
