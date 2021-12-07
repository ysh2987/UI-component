let todos = [
  { id: 3, content: 'HTML', completed: false },
  { id: 2, content: 'CSS', completed: false },
  { id: 1, content: 'JavaScript', completed: false },
];

const $todoInput = document.querySelector('.new-todo');
const $todoList = document.querySelector('.todo-list');
const $clearCompleted = document.querySelector('.clear-completed');

const $toggleAll = document.getElementById('toggle-all');
const activeBtn = document.querySelectorAll('.filters > li > a');

// item수
const todoCount = () => {
  document.querySelector('.todo-count').textContent = todos.length ? `${todos.length} items left` : '0 item left';
};

// 초기 렌더
const render = todos => {
  $todoList.innerHTML = todos
    .map(
      ({ id, content, completed }) =>
        `<li data-id=${id}>
        <div class="view">
    <input type="checkbox" class="toggle" ${completed ? 'checked' : ''}/>
    <label>${content}</label>
    <button class="destroy"></button>
    </div>
    <input class="edit" value="${content}" />
    </li>`
    )
    .join('');
  todoCount();
};

// All Active Completed 선택 재 렌더 함수
const reRender = page => {
  if (page === 'All') render(todos);
  else if (page === 'Active') render([...todos].filter(todo => todo.completed === false));
  else if (page === 'Completed') render([...todos].filter(todo => todo.completed === true));
  todoCount();
};

// todo 생성
$todoInput.addEventListener('keyup', e => {
  if (!(e.key === 'Enter')) return;
  const $todoInputTrim = $todoInput.value.trim();
  if ($todoInputTrim === '') return;
  todos = [{ id: Math.max(...todos.map(todo => todo.id), 0) + 1, content: $todoInputTrim, completed: false }, ...todos];

  // All Active Completed 선택 렌더
  [...activeBtn].forEach(select => {
    if (select.classList.value === 'selected') reRender(select.textContent);
  });

  $todoInput.value = '';
});

// todo 삭제
const todosRemove = todoId => {
  todos = [...todos].filter(todo => todo.id !== +todoId);
};
$todoList.addEventListener('click', e => {
  if (!e.target.matches('.destroy')) return;
  if (!e.target.previousElementSibling.previousElementSibling.checked) return;
  $todoList.removeChild(e.target.parentNode.parentNode);
  todosRemove(e.target.parentNode.parentNode.dataset.id);
  todoCount();
});

// completed 저장
const toggleCompletedById = id => {
  todos = [...todos].map(todo => (todo.id === +id ? { ...todo, completed: !todo.completed } : todo));
};
$todoList.addEventListener('click', e => {
  if (!e.target.matches('.toggle')) return;
  toggleCompletedById(e.target.parentNode.parentNode.dataset.id);
});

// checkBox 전체 반전
$toggleAll.addEventListener('click', () => {
  if ($toggleAll.checked) todos = [...todos].map(todo => ({ ...todo, completed: true }));
  else todos = [...todos].map(todo => ({ ...todo, completed: false }));
  render(todos);
});

// 전체 삭제
$clearCompleted.addEventListener('click', () => {
  todos = [...todos].filter(todo => todo.completed === false);
  [...activeBtn].forEach(select => {
    if (select.classList.value === 'selected') reRender(select.textContent);
  });
});

// All Active Completed 선택
document.querySelector('.filters').addEventListener('click', e => {
  if (!e.target.matches('a')) return;
  [...activeBtn].forEach(select => {
    if (select.textContent === e.target.textContent) {
      select.classList.add('selected');
      reRender(e.target.textContent);
    } else select.classList.remove('selected');
  });
});

// todo 수정 input 활성화
$todoList.addEventListener('dblclick', e => {
  if (!e.target.matches('.view > label')) return;
  e.target.parentNode.parentNode.classList.add('editing');
});

// todo 수정 완료
$todoList.addEventListener('keyup', e => {
  if (!e.target.matches('.edit')) return;
  if (e.key === 'Enter') {
    todos = [...todos].map(todo =>
      todo.id === +e.target.parentNode.dataset.id ? { ...todo, content: e.target.value } : todo
    );
    e.target.parentNode.querySelector('label').textContent = e.target.value;
    e.target.parentNode.classList.remove('editing');
  }
});

// 초기 렌더링
window.addEventListener('DOMContentLoaded', () => {
  render(todos);
});
