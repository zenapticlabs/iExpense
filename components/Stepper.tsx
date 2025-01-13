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
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth:1,
    borderColor:'#DDDDDD'
  },
  activeStep: {
    backgroundColor: "#1a237e",
  },
  stepNumberText: {
    fontSize: 17,
    color: "#1E1E1E",
    fontFamily: "SFProDisplay",
  },
  activeStepText: {
    color: "white",
  },
  stepLabel: {
    fontSize: 13,
    fontWeight:400,
    color: "#888888",
    fontFamily: "SFProDisplay",
  },
  stepDate: {
    fontSize: 13,
    fontWeight:400,
    color: "#888888",
    fontFamily: "SFProDisplay",
  },
  stepperLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDDDDD",
    marginHorizontal: 0,
    marginTop: 12,
  },
  activeStepperLine: {
    backgroundColor: "#17317F",
  },
});

export default Stepper;
