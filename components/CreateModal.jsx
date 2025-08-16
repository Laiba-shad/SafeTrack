// components/CreateModal.jsx
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import TodoService from '../Services/TodoServices';

const CreateModal = ({ visible, onClose, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    if (visible) {
      TodoService.getAllUsers()
        .then((res) => {
          setUsers(res.data.users);
        })
        .catch((err) => {
          console.error('Failed to fetch users:', err);
        });
    }
  }, [visible]);

  const handleCreate = async () => {
    if (!title || !description || !selectedUserId) {
      alert('Please fill all fields and select user');
      return;
    }

    const newTask = {
      title,
      description,
      dueDate,
      assignedTo: selectedUserId,
    };

    

    try {
      await TodoService.createTodo(newTask);
      if (onTaskCreated) {
      onTaskCreated();
      }
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(new Date());
    setSelectedUserId(null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <ScrollView style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create New Task</Text>

          <TextInput
            placeholder="Title"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            placeholder="Description"
            style={styles.input}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Deadline:</Text>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.buttonText}>
              {dueDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  const newDate = new Date(dueDate);
                  newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
                  setDueDate(newDate);
                }
              }}
            />
          )}

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.buttonText}>
              {dueDate.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={dueDate}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  const newDate = new Date(dueDate);
                  newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
                  setDueDate(newDate);
                }
              }}
            />
          )}

          <Text style={styles.label}>Assign To:</Text>
          <Picker
            selectedValue={selectedUserId}
            onValueChange={(itemValue) => setSelectedUserId(itemValue)}
          >
            <Picker.Item label="Select User" value={null} />
            {users.map((user) => (
              <Picker.Item key={user._id} label={user.username} value={user._id} />
            ))}
          </Picker>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default CreateModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#00796B',
  },

 input: {
    borderWidth: 1,
    borderColor: '#FF9800',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#00796B',
  },
  dateButton: {
    backgroundColor: '#E0F7FA',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#00796B',
    fontWeight: 'bold',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  createButton: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#006678',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
   pickerWrapper: {
    borderWidth: 1,
    borderColor: '#FF9800',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    color: '#00796B',
  },


});