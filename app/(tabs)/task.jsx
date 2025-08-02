import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function TaskScreen() {
  const [members, setMembers] = useState(['']); // List of team members
  const [assignedTo, setAssignedTo] = useState(members[0]); // Currently selected member
  const [newTask, setNewTask] = useState(''); // New task input
  const [date, setDate] = useState(''); // Date input
  const [time, setTime] = useState(''); // Time input
  const [tasks, setTasks] = useState([]); // List of all tasks

  const addTask = () => {
    if (!newTask.trim()) return; // Prevent empty tasks
    setTasks(prev => [
      ...prev,
      {
        id: Date.now().toString(), // Unique task ID
        title: newTask,
        assignedTo,
        date,
        time,
        status: 'pending' // Status stays pending (admin doesn't complete it)
      }
    ]);
    setNewTask('');
    setDate('');
    setTime('');
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id)); // Remove task by ID
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskInfo}>
        <Text style={styles.taskText}>{item.title}</Text>
        <Text style={styles.assignedText}>Assigned to: {item.assignedTo}</Text>
        <Text style={styles.assignedText}>Date: {item.date} | Time: {item.time}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <MaterialIcons name="delete" size={24} color="#c62828" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* Form UI (moved to top) */}
      <Text style={styles.label}>Assign to:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={assignedTo}
          onValueChange={setAssignedTo}
          style={styles.picker}
        >
          {members.map(member => (
            <Picker.Item key={member} label={member} value={member} />
          ))}
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter new task"
        value={newTask}
        onChangeText={setNewTask}
      />
      <TextInput
        style={styles.input}
        placeholder="Assign date (e.g., 2025-07-25)"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Assign time (e.g., 14:00)"
        value={time}
        onChangeText={setTime}
      />
      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.addButtonText}>+ Create</Text>
      </TouchableOpacity>

      {/* List of tasks */}
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderTask}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fdecc8',
    borderRadius: 20,
    padding: 12,
    marginVertical: 6
  },
  taskInfo: {
    flex: 1,
    marginLeft: 10
  },
  taskText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333'
  },
  assignedText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    marginBottom: 6
  },
  addButton: {
    backgroundColor: '#00a98f',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  label: {
    marginTop: 10,
    fontWeight: '600',
    marginBottom: 4
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 6
  },
  picker: {
    height: 40,
    width: '100%'
  }
});
