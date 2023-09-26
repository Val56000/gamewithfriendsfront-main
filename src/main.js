import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import store from './vuex/store'; // Importez le store Vuex

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App); // Créez l'application

app.use(store); // Utilisez le store Vuex

app.use(vuetify); // Utilisez Vuetify

app.mount('#app'); // Montez l'application
