import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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

      const res = await TodoService.updateTask(task._id, payload);

      const updatedTask = { ...task, ...res.data };
      onTaskUpdated(updatedTask);
      onClose();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>Edit Task</Text>

          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>
              Due Date: {dueDate.toLocaleString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="datetime"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDueDate(new Date(selectedDate)); // ✅ always Date
              }}
            />
          )}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.btn} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
              <Text style={styles.btnText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  dateText: { marginVertical: 10, color: "#333" },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  btn: { marginLeft: 15 },
  btnText: { color: "#006678", fontWeight: "bold" },
});
