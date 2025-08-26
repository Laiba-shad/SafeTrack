import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const CustomInput = ({
  label,
  icon,
  placeholder,
  type = "text",
  maxLength,
  value,
  onChangeText,
  editable = true,
  secureTextEntry = false,
  showPasswordToggle = false,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(secureTextEntry);
  const isPassword = type === "password";

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {icon && (
          <View style={styles.icon}>
            {icon}
          </View>
        )}
        <TextInput
          style={[styles.input, !editable && styles.inputDisabled]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={isPassword && showPassword}
          maxLength={maxLength}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          {...rest}
        />
        {isPassword && showPasswordToggle && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.toggleButton}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#ff7f50"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  inputDisabled: {
    color: '#999',
  },
  toggleButton: {
    padding: 5,
  },
});

export default CustomInput;