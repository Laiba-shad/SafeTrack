import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import CreateModal from '../../components/CreateModal';
import EditModal from '../../components/EditModal';
import TaskCard from '../../components/TaskCard';
import { getData } from '../../Server/utils/storage';
import TodoServices from '../../Services/TodoServices';

const TodoListScreen = () => {
 const [allTasks, setAllTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const loadTasks = async () => {
    //setloading will load spinner
    setLoading(true);
    //getDATA will get the user data from storage or database
    const user = await getData('todoapp');
    if (!user?.user?.id) {
      Toast.show({ type: 'error', text1: 'User not found' });
      setLoading(false);
      setAllTasks([]);
setFiltered([]);

      
      return;
    }
    try {
      const { data } = await TodoServices.getAllTodo(user.user.id);
      setAllTasks(data.todos);
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to fetch tasks' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (statusFilter === 'completed') {
      setFiltered(allTasks.filter(t => t.isCompleted));
    } else if (statusFilter === 'incomplete') {
      setFiltered(allTasks.filter(t => !t.isCompleted));
    } else {
      setFiltered(allTasks);
    }
  }, [statusFilter, allTasks]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Tasks</Text>

     <View style={styles.filterWrapper}>
  {['All', 'Incomplete', 'Completed'].map((label) => {
    const value = label.toLowerCase() === 'all' ? '' : label.toLowerCase();
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

      {loading ? (
        <ActivityIndicator size="large" color="#FF9800" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onEdit={() => setEditTask(item)}
              onDelete={async (id) => {
                await TodoServices.deleteTodo(id);
                Toast.show({ type: 'success', text1: 'Deleted' });
                loadTasks();
              }}
            />
          )}
        />
      )}

      {/* Floating Action Button to Add Task */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowCreate(true)}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

<CreateModal
 visible={showCreate}
onClose={() => setShowCreate(false)}
 onTaskCreated={loadTasks}
/>

      {editTask && (
        <EditModal
          visible={!!editTask}
          onClose={() => setEditTask(null)}
          task={editTask}
          onUpdated={loadTasks}
        />
      )}
      <Toast />
    </View>
  );
};

export default TodoListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA', // light teal
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796B', // deep teal
    marginBottom: 12,
  },
filterWrapper: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginBottom: 16,
},
filterBtn: {
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 20,
  backgroundColor: '#B2EBF2', // lighter teal
},
activeBtn: {
  backgroundColor: '#00796B', // deep teal
},
filterText: {
  color: '#00796B',
  fontWeight: '500',
},
activeText: {
  color: '#fff',
},
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#FF9800', // orange
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
});
