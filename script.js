// ---------- 1. Greeting on the Home page (DOM manipulation) ----------
const greeting = document.getElementById('greeting');
if (greeting) {
  const hour = new Date().getHours();
  const part = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  greeting.textContent = part + '! Welcome to my portfolio.';
}

// ---------- 2. Academic Planner (arrays, functions, events, dynamic updates) ----------
const taskForm = document.getElementById('task-form');
if (taskForm) {
  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');
  const errorBox = document.getElementById('task-error');
  const count = document.getElementById('task-count');
  let tasks = [];                                   // array of {text, done}

  function saveTasks() {
    try { localStorage.setItem('tasks', JSON.stringify(tasks)); } catch (e) { /* storage unavailable */ }
  }
  function loadTasks() {
    try { tasks = JSON.parse(localStorage.getItem('tasks')) || []; } catch (e) { tasks = []; }
  }
  function renderTasks() {                          // rebuilds the list from the array
    list.innerHTML = '';
    tasks.forEach(function (task, index) {
      const li = document.createElement('li');
      if (task.done) li.classList.add('done');
      const span = document.createElement('span');
      span.textContent = task.text;
      const box = document.createElement('div');
      const doneBtn = document.createElement('button');
      doneBtn.textContent = task.done ? 'Undo' : 'Complete';
      doneBtn.dataset.action = 'toggle';
      doneBtn.dataset.index = index;
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.className = 'del';
      delBtn.dataset.action = 'delete';
      delBtn.dataset.index = index;
      box.append(doneBtn, delBtn);
      li.append(span, box);
      list.appendChild(li);
    });
    const left = tasks.filter(function (t) { return !t.done; }).length;
    count.textContent = tasks.length + ' task(s), ' + left + ' still to do';
  }
  function addTask(text) { tasks.push({ text: text, done: false }); saveTasks(); renderTasks(); }

  taskForm.addEventListener('submit', function (event) {   // event handling
    event.preventDefault();
    const text = input.value.trim();
    if (text === '') { errorBox.textContent = 'Please type a task first.'; return; }
    errorBox.textContent = '';
    addTask(text);
    input.value = '';
  });
  list.addEventListener('click', function (event) {        // one listener for all buttons
    const action = event.target.dataset.action;
    if (!action) return;
    const index = Number(event.target.dataset.index);
    if (action === 'toggle') tasks[index].done = !tasks[index].done;
    if (action === 'delete') tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  });
  loadTasks();
  renderTasks();
}

// ---------- 3. Contact form validation ----------
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  function setError(id, message) { document.getElementById(id + '-error').textContent = message; }

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();
    const success = document.getElementById('form-success');
    let valid = true;
    success.textContent = '';

    if (name === '') { setError('name', 'Name is required.'); valid = false; } else setError('name', '');

    if (email === '') { setError('email', 'Email is required.'); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('email', 'Enter a valid email address.'); valid = false; }
    else setError('email', '');

    if (phone === '') { setError('phone', 'Phone number is required.'); valid = false; }
    else if (!/^[0-9]+$/.test(phone)) { setError('phone', 'Phone number must contain digits only.'); valid = false; }
    else setError('phone', '');

    if (message === '') { setError('message', 'Message is required.'); valid = false; } else setError('message', '');

    if (valid) { success.textContent = 'Thank you, ' + name + '! Your message was submitted.'; contactForm.reset(); }
  });
}
