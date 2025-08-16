import API from '../constants/api';

const TodoService = {
  getAllUsers: () => API.get('/all-users'),
  createTodo: (data) => API.post('/create', data),
  updateTodo: (id, data) => API.put(`/update/${id}`, data),
  deleteTodo: (id) => API.delete(`/delete/${id}`),
  getTodos: () => API.get('/todos'),
};

export default TodoService;