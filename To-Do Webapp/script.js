const motivation = [
    "Nanda Prasad, clarity is the foundation of execution.",
    "Small wins lead to major breakthroughs. Stay focused.",
    "The standard is excellence. Do not settle.",
    "Efficiency is doing things right; effectiveness is doing the right things.",
    "Mission Control: Awaiting your command, Nanda."
];

let tasks = JSON.parse(localStorage.getItem('NandaCobalt_v3')) || [];

function rotateQuote() {
    const qBox = document.getElementById('dynamicQuote');
    if(!qBox) return;
    qBox.style.opacity = 0;
    setTimeout(() => {
        qBox.innerText = `"${motivation[Math.floor(Math.random() * motivation.length)]}"`;
        qBox.style.opacity = 1;
    }, 500);
}

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    document.getElementById('clock').innerText = `${hours}:${minutes}:${seconds} ${ampm}`;
    document.getElementById('date').innerText = now.toDateString().toUpperCase();
}

// --- UPDATED RENDER ENGINE ---
function renderTasks() {
    const pList = document.getElementById('pendingList');
    const cList = document.getElementById('completedList');
    
    pList.innerHTML = ""; 
    cList.innerHTML = "";

    if (tasks.filter(t => !t.done).length === 0) {
        pList.innerHTML = `<div class="empty-state">ALL SYSTEMS CLEAR. AWAITING COMMANDS.</div>`;
    }

    tasks.forEach(t => {
        const priorityColor = t.priority === 'high' ? '#ff4d4d' : (t.priority === 'med' ? '#007AFF' : '#555');
        const li = document.createElement('li');
        li.className = 'task-item';
        li.style.borderLeft = `4px solid ${priorityColor}`;
        
        // Added Created Timestamp and Edit Button to the HTML template
        li.innerHTML = `
            <div style="flex: 1;">
                <p style="${t.done ? 'text-decoration: line-through; opacity: 0.3' : ''}; font-weight: 500; font-size: 1rem;">${t.text}</p>
                <div style="display: flex; gap: 10px; align-items: center; margin-top: 4px;">
                    <small style="color: ${priorityColor}; font-size: 0.65rem; font-weight: 700; letter-spacing: 1px;">${t.priority.toUpperCase()}</small>
                    <small style="color: #444; font-size: 0.6rem; font-weight: 600;">INITIATED: ${t.timestamp}</small>
                </div>
            </div>
            <div class="actions">
                ${!t.done ? `<button onclick="editTask(${t.id})" title="Edit Objective" style="background:none; border:none; color:#888; cursor:pointer; font-size: 1rem; margin-right: 5px;">✎</button>` : ''}
                <button onclick="toggle(${t.id})" title="Complete Task" style="background:none; border:none; color:white; cursor:pointer; font-size: 1.2rem;">${t.done ? '↩' : '✓'}</button>
                <button onclick="delTask(${t.id})" title="Delete Task" class="btn-delete">✕</button>
            </div>
        `;
        t.done ? cList.appendChild(li) : pList.appendChild(li);
    });

    updateStats();
    localStorage.setItem('NandaCobalt_v3', JSON.stringify(tasks));
}

function updateStats() {
    const done = tasks.filter(t => t.done).length;
    const prog = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100);
    document.getElementById('momentumFill').style.width = prog + "%";
    document.getElementById('percText').innerText = prog + "% PERFORMANCE";
    document.getElementById('pCount').innerText = tasks.filter(t => !t.done).length;
}

// --- UPDATED ADD TASK (Satisfies Bonus Complexity) ---
function addTask() {
    const input = document.getElementById('taskInput');
    if (!input.value.trim()) return;

    // Added 'timestamp' property to task object
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    tasks.push({ 
        id: Date.now(), 
        text: input.value, 
        priority: document.getElementById('priority').value, 
        done: false,
        timestamp: timeString 
    });

    input.value = "";
    renderTasks();
}

// --- NEW EDIT TASK FUNCTION (Satisfies Level 2 requirement) ---
function editTask(id) {
    const taskIndex = tasks.findIndex(t => t.id === id);
    const currentText = tasks[taskIndex].text;
    
    const newText = prompt("REVISE OBJECTIVE:", currentText);
    
    if (newText !== null && newText.trim() !== "") {
        tasks[taskIndex].text = newText.trim();
        renderTasks();
    }
}

function delTask(id) {
    if(confirm("Permanently delete this objective?")) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    }
}

function toggle(id) {
    tasks = tasks.map(t => t.id === id ? {...t, done: !t.done} : t);
    renderTasks();
}

function handleEnter(e) { if(e.key === 'Enter') addTask(); }

setInterval(rotateQuote, 10000);
setInterval(updateClock, 1000); 

rotateQuote(); 
updateClock();
renderTasks();