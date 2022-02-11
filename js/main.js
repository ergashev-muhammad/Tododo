// Getting all variables 

const elTodoForm = findElement(".todo__form");
const elTodoAddInput = findElement(".todo__add-input");
const elTodoList = findElement(".todos");
const elTodoTemplate = findElement("#todo-template").content;
const elButtons = findElement(".buttons");
const elAllButtonInfo = findElement(".button-all-text");
const elCompletedButtonInfo = findElement(".button-completed-text");
const elUncompletedButtonInfo = findElement(".button-uncompleted-text");

//  Global todos array

let todos = JSON.parse(window.localStorage.getItem("todos")) || [];

// Render info buttons

const renderInfo = (array) => {
    
    elAllButtonInfo.textContent = array.length;
    
    const completedTodos = array.filter(todo => todo.isCompleted);
    
    elCompletedButtonInfo.textContent = completedTodos.length;
    elUncompletedButtonInfo.textContent = array.length - completedTodos.length;
};

// Render todos

const renderTodos = (array, node) => {
    node.innerHTML = null;
    
    // Render buttons
    
    renderInfo(array);
    
    // Creating fragment
    
    const todosFragment = document.createDocumentFragment();
    
    // Clone template
    
    array.forEach((todo) => {
        const todoTemplate = elTodoTemplate.cloneNode(true);
        
        // Getting elements from template
        
        const elTodoTitle  = findElement(".todo__title", todoTemplate);
        const elTodoInput = findElement(".todo__check-input", todoTemplate);
        const elTodoButton = findElement(".todo__delete-btn", todoTemplate)
        
        // Assigning todo's values
        
        elTodoTitle.textContent = todo.title;
        elTodoInput.dataset.todoId = todo.id;
        elTodoButton.dataset.todoId = todo.id;
        
        // Checking completed and uncompleted todos
        
        if(todo.isCompleted) {
            elTodoInput.checked = true;
            elTodoTitle.style.textDecoration = "line-through";
        } else {
            elTodoTitle.checked = false;
        }
        
        // Appending to Fragment
        
        todosFragment.appendChild(todoTemplate);
    });
    
    // Appending to element from DOM
    
    node.appendChild(todosFragment);
};

renderTodos(todos, elTodoList);

// Submit todos form

elTodoForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    
    const newTodoTitle = elTodoAddInput.value.trim();
    
    // Early return
    
    if(!newTodoTitle) {
        return;
    }
    
    // Adding new todo
    
    const newTodo = {
        id: todos[todos.length - 1]?.id + 1 || 0,
        title: newTodoTitle,
        isCompleted: false
    };
    
    todos.push(newTodo);
    
    renderTodos(todos, elTodoList);
    
    // Adding local storage
    
    window.localStorage.setItem("todos", JSON.stringify(todos));
    
    // Clearing input after new todo
    
    elTodoAddInput.value = null;
});

//  Delete Button

const handleDeleteTodo = (id, array) => {
    
    // Index
    
    const foundTodoIndex = array.findIndex((item) => item.id === id);
    
    // Removing clicked element
    
    array.splice(foundTodoIndex, 1)
    
    renderTodos(array, elTodoList);
    
    // Adding local storage
    
    window.localStorage.setItem("todos", JSON.stringify(array));
    
};

// Check Input

const handleCheckTodo = (id, array) => {
    
    const foundTodo = array.find((item) => item.id === id); 
    
    // Changing object from array of changed element
    
    foundTodo.isCompleted = !foundTodo.isCompleted;
    
    renderTodos(array, elTodoList);
    
    // Adding local storage
    
    window.localStorage.setItem("todos", JSON.stringify(array));
    
};

// Listening list of todos

elTodoList.addEventListener("click", (evt) => {
    
    // Delete button clicked 
    
    if(evt.target.matches(".todo__delete-btn")) {
        const clickedTodoId = Number(evt.target.dataset.todoId);
        
        handleDeleteTodo(clickedTodoId, todos);
    }
    
    // Check input clicked
    
    if(evt.target.matches(".todo__check-input")) {
        const changedTodoId = Number(evt.target.dataset.todoId);
        
        handleCheckTodo(changedTodoId, todos);
    }
});


// Buttons

elButtons.addEventListener("click", (evt) => {
    
    // Button all
    
    if (evt.target.matches(".button-all")) {
        
        renderTodos(todos, elTodoList);
    } 
    
    // Button completed
    
    if (evt.target.matches(".button-completed")) {  
        
        const completedTodos = todos.filter((todo) => todo.isCompleted);
        
        renderTodos(completedTodos, elTodoList)
    } 
    
    // Button uncompleted
    
    if (evt.target.matches(".button-uncompleted")) {
        
        const uncompletedTodos = todos.filter((todo) => !todo.isCompleted);
        
        renderTodos(uncompletedTodos, elTodoList) 
    }
    
    // Button clear
    
    if (evt.target.matches(".button-clear")) {
        
        window.localStorage.removeItem("todos");
        
        // Empty todo
        
        todos = [];
        
        renderTodos(todos, elTodoList)   
    }
    
});

// Modal

const elModalButton = findElement(".btn-modal");
const elModal = findElement(".modal");

elModalButton.addEventListener("click", () => {
    elModal.classList.add("modal--open")
});

elModal.addEventListener("click", (evt) => {
    if(evt.target.matches(".modal__close-btn") || evt.target.matches(".modal")) {
        evt.currentTarget.classList.remove("modal--open");
    }
});
