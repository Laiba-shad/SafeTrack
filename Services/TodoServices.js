import API from "../constants/api";

const TodoService = {
  getAllUsers: () => API.get("/all-users"),

  createTask: (data) =>
    API.post("/todos", data, {
      headers: { "Content-Type": "application/json" },
    }),

  updateTask: (id, data) => API.put(`/todos/${id}`, data),

  deleteTodo: (id) => API.delete(`/todos/${id}`),

getTodos: (userId) => API.get(`/todos?assignedTo=${userId}`),

  getTasksByAdmin: (adminId) => API.get(`/todos/admin/${adminId}`),
};

export default TodoService;
