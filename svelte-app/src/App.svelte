<script>
    import icon from "./bars-icon.svg";
    import { onMount } from "svelte";

    let tasks = [];
    let taskText = "";

    onMount(() => {
        tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    });

    function addTask() {

        if (taskText.trim() === "" || taskText === null)
            return;

        tasks = [
            ...tasks,
            {
                id: uuidv4(),
                name: taskText,
            },
        ];
        localStorage.setItem("tasks", JSON.stringify(tasks));
        taskText = "";
    }

    function deleteTask(id) {
        tasks = tasks.filter((t) => t.id !== id);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function clearAll() {
        tasks = [];
        localStorage.setItem("tasks", JSON.stringify([]));
    }

    function updateStatus(id) {
        tasks = tasks.map((task) => {
            if (task.id === id) {
                task.status =
                    task.status == "completed" ? "pending" : "completed";
            }

            return task;
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
            (
                c ^
                (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
            ).toString(16)
        );
    }
</script>

<div class="wrapper">
    <form on:submit|preventDefault={addTask} class="task-input">
        <img src={icon} alt="icon" />
        <input bind:value={taskText} type="text" placeholder="Add a new task" />
    </form>
    <div class="controls">
        <button
            on:click={clearAll}
            class={`clear-btn ${tasks.length ? "active" : ""}`}
            >Clear All</button
        >
    </div>

    <ul class="task-box">
        {#if tasks.length === 0}
            <span>You don't have any task here</span>
        {:else}
            {#each tasks as task}
                <li class="task">
                    <label for={task.id}>
                        <input
                            type="checkbox"
                            id={task.id}
                            on:change={() => updateStatus(task.id)}
                            checked={task.status === "completed"}
                        />
                        <p class={task.status === "completed" ? "checked" : ""}>
                            {task.name}
                        </p>
                    </label>
                    <div>
                        <button on:click={() => deleteTask(task.id)}
                            >Delete</button
                        >
                    </div>
                </li>
            {/each}
        {/if}
    </ul>
</div>
