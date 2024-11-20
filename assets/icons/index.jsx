import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ArrowLeft from "./ArrowLeft";
import { theme } from "../../constants/theme";
import Mail from "./Mail";
import Lock from "./Lock";
import User from "./User";
const icons = {
  arrowLeft: ArrowLeft,
  mail: Mail,
  lock: Lock,
  user: User,
};

const Icon = ({ name, ...props }) => {
  const IconComponent = icons[name];
  return (
    <IconComponent
      height={props.size || 24}
      width={props.size || 24}
      strokeWidth={props.strokeWidth || 1.9}
      color={props.color || theme.colors.textLight}
      {...props}
    />
  );
};

export default Icon;

const styles = StyleSheet.create({});
