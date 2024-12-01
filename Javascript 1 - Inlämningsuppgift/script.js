document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://js1-todo-api.vercel.app/api/todos?apikey=e2700953-acf4-447b-bd81-9c5d593b4dd1'; 
    const API_KEY = 'e2700953-acf4-447b-bd81-9c5d593b4dd1'; 
    const todoList = document.getElementById('todo-list');
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const errorMessage = document.getElementById('error-message');


    const fetchTodos = async () => {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Error att fetching Todos!');
            const todos = await response.json();
            renderTodos(todos);
        } catch (error) {
            console.error('Error fetching:', error);
            todoList.innerHTML = '<li>Could not fetch Todos.</li>';
        }
    };


    const renderTodos = (todos) => {
        todoList.innerHTML = '';
        todos.forEach((todo) => {
            const li = document.createElement('li');
            li.textContent = todo.title;
            li.dataset.id = todo.id;


            if (todo.completed) {
                li.style.textDecoration = 'line-through';
            }

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Remove';
            deleteButton.style.marginLeft = '10px';
            deleteButton.addEventListener('click', () => deleteTodo(todo.id));
            li.appendChild(deleteButton);

            todoList.appendChild(li);
        });
    };


    const addTodo = async (title) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, completed: false }),
            });
            if (!response.ok) throw new Error('Could not add Todo!');
            const newTodo = await response.json();
            fetchTodos(); 
        } catch (error) {
            console.error('Error on adding:', error);
        }
    };


    const deleteTodo = async (id) => {
        try {
            const deleteUrl = `${API_URL.split('?')[0]}/${id}?apikey=${API_KEY}`;
            console.log('Deleting Todo at:', deleteUrl);
            const response = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorDetails = await response.json();
                console.error('Error Details:', errorDetails);
                throw new Error('Could not remove Todo!');
            }
            console.log('Todo removed successfully!');
            fetchTodos(); 
        } catch (error) {
            console.error('Error at removal:', error);
        }
    };
    


    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = todoInput.value.trim();
        if (!title) {
            errorMessage.style.display = 'block';
            return;
        }
        errorMessage.style.display = 'none';
        addTodo(title);
        todoInput.value = '';
    });

    fetchTodos();
});
