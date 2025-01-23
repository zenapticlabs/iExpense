import { commonService } from "@/services/commonService";
import { reportService } from "@/services/reportService";
import { ReportTypes } from "@/utils/UtilData";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface EntertainmentLeviProps {
  payload: any;
  setPayload: any;
}

export default function EntertainmentLevi({
  payload,
  setPayload,
}: EntertainmentLeviProps) {
  const [relationshipsToPai, setRelationshipsToPai] = useState<any[]>([]);
  useEffect(() => {
    const fetchRelationshipsToPai = async () => {
      try {
        const response = await commonService.getRelationshipsToPai();
        setRelationshipsToPai(
          response.map((item: any) => ({
            label: item.value,
            value: item.value,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch airlines:", error);
      }
    };
    fetchRelationshipsToPai();
  }, []);
  return (
    <View style={styles.formContainer}>
      <Text style={styles.inputLabel}>Name of Establishment</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name of establishment"
        onChangeText={(text) =>
          setPayload({ ...payload, name_of_establishment: text })
        }
      />
      <Text style={styles.inputLabel}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter City"
        onChangeText={(text) => setPayload({ ...payload, city: text })}
      />

      <Text style={styles.inputLabel}>Business Topic</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Business Topic"
        onChangeText={(text) =>
          setPayload({ ...payload, business_topic: text })
        }
      />

      <Text style={styles.inputLabel}>Total Attendees</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Total Attendees"
        keyboardType="numeric"
        onChangeText={(text) => {
          const numericValue = text.replace(/[^0-9]/g, "");
          setPayload({ ...payload, total_attendees: numericValue });
        }}
      />
      <Text style={styles.inputLabel}>Attendees</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Attendees"
        keyboardType="numeric"
        onChangeText={(text) => setPayload({ ...payload, attendees: text })}
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  formContainer: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 16,
    color: "#1E1E1E",
    marginBottom: 4,
  },
  dropdown: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    width: "100%",
  },
  dropdownContainer: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
});
