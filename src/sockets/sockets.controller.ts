import { Server } from 'socket.io';
import Todo from '../models/Todo';

class SocketConnection {
  #io: Server;
  constructor(io: Server) {
    this.#io = io;
    this.socketEvents();
  }

  socketEvents() {
    this.#io.on('connection', async (socket) => {
      console.log('A user connected');

      // get all the current todos
      const allTodos = await Todo.find({}).sort({
        createdAt: 'desc',
      });

      this.#io.emit('getTodos', allTodos);

      // create a new todo in the database
      socket.on('createTodo', async (payload) => {
        if (!payload.title) {
          return;
        }
        await Todo.create(payload);

        const allTodos = await Todo.find({}).sort({
          createdAt: 'desc',
        });
        this.#io.emit('getTodos', allTodos);
      });

      // delete a todo from the database
      socket.on('deleteTodo', async (payload) => {
        if (!payload.todoId) {
          return;
        }

        const { todoId } = payload;
        await Todo.findByIdAndDelete(todoId);

        const allTodos = await Todo.find({}).sort({
          createdAt: 'desc',
        });
        this.#io.emit('getTodos', allTodos);
      });

      socket.on('updateTodo', async (payload) => {
        if (!payload.id) {
          return;
        }
        await Todo.findByIdAndUpdate(payload.id, {
          title: payload.title,
        });

        const allTodos = await Todo.find({}).sort({
          createdAt: 'desc',
        });
        this.#io.emit('getTodos', allTodos);
      });
    });
  }
}

export default SocketConnection;
