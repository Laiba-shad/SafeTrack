import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TodoService from "../Services/TodoServices";

const TaskCard = ({ task, onEdit, onDelete, onStatusToggle }) => {
  const assignedUser =
    typeof task.assignedTo === "object"
      ? task.assignedTo?.username
      : task.assignedTo
      ? task.assignedTo
      : "Unassigned";

  const handleToggleStatus = async () => {
    try {
      const res = await TodoService.updateTask(task._id, {
        isCompleted: !task.isCompleted,
      });
      onStatusToggle({ ...task, ...res.data });
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>
        <Text
          style={[
            styles.status,
            task.isCompleted ? styles.completed : styles.incomplete,
          ]}
        >
          {task.isCompleted ? "Completed" : "Incomplete"}
        </Text>
      </View>

      <Text style={styles.desc}>{task.description}</Text>
      <Text style={styles.date}>
        Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : "N/A"}
      </Text>
      <Text style={styles.assigned}>Assigned To: {assignedUser}</Text>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.edit}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(task._id)}>
          <Text style={styles.delete}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleToggleStatus}>
          <Text style={styles.toggle}>
            {task.isCompleted ? "Mark Incomplete" : "Mark Complete"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TaskCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    margin: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  header: { flexDirection: "row", justifyContent: "space-between" },
  title: { fontWeight: "bold", color: "#006678", fontSize: 16 },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontWeight: "bold",
    color: "#fff",
    overflow: "hidden",
  },
  completed: { backgroundColor: "#FFA500" },
  incomplete: { backgroundColor: "#00CED1" },
  desc: { marginVertical: 8, color: "#444" },
  date: { fontStyle: "italic", color: "#666", marginBottom: 4 },
  assigned: { color: "#008080", fontWeight: "600" },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    flexWrap: "wrap",
  },
  edit: { marginRight: 20, color: "#006678", fontWeight: "bold" },
  delete: { marginRight: 20, color: "#D9534F", fontWeight: "bold" },
  toggle: { color: "#FF7F50", fontWeight: "bold" },
});
