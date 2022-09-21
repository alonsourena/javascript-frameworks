<script setup>
import Icon from "./Icon.vue";
import { ref, watch, onMounted } from "vue";

const tasks = ref([]);
const inputContent = ref("");

const addTask = () => {

  if (inputContent.value.trim() === "" || inputContent.value === null)
    return;
    
    tasks.value.push({
        id: uuidv4(),
        name: inputContent.value,
        status: false,
    });
    
    inputContent.value = "";
};

const deleteTask = (id) => {
    tasks.value = tasks.value.filter((t) => t.id !== id);
};

function clearAll() {
    tasks.value = [];
}

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}

watch(tasks, (newVal) => {
    localStorage.setItem("tasks", JSON.stringify(newVal));
}, { deep: true });

onMounted(() => {
    tasks.value = JSON.parse(localStorage.getItem('tasks')) || []
})

</script>

<template>
  <div class="wrapper">
    <form @submit.prevent="addTask" class="task-input">
      <Icon />
      <input type="text" placeholder="Add a new task" v-model="inputContent" />
    </form>
    <div class="controls">
      <button v-on:click="clearAll" :class="`clear-btn ${tasks.length ? 'active' : ''}`">
        Clear All
      </button>
    </div>
    <ul class="task-box">

      <span v-if="tasks.length === 0">You don't have any task here</span>

      <li v-for="task in tasks" v-bind:key="task" class="task">
        <label :for="task.id">
          <input :id="task.id" type="checkbox" v-model="task.status" />
          <p :class="`${task.status ? 'checked' : ''}`">{{ task.name }}</p>
        </label>
        <div>
          <button v-on:click="() => deleteTask(task.id)">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
</style>
