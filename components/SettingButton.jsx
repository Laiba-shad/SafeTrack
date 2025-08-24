import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SettingButton = ({ title, icon, onPress, isActive }) => {
  return (
    <TouchableOpacity style={styles.settingButton} onPress={onPress}>
      <View style={styles.titleWrapper}>
        <Ionicons name={icon} size={20} color="#008080" />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Feather
        name={isActive ? 'check-circle' : 'circle'}
        size={20}
        color={isActive ? '#008080' : '#ffffff'}
      />
    </TouchableOpacity>
  );
};

export default SettingButton;

const styles = StyleSheet.create({
  settingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
});