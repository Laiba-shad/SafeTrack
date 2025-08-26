// screens/TodoListScreen.js
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Ionicons from "react-native-vector-icons/Ionicons";
import CreateModal from "../../../components/CreateModal";
import EditModal from "../../../components/EditModal";
import TaskCard from "../../../components/TaskCard";
import { useAuth } from "../../../Server/context/AuthContext";
import { getData } from "../../../Server/utils/storage";
import TodoServices from "../../../Services/TodoServices";

const TodoListScreen = () => {
  const { appState } = useAuth();
  const [allTasks, setAllTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // For admin: all, pending, accepted, declined, completed

  // Load user data and tasks
  useEffect(() => {
    const loadUserData = async () => {
      const user = await getData("user");
      setUserInfo(user);
    };
    loadUserData();
  }, []);

  // Load tasks based on user role
  const loadTasks = async () => {
    if (!userInfo) return;
    setLoading(true);
    const userId = userInfo?.user?._id || userInfo?._id;
    const role = userInfo?.user?.role || userInfo?.role;
    
    try {
      let response;
      if (role === "admin") {
        // Admin sees all tasks they created
        response = await TodoServices.getTasksByAdmin(userId);
      } else {
        // Member sees only tasks assigned to them
        response = await TodoServices.getTodos(userId);
      }
      
      const raw = response.data.todos || response.data.tasks || response.data || [];
      const tasks = raw.map((task) => ({
        ...task,
        assignedToName:
          task.assignedTo?.username || 
          task.assignedTo?.email ||    
          task.assignedTo ||           
          "Unassigned",
      }));
      setAllTasks(tasks);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      Toast.show({
        type: "error",
        text1: "Failed to fetch tasks",
        text2: err.response?.data?.message || "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      loadTasks();
    }
  }, [userInfo]);

  // Filter by status
  useEffect(() => {
    let filteredTasks = allTasks;
    
    if (userInfo?.user?.role === userInfo?.role && userInfo?.user?.role === "admin") {
      // Admin filtering
      if (activeTab === "all") {
        filteredTasks = allTasks;
      } else {
        filteredTasks = allTasks.filter(task => task.status === activeTab);
      }
    } else {
      // Member filtering
      if (statusFilter === "completed") {
        filteredTasks = allTasks.filter(t => t.isCompleted);
      } else if (statusFilter === "incomplete") {
        filteredTasks = allTasks.filter(t => !t.isCompleted);
      } else {
        filteredTasks = allTasks;
      }
    }
    
    setFiltered(filteredTasks);
  }, [statusFilter, activeTab, allTasks, userInfo]);

  const handleDeleteTask = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await TodoServices.deleteTodo(id);
              Toast.show({ type: "success", text1: "Task deleted successfully" });
              loadTasks();
            } catch (error) {
              console.error("Delete error:", error);
              Toast.show({ 
                type: "error", 
                text1: "Failed to delete task",
                text2: error.response?.data?.message || "Please try again"
              });
            }
          }
        }
      ]
    );
  };

  const isAdmin = userInfo?.user?.role === userInfo?.role && userInfo?.user?.role === "admin";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>
          {isAdmin ? "📋 Task Management" : "📋 My Tasks"}
        </Text>
        <TouchableOpacity onPress={loadTasks} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#008080" />
        </TouchableOpacity>
      </View>

      {/* Admin Tabs */}
      {isAdmin && (
        <View style={styles.tabContainer}>
          {["all", "pending", "accepted", "declined", "completed"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Member Filter */}
      {!isAdmin && (
        <View style={styles.filterWrapper}>
          {["All", "Incomplete", "Completed"].map((label) => {
            const value = label.toLowerCase() === "all" ? "" : label.toLowerCase();
            const isActive = statusFilter === value;
            return (
              <TouchableOpacity
                key={value}
                style={[styles.filterBtn, isActive && styles.activeBtn]}
                onPress={() => setStatusFilter(value)}
              >
                <Text style={[styles.filterText, isActive && styles.activeText]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Stats summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{allTasks.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {allTasks.filter(t => t.status === 'completed').length}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {allTasks.filter(t => t.status === 'pending').length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {allTasks.filter(t => t.status === 'accepted').length}
          </Text>
          <Text style={styles.statLabel}>Accepted</Text>
        </View>
      </View>

      {/* Task list */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF9800" />
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onEdit={() => setEditTask(item)}
              onDelete={handleDeleteTask}
              currentUser={userInfo?.user || userInfo}
              onStatusChange={loadTasks}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-done-circle" size={64} color="#DDD" />
              <Text style={styles.emptyText}>No tasks found</Text>
              <Text style={styles.emptySubtext}>
                {isAdmin 
                  ? (activeTab !== "all" ? "Try changing your filters" : "Create a new task to get started")
                  : (statusFilter ? "Try changing your filters" : "No tasks assigned to you yet")
                }
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button (Admin only) */}
      {isAdmin && (
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => setShowCreate(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Modals */}
      <CreateModal
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        onTaskCreated={(newTask) => {
          setAllTasks((prev) => [...prev, newTask]);
          setShowCreate(false);
          Toast.show({
            type: "success",
            text1: "Task created successfully",
          });
        }}
        userInfo={userInfo}
      />
      
      {editTask && (
        <EditModal
          visible={!!editTask}
          onClose={() => setEditTask(null)}
          task={editTask}
          onTaskUpdated={(updatedTask) => {
            setAllTasks((prev) =>
              prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
            );
            setEditTask(null);
            Toast.show({
              type: "success",
              text1: "Task updated successfully",
            });
          }}
        />
      )}
      
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#008080",
  },
  refreshButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 14,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#FF9800",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
  filterWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 14,
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FF9800",
    backgroundColor: "#fff",
  },
  activeBtn: {
    backgroundColor: "#FF9800",
  },
  filterText: {
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },
  activeText: {
    color: "#fff",
    fontWeight: "700",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 2,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#008080",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9CA3AF",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#D1D5DB",
    marginTop: 8,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#FF9800",
    borderRadius: 50,
    padding: 18,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default TodoListScreen;