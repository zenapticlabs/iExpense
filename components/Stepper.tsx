import { View, Text, StyleSheet } from "react-native";

type StepState = "submitted" | "approved" | "paid";

type StepProps = {
  number: number;
  label: string;
  date?: string;
  isActive: boolean;
  isLast?: boolean;
};

type StepperProps = {
  currentState?: string;
  date?: string;
};

const Step = ({ number, label, date, isActive, isLast }: StepProps) => (
  <>
    <View style={styles.stepperItem}>
      <View style={[styles.stepNumber, isActive && styles.activeStep]}>
        <Text
          style={[styles.stepNumberText, isActive && styles.activeStepText]}
        >
          {number}
        </Text>
      </View>
      <Text style={styles.stepLabel}>{label}</Text>
      {date && <Text style={styles.stepDate}>{date}</Text>}
    </View>
    {!isLast && (
      <View
        style={[
          styles.stepperLine,
          isActive && styles.activeStepperLine
        ]}
      />
    )}
  </>
);

export const Stepper = ({ currentState, date }: StepperProps) => {
  const steps = [
    { number: 1, label: "Submitted", state: "submitted" as StepState },
    { number: 2, label: "Approved", state: "approved" as StepState },
    { number: 3, label: "Paid", state: "paid" as StepState },
  ];

  const currentStateIndex = steps.findIndex(
    (step) => step.state === currentState
  );

  return (
    <View style={styles.stepper}>
      {steps.map((step, index) => (
        <Step
          key={step.number}
          number={step.number}
          label={step.label}
          date={currentState === step.state ? date : undefined}
          isActive={index <= currentStateIndex}
          isLast={index === steps.length - 1}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  stepper: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 24,
    paddingHorizontal: 0,
  },
  stepperItem: {
    alignItems: "center",
    width: 80,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  activeStep: {
    backgroundColor: "#1a237e",
  },
  stepNumberText: {
    fontSize: 14,
    color: "#6B7280",
  },
  activeStepText: {
    color: "white",
  },
  stepLabel: {
    fontSize: 14,
    color: "#374151",
  },
  stepDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  stepperLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
    marginTop: 12,
  },
  activeStepperLine: {
    backgroundColor: "#1a237e",
  },
});

export default Stepper;
