<script setup>
import { useStore } from 'vuex';
import axios from 'axios';
import CreateAnswer from './CreateAnswers.vue';
import { ref, onMounted, watch, computed } from "vue";

// Données envoyées dans la requête POST 
const keyInstanceUser = ref(parseInt(sessionStorage.getItem('keyInstance')));

// Obtenez l'instance du store Vuex
const store = useStore();


const displayMessage = ref('startParty')


//Id de la categorie
const categoryId = computed(() => store.getters.getNextCategoryId);

//Timer de compte à rebours
const timerFiveSeconds = ref(5);

//variable où sont stockées les données de la catégorie que nous retourne le serveur
const dataCategories = ref();


//Id de setInterval - réinitialiser la variable à null pour arrêter le setInterval 
const intervalTimer5Seconds = ref();

//Fonction permettant de décrémenter le timer qui correspond à 5 secondes
function timerStartPartyDecrement() {
    timerFiveSeconds.value--;
    if (timerFiveSeconds.value == 0) {
        clearInterval(intervalTimer5Seconds.value);
        intervalTimer5Seconds.value = null; // Réinitialisez l'ID de l'intervalle
    }
}

// Utilisez watch pour observer les changements dans displayCreateResponses
watch(categoryId, () => {
    displayMessage.value = 'nextCategory';
    timerFiveSeconds.value = 5;
    intervalTimer5Seconds.value = setInterval(timerStartPartyDecrement, 1000)
    axios.post('http://localhost/gamewithfriendsback/Questions/get_questions.php', { gameInstanceId: keyInstanceUser.value, categoryId: categoryId.value }).then(response => {
        dataCategories.value = response.data.categoryInstance;
        console.log(dataCategories.value);
    });
});

// Effectuez une requête HTTP POST vers votre script PHP pour récupérer les questions
onMounted(async () => {
    await axios.post('http://localhost/gamewithfriendsback/Questions/get_questions.php', { gameInstanceId: keyInstanceUser.value, categoryId: categoryId.value }).then(response => {
        dataCategories.value = response.data.categoryInstance;
    });

})


//SetInterval permettant de compter toutes les questions dans chaque catégories côté serveur / Si tous les joueurs ont créé toutes leurs questions alors il y a une redirection
onMounted(async () => {
    intervalTimer5Seconds.value = setInterval(timerStartPartyDecrement, 1000);
})



</script>


<template>
    <div >
        <div class="raleway size2 flex flex-column justify-center margin-top10" v-if="timerFiveSeconds > 0">
            <div class="bold flex justify-center align-center" v-if="displayMessage == 'startParty'">Début de la partie</div>

            <div v-if="displayMessage == 'nextCategory'" class="flex flex-column justify-center align-center">
                <div class="bold text-align-center">Prochaine thématique</div>
                <div class="text-align-center italic">{{ dataCategories.categoryName }}</div>
            </div>
            <div class="roboto text-align-center size2">{{ timerFiveSeconds }}</div>
        </div>
    </div>
    <CreateAnswer :dataCategories="dataCategories" v-if="timerFiveSeconds == 0" />
</template>