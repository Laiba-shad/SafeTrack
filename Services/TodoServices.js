import API from "../constants/api";

const TodoService = {
  createTodo: (payload) => API.post("/todos", payload),
  getTodos: (userId) => API.get(`/todos?assignedTo=${userId}`),
  updateTodo: (id, payload) => API.put(`/todos/${id}`, payload),
  deleteTodo: (id) => API.delete(`/todos/${id}`),
  getTasksByAdmin: (adminId) => API.get(`/admin-tasks/${adminId}`),
  getAllUsers: () => API.get("/all-users"),
  updateTaskStatus: (id, status) => API.put(`/todos/${id}/status`, { status }),
};

export default TodoService;