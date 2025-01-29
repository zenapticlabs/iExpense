import { commonService } from "@/services/commonService";
import { reportService } from "@/services/reportService";
import { ExpenseType, ReportTypes } from "@/utils/UtilData";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Mileage from "./Mileage";
import AirFare from "./AirFare";
import TelephoneCell from "./TelephoneCell";
import BusinessMeals from "./BusinessMeals";
import AutoRental from "./AutoRental";
import Hotel from "./Hotel";
import Entertainment from "./Entertainment";
import EntertainmentLevi from "./EntertainmentLevi";

interface ExtraFormsProps {
  expense_type: any;
  payload: any;
  setPayload: any;
  errors: any;
}

export default function ExtraForms({
  expense_type,
  payload,
  setPayload,
  errors,
}: ExtraFormsProps) {
  switch (expense_type) {
    case ExpenseType.airFare:
      return <AirFare payload={payload} setPayload={setPayload} errors={errors} />;
    case ExpenseType.autoRental:
      return <AutoRental payload={payload} setPayload={setPayload} errors={errors} />;
    case ExpenseType.businessMeals:
      return <BusinessMeals payload={payload} setPayload={setPayload} errors={errors} />;
    case ExpenseType.entertainment:
      return <Entertainment payload={payload} setPayload={setPayload} errors={errors} />;
    case ExpenseType.entertainmentLevi:
      return <EntertainmentLevi payload={payload} setPayload={setPayload} errors={errors} />;
    case ExpenseType.hotel:
      return <Hotel payload={payload} setPayload={setPayload} errors={errors} />;
    case ExpenseType.mileage:
      return <Mileage payload={payload} setPayload={setPayload} errors={errors} />;
    case ExpenseType.telephoneCell:
      return <TelephoneCell payload={payload} setPayload={setPayload} errors={errors} />;
    default:
      return null;
  }
}
