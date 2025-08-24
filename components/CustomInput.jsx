import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const CustomInput = ({
  label,
  icon,
  placeholder,
  type = "text",
  maxLength,
  value,
  onChangeText,
  ...rest
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const isPassword = type === "password";

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Input wrapper */}
      <View style={styles.inputWrapper}>
        {/* Optional icon */}
        {icon && <View style={styles.icon}>{icon}</View>}

        {/* Input field */}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          secureTextEntry={isPassword && secureTextEntry}
          maxLength={maxLength}
          value={value}
          onChangeText={onChangeText}
          {...rest}
        />

        {/* Password toggle */}
        {isPassword && (
          <TouchableOpacity
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          >
            <Text style={styles.toggleText}>
              {secureTextEntry ? "Show" : "Hide"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  toggleText: {
    fontSize: 14,
    color: "#007AFF",
    marginLeft: 10,
  },
});
