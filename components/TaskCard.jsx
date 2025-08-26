// components/TaskCard.js
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TodoService from "../Services/TodoServices";

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, currentUser }) => {
  const assignedUser =
    typeof task.assignedTo === "object"
      ? task.assignedTo?.username
      : task.assignedTo
      ? task.assignedTo
      : "Unassigned";

  const handleAccept = async () => {
    try {
      await TodoService.updateTaskStatus(task._id, "accepted");
      onStatusChange();
    } catch (err) {
      console.error("Error accepting task:", err);
    }
  };

  const handleDecline = async () => {
    try {
      await TodoService.updateTaskStatus(task._id, "declined");
      onStatusChange();
    } catch (err) {
      console.error("Error declining task:", err);
    }
  };

  const handleToggleStatus = async () => {
    try {
      await TodoService.updateTodo(task._id, {
        isCompleted: !task.isCompleted,
      });
      onStatusChange();
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  // Check if the current user is the assigned user
  const isAssignedUser = currentUser && currentUser._id === task.assignedTo;
  
  // Check if the current user is the creator (admin)
  const isCreator = currentUser && currentUser._id === task.createdBy;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={[styles.statusBadge, getStatusStyle(task.status)]}>
          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </Text>
      </View>
      
      <Text style={styles.desc}>{task.description}</Text>
      <Text style={styles.date}>
        Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : "N/A"}
      </Text>
      <Text style={styles.assigned}>Assigned To: {assignedUser}</Text>
      
      {/* Status-specific actions */}
      {isAssignedUser && task.status === 'pending' && (
        <View style={styles.statusActions}>
          <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Completion toggle for accepted tasks */}
      {isAssignedUser && (task.status === 'accepted' || task.status === 'completed') && (
        <TouchableOpacity 
          style={[styles.completeButton, task.isCompleted && styles.completedButton]} 
          onPress={handleToggleStatus}
        >
          <Text style={styles.buttonText}>
            {task.isCompleted ? "Mark Incomplete" : "Mark Complete"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Admin actions */}
      {isCreator && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit}>
            <Text style={styles.edit}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(task._id)}>
            <Text style={styles.delete}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'pending':
      return { backgroundColor: '#FFA500' };
    case 'accepted':
      return { backgroundColor: '#4CAF50' };
    case 'declined':
      return { backgroundColor: '#F44336' };
    case 'completed':
      return { backgroundColor: '#2196F3' };
    default:
      return { backgroundColor: '#9E9E9E' };
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    margin: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontWeight: "bold", color: "#006678", fontSize: 16 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontWeight: "bold",
    color: "#fff",
    overflow: "hidden",
  },
  desc: { marginVertical: 8, color: "#444" },
  date: { fontStyle: "italic", color: "#666", marginBottom: 4 },
  assigned: { color: "#008080", fontWeight: "600" },
  statusActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
  },
  declineButton: {
    backgroundColor: "#F44336",
    padding: 8,
    borderRadius: 5,
  },
  completeButton: {
    backgroundColor: "#FF9800",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
  },
  completedButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  edit: { marginRight: 20, color: "#006678", fontWeight: "bold" },
  delete: { color: "#D9534F", fontWeight: "bold" },
});

export default TaskCard;