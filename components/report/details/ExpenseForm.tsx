import {
  StyleSheet,
  Pressable,
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Styles } from "@/Styles";
import ExtraForms from "./ExpenseTypeComponents/ExtraForms";
import CurrencyDropdown from "@/components/CurrencyDropdown";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import commonService from "@/services/commonService";

interface ExpenseFormExpenseFormProps {
  payload: any;
  setPayload: (value: any) => void;
}

export default function ExpenseFormExpenseForm({
  payload,
  setPayload,
}: ExpenseFormExpenseFormProps) {
  const [convertedCurrency, setConvertedCurrency] = useState("usd");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [isUploadFileModalVisible, setUploadFileModalVisible] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<any>({});

  useEffect(() => {
    const fetchExchangeRates = async () => {
      const response = await commonService.getExchangeRates();
      setExchangeRates(response);
    };
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    if (payload.receipt_currency && payload.receipt_amount) {
      const convertedAmount =
        (exchangeRates[convertedCurrency.toUpperCase()] /
          exchangeRates[payload.receipt_currency?.toUpperCase()]) *
        payload.receipt_amount;
      setConvertedAmount(convertedAmount);
    }
  }, [payload.receipt_currency, payload.receipt_amount, convertedCurrency]);

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
      </View>
      <View>
        <Text style={Styles.generalInputLabel}>Note</Text>
        <TextInput
          style={Styles.generalInput}
          placeholder="Enter note"
          value={payload?.note}
          onChangeText={(text) => setPayload({ ...payload, note: text })}
        />
      </View>
      <View>
        <Text style={Styles.generalInputLabel}>Attached receipt</Text>
        <TouchableOpacity
          style={styles.uploadContainer}
          onPress={() => setUploadFileModalVisible(true)}
        >
          <Ionicons name="cloud-upload-outline" size={24} color="#666" />
          <Text style={styles.uploadText}>Upload file</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isUploadFileModalVisible}
        onRequestClose={() =>
          setUploadFileModalVisible(!isUploadFileModalVisible)
        }
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalUploadTitle}>Uploaded receipt</Text>
            <View style={styles.uploadContent}></View>
            <View style={styles.btnsContainer}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setUploadFileModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonUpload]}
                onPress={() => setUploadFileModalVisible(false)}
              >
                <Text style={[styles.textStyle, styles.uploadBtnText]}>
                  Upload receipt
                </Text>
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
    height: 262,
    width: "100%",
    backgroundColor: "#DDDDDD",
    borderRadius: 8,
    marginBlock: 10,
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
});
