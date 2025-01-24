import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IReport } from "@/constants/types";
import { formatDate } from "@/utils/UtilFunctions";

interface ReportStepperProps {
  report: IReport;
}

type StepState = "Submitted" | "Approved" | "Paid";

interface Step {
  number: number;
  label: string;
  state: StepState;
  getDate: (report: IReport) => string | null;
}

const STEPS: Step[] = [
  {
    number: 1,
    label: "Submitted",
    state: "Submitted",
    getDate: (report) => report?.report_submit_date || null,
  },
  {
    number: 2,
    label: "Approved",
    state: "Approved",
    getDate: (report) => report?.integration_date || null,
  },
  {
    number: 3,
    label: "Paid",
    state: "Paid",
    getDate: (report) => report?.integration_date || null,
  },
];

const ReportStepper = ({ report }: ReportStepperProps) => {
  if (report?.report_status === "Open") {
    return null;
  }

  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (report?.report_status) {
      const index =
        STEPS.findIndex((step) => step.state === report?.report_status) + 1;
      setStepIndex(index);
    }
  }, [report]);

  const getStepIcon = (index: number) => {
    const isCompleted = index <= stepIndex - 1;
    return (
      <View style={isCompleted ? styles.completedStep : styles.futureStep}>
        {index + 1}
      </View>
    );
  };

  const getStepDate = (step: Step, index: number) => {
    if (index < stepIndex) {
      const date = step.getDate(report);
      return date ? formatDate(date, true) : null;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {STEPS.map((step, index) => (
        <View key={step.number} style={styles.stepContainer}>
          <View style={styles.stepIconContainer}>
            {getStepIcon(index)}
            <Text
              style={[
                styles.stepText,
                index < stepIndex && styles.completedStepText,
              ]}
            >
              {step.label}
            </Text>
            <Text style={styles.stepDate}>{getStepDate(step, index)}</Text>
          </View>
          {index < STEPS.length - 1 && (
            <View
              style={[
                styles.stepLine,
                index < stepIndex
                  ? styles.completedLine
                  : styles.incompleteLine,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 16,
  },
  stepContainer: {
    flex: 1,
    position: "relative",
    alignItems: "center",
  },
  stepIconContainer: {
    alignItems: "center",
  },
  completedStep: {
    width: 36,
    height: 36,
    backgroundColor: "#17317F",
    color: "white",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  currentStep: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: "#fa004f",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  currentStepInner: {
    width: 12,
    height: 12,
    backgroundColor: "#fa004f",
    borderRadius: 6,
  },
  futureStep: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    color: "#1E1E1E",
    backgroundColor: "#fff",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  stepLine: {
    height: 2,
    marginHorizontal: 4,
    top: 18,
    zIndex: -1,
    transform: [{ translateX: "50%" }, { translateY: "-50%" }],
    position: "absolute",
    width: "100%",
  },
  completedLine: {
    backgroundColor: "#17317F",
  },
  incompleteLine: {
    backgroundColor: "#DDDDDD",
  },
  stepNumber: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#ABB7C2",
  },
  activeStepNumber: {
    color: "#fa004f",
  },
  stepText: {
    marginTop: 8,
    fontSize: 14,
    color: "#888888",
  },
  stepDate: {
    marginTop: 4,
    fontSize: 12,
    color: "#888888",
  },
  completedStepText: {
    color: "#1E1E1E",
  },
});

export default ReportStepper;
