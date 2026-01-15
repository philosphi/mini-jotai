/**
 * Todo list example - more complex state management
 * 
 * This demonstrates:
 * - Managing arrays in atoms
 * - Multiple derived atoms working together
 * - Write-only atoms (actions)
 * - Filtering and computed values
 */

import { atom, useAtom, useAtomValue, useSetAtom } from 'mini-jotai';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type Filter = 'all' | 'active' | 'completed';

// Base atoms
const todosAtom = atom<Todo[]>([
  { id: 1, text: 'Learn Jotai internals', completed: false },
  { id: 2, text: 'Build mini-jotai', completed: false },
  { id: 3, text: 'Understand state management', completed: true },
]);

const filterAtom = atom<Filter>('all');

// Derived atom - filtered todos
const filteredTodosAtom = atom((get) => {
  const todos = get(todosAtom);
  const filter = get(filterAtom);
  
  if (filter === 'active') return todos.filter((t) => !t.completed);
  if (filter === 'completed') return todos.filter((t) => t.completed);
  return todos;
});

// Derived atom - stats
const todoStatsAtom = atom((get) => {
  const todos = get(todosAtom);
  return {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    active: todos.filter((t) => !t.completed).length,
  };
});

// Write-only atom - add todo action
const addTodoAtom = atom(
  null,
  (get, set, text: string) => {
    const todos = get(todosAtom);
    const newTodo: Todo = {
      id: Math.max(0, ...todos.map((t) => t.id)) + 1,
      text,
      completed: false,
    };
    set(todosAtom, [...todos, newTodo]);
  }
);

// Write-only atom - toggle todo action
const toggleTodoAtom = atom(
  null,
  (get, set, id: number) => {
    const todos = get(todosAtom);
    set(
      todosAtom,
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }
);

// Write-only atom - remove todo action  
const removeTodoAtom = atom(
  null,
  (get, set, id: number) => {
    const todos = get(todosAtom);
    set(todosAtom, todos.filter((todo) => todo.id !== id));
  }
);

function TodoInput() {
  const addTodo = useSetAtom(addTodoAtom);
  const [text, setText] = atom('');
  const [inputValue, setInputValue] = useAtom(text);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="What needs to be done?"
        style={{ width: '300px' }}
      />
      <button type="submit">Add</button>
    </form>
  );
}

function TodoList() {
  const todos = useAtomValue(filteredTodosAtom);
  const toggleTodo = useSetAtom(toggleTodoAtom);
  const removeTodo = useSetAtom(removeTodoAtom);

  return (
    <div>
      {todos.map((todo) => (
        <div
          key={todo.id}
          style={{
            padding: '0.5rem',
            margin: '0.5rem 0',
            background: '#f9f9f9',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span
            style={{
              flex: 1,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#999' : '#333',
            }}
          >
            {todo.text}
          </span>
          <button onClick={() => removeTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

function TodoFilters() {
  const [filter, setFilter] = useAtom(filterAtom);

  return (
    <div>
      <button
        onClick={() => setFilter('all')}
        style={{ background: filter === 'all' ? '#0056b3' : '#007bff' }}
      >
        All
      </button>
      <button
        onClick={() => setFilter('active')}
        style={{ background: filter === 'active' ? '#0056b3' : '#007bff' }}
      >
        Active
      </button>
      <button
        onClick={() => setFilter('completed')}
        style={{ background: filter === 'completed' ? '#0056b3' : '#007bff' }}
      >
        Completed
      </button>
    </div>
  );
}

function TodoStats() {
  const stats = useAtomValue(todoStatsAtom);

  return (
    <div className="info-box">
      <strong>Stats:</strong> {stats.total} total, {stats.active} active,{' '}
      {stats.completed} completed
    </div>
  );
}

export function TodoExample() {
  return (
    <div className="example-section">
      <h2>3️⃣ Todo List (Complex State)</h2>
      <p>
        This example shows how to manage complex state with multiple atoms,
        derived values, and write-only action atoms.
      </p>
      
      <TodoInput />
      <TodoFilters />
      <TodoList />
      <TodoStats />
    </div>
  );
}

