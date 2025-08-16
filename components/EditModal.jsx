// components/EditModal.js
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import TodoServices from '../Services/TodoServices';

const EditModal = ({ visible, onClose, onEdit, task }) => {
  // Form states
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(task?.dueDate ? new Date(task.dueDate) : new Date());
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo || '');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Load users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await TodoServices.getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Update state when task prop changes
  useEffect(() => {
    setTitle(task?.title || '');
    setDescription(task?.description || '');
    setDueDate(task?.dueDate ? new Date(task.dueDate) : new Date());
    setAssignedTo(task?.assignedTo || '');
  }, [task]);

  // Date picker handler
  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDueDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  // Submit handler
  const handleEdit = async () => {
    if (!title || !description || !dueDate || !assignedTo) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const updatedTask = {
        title,
        description,
        dueDate,
        assignedTo,
      };

      await TodoServices.updateTask(task._id, updatedTask);
      onEdit(); // Refresh task list
      onClose(); // Close modal
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Text style={styles.title}>Edit Task</Text>

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.label}>Assign To:</Text>
            <View style={styles.picker}>
              <select
                value={assignedTo || ''}
                onChange={(e) => setAssignedTo(e.target.value)}
                style={{ fontSize: 16, padding: 8 }}
              >
                <option value="">-- Select a user --</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </View>

            <Text style={styles.label}>Due Date & Time:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateBtn}>
              <Text style={styles.dateText}>
                {dueDate.toLocaleString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="datetime"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onDateChange}
              />
            )}

            <View style={styles.buttonGroup}>
              <Button title="Update Task" onPress={handleEdit} />
              <Button title="Cancel" color="red" onPress={onClose} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default EditModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '90%',
  },
  scrollView: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
  label: {
    marginTop: 10,
    fontWeight: '600',
  },
  picker: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
    padding: 2,
  },
  dateBtn: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    marginBottom: 15,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'column',
    gap: 10,
  },
});
