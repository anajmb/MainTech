import React from "react";
import { Text, TextProps } from "react-native";

export const CustomText: React.FC<TextProps> = ({ style, children, ...props }) => {
  return (
    <Text style={[{ fontFamily: "Poppins-Regular" }, style]} {...props}>
      {children}
    </Text>
  );
};