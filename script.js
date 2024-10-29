document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const completedTasks = document.getElementById('completedTasks');
    let taskId = 0; // Para gerar IDs únicos para as tarefas

    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const taskItem = document.createElement('div');
            taskItem.className = 'draggable p-3 bg-white border border-gray-300 rounded shadow-md hover:bg-gray-50 transition duration-200 ease-in-out';
            taskItem.draggable = true;
            taskItem.id = `task-${taskId++}`; // Adiciona um ID único
            taskItem.setAttribute('ondragstart', 'drag(event)');

            // Cria o checkbox, mas o deixa invisível inicialmente
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox hidden';
            checkbox.addEventListener('change', () => {
                moveToCompleted(taskItem, checkbox.checked);
            });

            // Cria um container para o texto da tarefa
            const textContainer = document.createElement('span');
            textContainer.textContent = taskText;
            textContainer.className = 'task-text ml-2';

            // Adiciona o checkbox e o texto ao item da tarefa
            taskItem.appendChild(checkbox);
            taskItem.appendChild(textContainer);

            // Adiciona a tarefa à lista de tarefas
            taskList.appendChild(taskItem);
            taskInput.value = '';
            taskInput.focus(); // Foca novamente no input
        }
    };

    // Adiciona a tarefa ao clicar no botão
    addTaskBtn.addEventListener('click', addTask);

    // Adiciona a tarefa ao pressionar Enter
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    window.allowDrop = (ev) => {
        ev.preventDefault();
    };

    window.drag = (ev) => {
        ev.dataTransfer.setData('text', ev.target.textContent);
        ev.dataTransfer.setData('id', ev.target.id);
        ev.dataTransfer.setData('source', ev.target.parentNode.id); // Guarda a origem
    };

    window.drop = (ev) => {
        ev.preventDefault();
        const taskId = ev.dataTransfer.getData('id');
        const sourceId = ev.dataTransfer.getData('source');
        const task = document.getElementById(taskId);

        // Remove a tarefa da lista original se for de `taskList`
        if (sourceId === 'taskList') {
            task.remove();
        } else {
            // Remove a tarefa da lista do quadrante de origem
            document.getElementById(sourceId).removeChild(task);
        }

        // Adiciona a tarefa ao quadrante onde foi solta
        const target = ev.target.closest('.flex-1');
        if (target) {
            const checkbox = task.querySelector('.task-checkbox');
            checkbox.classList.remove('hidden'); // Torna o checkbox visível
            target.appendChild(task);
        }
    };

    function moveToCompleted(taskItem, isChecked) {
        if (isChecked) {
            taskItem.classList.add('completed-task'); // Adiciona a classe para tarefas concluídas
            taskItem.classList.remove('bg-white')
            completedTasks.appendChild(taskItem);
        } else {
            taskItem.classList.remove('completed-task'); // Remove a classe se o checkbox for desmarcado
            taskList.appendChild(taskItem);
        }
    }
});
