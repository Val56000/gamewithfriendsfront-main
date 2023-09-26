<script setup>
import { useStore } from 'vuex';
import { ref, computed, watch } from "vue";
import Login from './components/login.vue';
import InterfaceGetQuestions from "./components/InterfaceGetQuestions.vue";

const store = useStore(); // Obtenez l'instance du store Vuex
const path = ref('login');

const displayInterfaceGetQuestions = computed(() => store.getters.displayInterfaceGetQuestions);

// Utilisez watch pour observer les changements dans displayCreateResponses
watch(displayInterfaceGetQuestions, (newValue) => {
  if (newValue === true) { // Vérifiez si newValue est égal à false (plutôt que d'assigner)
    path.value = null;
  }
});
</script>


<template>
  <div class="user-select-none">
    <!-- {{ displayCreateResponses }} -->

    <Login v-if="path == 'login'" />
    <InterfaceGetQuestions v-if="$store.state.accessInterfaceGetQuestions" />
  </div>
</template>


