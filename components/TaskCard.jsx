import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TaskCard = ({ task, onEdit, onDelete }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.title}>{task.title.slice(0, 10)}</Text>
      <Text style={[
          styles.status,
          task.isCompleted ? styles.completed : styles.incomplete
        ]}>
        {task.isCompleted ? 'Completed' : 'Incomplete'}
      </Text>
    </View>
    <Text style={styles.desc}>{task.description}</Text>
    <Text style={styles.date}>Date: {task.createdAt?.slice(0, 10)}</Text>
    <View style={styles.actions}>
      <TouchableOpacity onPress={onEdit}>
        <Text style={styles.edit}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(task._id)}>
        <Text style={styles.delete}>Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default TaskCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontWeight: 'bold', color: '#006678' /* teal dark */ },
  status: {
    padding: 5,
    borderRadius: 5,
    fontWeight: 'bold',
  },
  completed: { backgroundColor: '#FFA500' /* orange */ },
  incomplete: { backgroundColor: '#00CED1' /* teal/light */ },
  desc: { marginVertical: 8 },
  date: { fontStyle: 'italic', color: '#666' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  edit: { marginRight: 20, color: '#006678' },
  delete: { color: '#D9534F' },
});
