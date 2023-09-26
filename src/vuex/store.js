import { createStore } from 'vuex';

const store = createStore({
  //State est l'endoit où se trouvent nos variables
  state: {
    accessInterfaceGetQuestions: false, // Propriété pour gérer l'accès à CreateResponses.vue
    categoryId : 1,
  },
  
  //Fonctions synchrones / Permet de modifier une variable dans 'State'
  mutations: {
    setAccessInterfaceGetQuestions(state, newValue) {
      state.accessInterfaceGetQuestions = newValue;
    },
    setCategoryId(state, newValue) {
      state.categoryId = newValue;
    },
  },
  //Fonctions asynchrones
  actions: {
    // Définissez vos actions si nécessaire
  },
  //Les getters permettent d'accéder aux variables depuis n'importe quel composant / Ce sont des accesseurs
  getters: {
    displayInterfaceGetQuestions: (state) => { // Prenez state comme argument
      return state.accessInterfaceGetQuestions;
    },
    getNextCategoryId: (state) => { // Prenez state comme argument
      return state.categoryId;
    }
  },
});

export default store;