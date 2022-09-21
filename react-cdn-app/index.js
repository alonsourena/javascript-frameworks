

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function ReactAppFromCDN(props) {

    const input = React.useRef(null)

    const [tasks, setTasks] = React.useState(() => {
        const saved = localStorage.getItem("tasks");
        const initialValue = JSON.parse(saved);
        return initialValue || [];
    });

    React.useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    function updateStatus(id) {

        let task = tasks.find(t => t.id === id);
        task.status = task.status === "completed" ? "pending" : "completed"

        setTasks((prevState) => {
            return prevState.map(x => {
                if (x.id === task.id)
                    x = task;

                return x;
            })
        })
    }

    function deleteTask(id) {
        let filteredTask = tasks.filter(t => t.id !== id);
        setTasks(filteredTask)
    }

    function clearAll() {
        setTasks([])
    }

    function addTask(event) {

        event.preventDefault();

        if (!input.current) return;

        let newTask = {
            id: uuidv4(),
            name: input.current.value,
            status: "pending"
        }

        setTasks((prevState) => {
            return [
                ...prevState,
                newTask
            ]
        })

        input.current.value = '';
    }

    function renderTasks() {

        let filteredTask =
            tasks.map((t, idx) => {
                let completed = t.status === "completed" ? "checked" : "";
                return (
                    <li key={idx} className="task">
                        <label htmlFor={idx}>
                            <input type="checkbox" id={idx} onChange={() => updateStatus(t.id)} checked={completed} />
                            <p className={completed}>{t.name}</p>
                        </label>
                        <div>
                            <button onClick={() => deleteTask(t.id)}>Delete</button>
                        </div>
                    </li>
                );
            })

        return filteredTask.length > 0 ? filteredTask : <span>You don't have any task here</span>;

    }


    return (
        <div className="wrapper">
            <form className="task-input" onSubmit={addTask}>
                <img src="./bars-icon.svg" alt="icon" />
                <input type="text" placeholder="Add a new task" ref={input} />
            </form>
            <div className="controls">
                <button onClick={clearAll} className={`clear-btn ${tasks.length ? "active" : ""}`}>Clear All</button>
            </div>
            <ul className="task-box">
                {
                    renderTasks()
                }
            </ul>
        </div>
    );
}

ReactDOM.render(<ReactAppFromCDN />, document.querySelector('#root'));
