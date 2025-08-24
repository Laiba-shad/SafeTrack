import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Button, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import TodoService from "../Services/TodoServices";

const CreateModal = ({ visible, onClose, onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [users, setUsers] = useState([]); // all users from backend
  const [assignedTo, setAssignedTo] = useState(""); // selected user id
  const [createdBy, setCreatedBy] = useState(""); // logged in admin id

  // fetch all users when modal opens
  useEffect(() => {
    if (visible) {
      loadUsers();
      loadLoggedInUser();
    }
  }, [visible]);

  const loadUsers = async () => {
    try {
      const res = await TodoService.getAllUsers();
      setUsers(res.data); // assuming backend returns [{_id, name, email}]
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
        assignedTo,  // 👈 this must be valid user _id
        createdBy,   // 👈 admin’s id
      };

      const res = await TodoService.createTodo(newTask);
      console.log("Task created:", res.data);
      onTaskCreated(); // reload tasks
      onClose();
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Create Task</Text>

        {/* Task title */}
        <TextInput
          placeholder="Task Title"
          value={title}
          onChangeText={setTitle}
          style={{ borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 8 }}
        />

        {/* Date Picker */}
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text>Select Due Date: {dueDate.toLocaleString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="datetime"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDueDate(selectedDate);
            }}
          />
        )}

        {/* Assign To Picker */}
        <Text style={{ marginTop: 10 }}>Assign To:</Text>
        <Picker
          selectedValue={assignedTo}
          onValueChange={(itemValue) => setAssignedTo(itemValue)}
        >
          <Picker.Item label="Select user" value="" />
          {users.map((u) => (
            <Picker.Item key={u._id} label={u.name || u.email} value={u._id} />
          ))}
        </Picker>

        {/* Buttons */}
        <Button title="Create Task" onPress={handleCreate} />
        <Button title="Cancel" color="red" onPress={onClose} />
      </View>
    </Modal>
  );
};

export default CreateModal;
