// components/CreateModal.jsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import TodoService from "../Services/TodoServices";

const CreateModal = ({ visible, onClose, onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  useEffect(() => {
    if (visible) {
      loadUsers();
      loadLoggedInUser();
    }
  }, [visible]);

  const loadUsers = async () => {
    try {
      const res = await TodoService.getAllUsers();
      setUsers(Array.isArray(res.data?.users) ? res.data.users : []);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  const loadLoggedInUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setCreatedBy(parsed._id);
      }
    } catch (err) {
      console.error("Error loading logged-in user:", err);
    }
  };

  const handleCreate = async () => {
    try {
      const newTask = {
        title,
        dueDate,
        assignedTo,
        createdBy,
      };
      const res = await TodoService.createTodo(newTask);
      onTaskCreated(res.data.todo);
      onClose();
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const handleConfirmDate = (date) => {
    setDueDate(date);
    setShowDatePicker(false);
  };

  const handleCancelDate = () => {
    setShowDatePicker(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Create Task</Text>
          
          <TextInput
            placeholder="Task Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              Due Date: {dueDate.toLocaleDateString()} {dueDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </Text>
          </TouchableOpacity>
          
          <DateTimePicker
            isVisible={showDatePicker}
            mode="datetime"
            onConfirm={handleConfirmDate}
            onCancel={handleCancelDate}
          />
          
          <Text style={styles.label}>Assign To:</Text>
          <View style={styles.pickerContainer}>
            {users.length > 0 ? (
              users.map((u) => (
                <TouchableOpacity
                  key={u._id}
                  style={[
                    styles.userButton,
                    assignedTo === u._id && styles.userButtonSelected,
                  ]}
                  onPress={() => setAssignedTo(u._id)}
                >
                  <Text style={styles.userText}>{u.username || u.email}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noUsers}>No users available</Text>
            )}
          </View>
          
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} color="#888" />
            <Button title="Create Task" onPress={handleCreate} color="#FF9800" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#008080",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    maxHeight: 150,
  },
  userButton: {
    padding: 10,
    marginBottom: 5,
    borderRadius: 6,
    backgroundColor: "#f5f5f5",
  },
  userButtonSelected: {
    backgroundColor: "#FF9800",
  },
  userText: {
    fontSize: 16,
    color: "#333",
  },
  noUsers: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default CreateModal;