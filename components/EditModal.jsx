// components/EditModal.jsx
import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import TodoService from "../Services/TodoServices";

const EditModal = ({ visible, onClose, task, onTaskUpdated }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setDueDate(task.dueDate ? new Date(task.dueDate) : new Date());
    }
  }, [task]);

  const handleUpdate = async () => {
    try {
      const payload = {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      };
      const res = await TodoService.updateTodo(task._id, payload);
      const updatedTask = { ...task, ...res.data };
      onTaskUpdated(updatedTask);
      onClose();
    } catch (err) {
      console.error("Error updating task:", err);
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
          <Text style={styles.title}>Edit Task</Text>
          
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Task Title"
          />
          
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            multiline
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
          
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} color="#888" />
            <Button title="Update" onPress={handleUpdate} color="#FF9800" />
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default EditModal;