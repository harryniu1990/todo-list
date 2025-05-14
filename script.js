// 任务数据管理
class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    }

    addTask(text) {
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        this.tasks.unshift(task);
        this.save();
        return task;
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.save();
        }
    }

    deleteTask(id) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            this.save();
        }
    }

    save() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        return { total, completed };
    }
}

// UI 管理
class TodoUI {
    constructor(taskManager) {
        this.taskManager = taskManager;
        this.initializeElements();
        this.bindEvents();
        this.render();
    }

    initializeElements() {
        this.taskInput = document.getElementById('taskInput');
        this.taskList = document.getElementById('taskList');
        this.statsElement = document.getElementById('taskStats');
    }

    bindEvents() {
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleAddTask();
            }
        });

        document.getElementById('addTaskBtn').addEventListener('click', () => {
            this.handleAddTask();
        });
    }

    handleAddTask() {
        const text = this.taskInput.value.trim();
        if (text) {
            this.taskManager.addTask(text);
            this.taskInput.value = '';
            this.render();
            this.taskInput.focus();
        }
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            this.taskManager.toggleTask(task.id);
            this.render();
        });
        
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn delete-btn';
        deleteBtn.textContent = '删除';
        deleteBtn.addEventListener('click', () => {
            if (confirm('确定要删除这个任务吗？')) {
                this.taskManager.deleteTask(task.id);
                this.render();
            }
        });
        
        li.append(checkbox, span, deleteBtn);
        return li;
    }

    updateStats() {
        const { total, completed } = this.taskManager.getStats();
        this.statsElement.textContent = `总任务: ${total} | 已完成: ${completed}`;
    }

    render() {
        this.taskList.innerHTML = '';
        
        if (this.taskManager.tasks.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = '还没有任务，开始添加吧！';
            this.taskList.appendChild(emptyState);
        } else {
            this.taskManager.tasks.forEach(task => {
                this.taskList.appendChild(this.createTaskElement(task));
            });
        }
        
        this.updateStats();
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();
    const todoUI = new TodoUI(taskManager);
}); 