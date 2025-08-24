import { StyleSheet, TouchableOpacity, View } from 'react-native';

const header = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
      {/* <Ionicons name="chevron-back" color="#FFA500" size={24} /> */}
      </TouchableOpacity>
      {/* <text>this is header</text> */}
    </View>
  );
};

export default header;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
