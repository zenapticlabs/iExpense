import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IReport } from "@/constants/types";
import { formatDate } from "@/utils/UtilFunctions";

interface ReportStepperProps {
  report: IReport;
}

type StepState = "Submitted" | "Approved" | "Paid" | "Rejected";

interface Step {
  number: number;
  label: string;
  state: StepState;
  getDate: (report: IReport) => string | null;
}

const DEFAULT_STEPS: Step[] = [
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

const REJECT_STEPS: Step[] = [
  {
    number: 1,
    label: "Submitted",
    state: "Submitted",
    getDate: (report) => report?.report_submit_date || null,
  },
  {
    number: 2,
    label: "Rejected",
    state: "Rejected",
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
  const STEPS =
    report?.report_status === "Rejected" ? REJECT_STEPS : DEFAULT_STEPS;
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
      <View
        className={`w-9 h-9 rounded-full items-center justify-center ${
          STEPS[index].state === "Rejected"
            ? "border border-[#E12020] bg-white"
            : isCompleted
            ? "bg-[#17317F]"
            : "border border-[#DDDDDD] bg-white"
        }`}
      >
        <Text
          className={
            STEPS[index].state === "Rejected"
              ? "text-[#E12020]"
              : isCompleted
              ? "text-white"
              : "text-[#1E1E1E]"
          }
        >
          {index + 1}
        </Text>
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
    <View className="flex-row mt-4 mb-4">
      {STEPS.map((step, index) => (
        <View key={step.number} className="flex-1 relative items-center">
          <View className="items-center">
            {getStepIcon(index)}
            <Text
              className={`mt-2 text-sm font-sfpro ${
                STEPS[index].state === "Rejected"
                  ? "text-[#E12020]"
                  : index < stepIndex
                  ? "text-[#1E1E1E]"
                  : "text-[#888888]"
              }`}
            >
              {step.label}
            </Text>
            <Text className="mt-1 text-xs text-[#888888] font-sfpro">
              {getStepDate(step, index)}
            </Text>
          </View>
          {index < STEPS.length - 1 && (
            <View
              className={`h-0.5 mx-1 absolute top-[18px] -z-10 translate-x-1/2 -translate-y-1/2 w-full ${
                STEPS[index].state === "Rejected"
                  ? "bg-[#DDDDDD]"
                  : index < stepIndex
                  ? "bg-[#17317F]"
                  : "bg-[#DDDDDD]"
              }`}
            />
          )}
        </View>
      ))}
    </View>
  );
};

export default ReportStepper;
