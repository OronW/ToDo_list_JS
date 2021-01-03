"use strict";

//Selectors

const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

//Event listeners

document.addEventListener("DOMContentLoaded", updateListName);
document.addEventListener("DOMContentLoaded", getTodosFromLocalStorage);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("click", filterTodo);

//Functions

function addTodo(event) {
  event.preventDefault();

  addTodoStructure();
  //Clear doto input value
  todoInput.value = "";
}

function deleteCheck(e) {
  const item = e.target;
  //Delete todo
  if (item.classList[0] === "trash-btn") {
    const todo = item.parentElement;
    //Animation
    todo.classList.add("fall");
    removeLocalTodos(todo);
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }

  //Mark as checked
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    const todos = JSON.parse(localStorage.getItem("todos"));
    const todosStatus = JSON.parse(localStorage.getItem("todosStatus"));
    const todoText = todo.children[0].innerText;

    todo.classList.toggle("completed");

    //Toggle status
    todosStatus[todos.indexOf(todoText)] = !todosStatus[
      todos.indexOf(todoText)
    ];
    localStorage.setItem("todosStatus", JSON.stringify(todosStatus));
  }
}

function filterTodo(event) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    switch (event.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
}

function saveLocalTodos(todo) {
  //Check if a todo list already exist
  let todos;
  let todosStatus;
  if (localStorage.getItem("todos") === null) {
    todos = [];
    todosStatus = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
    todosStatus = JSON.parse(localStorage.getItem("todosStatus"));
  }
  todos.push(todo);
  todosStatus.push(false);

  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("todosStatus", JSON.stringify(todosStatus));
}

function getTodosFromLocalStorage() {
  let todos;
  let todosStatus;
  if (localStorage.getItem("todos") === null) {
    todos = [];
    todosStatus = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
    todosStatus = JSON.parse(localStorage.getItem("todosStatus"));
  }
  todos.forEach(function (todo) {
    addTodoStructure(true, todo, todosStatus[todos.indexOf(todo)]);

    console.log(todo.classList);

    //Check if marked
    // if (todosStatus[todos.indexOf(todo)]) {
    //   todo.classList.toggle("completed");
    // }
  });
}

function removeLocalTodos(todo) {
  let todos;
  let todosStatus;

  if (localStorage.getItem("todos") === null) {
    todos = [];
    todosStatus = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
    todosStatus = JSON.parse(localStorage.getItem("todosStatus"));
  }

  const todoText = todo.children[0].innerText;
  const todoIndex = todos.indexOf(todoText);

  todos.splice(todoIndex, 1);
  todosStatus.splice(todoIndex, 1);

  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("todosStatus", JSON.stringify(todosStatus));
}

function updateListName() {
  //Prompt
  let name = prompt("Enter your name:");
  let el = document.getElementById("list-name");
  el.innerText = name ? `${name}'s Todo List` : "Your Todo List";
}

function addTodoStructure(
  localStorageFlag = false,
  todo = null,
  isMarked = false
) {
  //Todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  if (isMarked) todoDiv.classList.toggle("completed");

  //Create LI
  const newTodo = document.createElement("li");
  if (localStorageFlag) {
    newTodo.innerText = todo;
  } else {
    newTodo.innerText = todoInput.value;
  }
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);

  if (!localStorageFlag)
    // Add list to localstorage
    saveLocalTodos(todoInput.value);

  //Check mark button
  const completedButton = document.createElement("button");
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);

  const trashButton = document.createElement("button");
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);

  //Append to list
  todoList.appendChild(todoDiv);
}
