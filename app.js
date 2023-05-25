// Клас, що представляє окрему справу
class TodoItem {
  constructor(description) {
    this.description = description;
    this.completed = false;
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }
}

// Клас, що представляє список справ для кожного дня
class DailyTodoList {
  constructor(day) {
    this.day = day;
    this.todos = [];
  }

  addTodo(description) {
    const todo = new TodoItem(description);
    this.todos.push(todo);
  }

  deleteTodo(index) {
    this.todos.splice(index, 1);
  }

  toggleTodo(index) {
    const todo = this.todos[index];
    todo.toggleCompleted();
  }
}

// Клас, що містить список справ для всіх днів
class WeeklyTodoList {
  constructor() {
    this.dailyLists = [];
  }

  addDailyList(day) {
    const dailyList = new DailyTodoList(day);
    this.dailyLists.push(dailyList);
  }

  getDailyList(day) {
    return this.dailyLists.find(dailyList => dailyList.day === day);
  }
}

// Отримання посилань на HTML-елементи
const daySelect = document.getElementById('daySelect');
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');

// Створення екземпляра списку справ для всіх днів
const weeklyTodoList = new WeeklyTodoList();

// Обробник події для вибору дня тижня
daySelect.addEventListener('change', (event) => {
  const selectedDay = event.target.value;

  // Перевірка, чи вже існує список справ для вибраного дня
  let dailyList = weeklyTodoList.getDailyList(selectedDay);
  if (!dailyList) {
    // Якщо список ще не існує, додати його
    weeklyTodoList.addDailyList(selectedDay);
    dailyList = weeklyTodoList.getDailyList(selectedDay);
  }

  // Оновити список справ для вибраного дня у DOM
  renderTodoList(dailyList);
});

// Функція для оновлення списку справ у DOM
function renderTodoList(dailyList) {
  taskList.innerHTML = '';

  dailyList.todos.forEach((todo, index) => {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;

    const span = document.createElement('span');
    span.textContent = todo.description;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Видалити';

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteButton);

    taskList.appendChild(li);

    // Обробники подій для відмітки як виконаної та видалення справи
    checkbox.addEventListener('change', () => {
      dailyList.toggleTodo(index);
    });

    deleteButton.addEventListener('click', () => {
      dailyList.deleteTodo(index);
      renderTodoList(dailyList);
    });
  });
}

// Обробник події для додавання нової справи
addButton.addEventListener('click', () => {
  const description = taskInput.value.trim();
  if (description !== '') {
    const selectedDay = daySelect.value;
    const dailyList = weeklyTodoList.getDailyList(selectedDay);
    dailyList.addTodo(description);
    renderTodoList(dailyList);
    taskInput.value = '';
  }
});