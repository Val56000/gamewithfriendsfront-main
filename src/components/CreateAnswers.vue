<script setup>
import { useStore } from 'vuex';
import axios from 'axios';
import { ref, reactive, onMounted, watch, onBeforeMount, computed } from "vue";
import EvaluateAnswers from './EvaluateAnswers.vue';

// Obtenez l'instance du store Vuex
const store = useStore();

// Données envoyées dans la requête POST 
const keyInstanceUser = ref(parseInt(sessionStorage.getItem('keyInstance')));

const categoryId = computed(() => store.getters.getNextCategoryId);

// Timer indiquant le temps restant pou répondre à la question
const timerQuestion = ref(30);

//Réponse de l'utilisateur qui sera envoyé au serveur
const userAnswer = ref(null);

//Id de l'utilisateur
const userId = ref(sessionStorage.getItem('userId'));

//Nom de l'utilisateur
const userName = ref(sessionStorage.getItem('userName'));

//Nombre de joueurs
const numberPlayers = ref(sessionStorage.getItem('nbrePlayers'));

//Ma question à laquelle les joueurs ont répondu
const myQuestion = ref();

//Affichage du loading
const displayLoading = ref(false);

//Affichage du timer de la question
const displayTimerQuestion = ref(true)

const displayEvaluateAnswers = ref(false);

//Id de setInterval - réinitialiser la variable à null pour arrêter le setInterval 
const intervalTimerQuestion = ref();

//Id de setInterval - réinitialiser la variable à null pour arrêter le setInterval 
const intervalCountQuestionsinCategories = ref()

//Cette variable gère l'index des questions
const indexQuestion = ref(0);

//Valeur incremental disant que si la valeur est supérieur au nombre de questions alors on affiche le composant 'EvaluateResponses.vue'
const incrementButton = ref(1);

const dataEvaluateAnswers = reactive({ gameInstanceId: keyInstanceUser, categoryId: categoryId, myQuestion: myQuestion })

//Récupérer toutes les info de la catégories et des questions dans le props
const props = defineProps(["dataCategories"]);

//Le nombre de questions auxquelles le joueur doit répondre
const numberQuestions = ref(props.dataCategories.questions.length - 1);


const numberPlayersReady = ref(1);


//Fonction permettant de décrémenter le timer qui correspond à 5 secondes
function timerQuestionDecrement() {
    timerQuestion.value--;
}

//Bouton de déconnexion - sessionStorage nettoyée && rechargement de la page
function logOff() {
    sessionStorage.clear();
    location.reload();
}


//Fonction pour valider la réponse
async function validateAnswer() {
    // debugger;
    incrementButton.value++;

    if (incrementButton.value == numberPlayers.value) {
        await axios.post('http://localhost/gamewithfriendsback/Responses/increment_nbre_players_ready_to_evaluate.php', [{ gameInstanceId: keyInstanceUser.value, categoryId: props.dataCategories.categoryId }]).then(response => {
            console.log(response.data);
        });
    }


    //Envoie les réponses des joueurs au serveur 
    await axios.post('http://localhost/gamewithfriendsback/Responses/create_answers.php', [{ gameInstanceId: keyInstanceUser.value, categoryId: props.dataCategories.categoryId, questionId: indexQuestion.value + 1, userId: userId.value, userName: userName.value, answerText: userAnswer.value }]).then(response => {
        console.log(response.data);
    });



    if (incrementButton.value == numberPlayers.value) {
        displayLoading.value = true;
    }


    if (indexQuestion.value < numberQuestions.value) {
        indexQuestion.value++;
        timerQuestion.value = 30;
    }

}



async function loadingPlayers() {
    await axios.post('http://localhost/gamewithfriendsback/Responses/get_number_players_ready_to_evaluate.php', [{ gameInstanceId: keyInstanceUser.value, categoryId: props.dataCategories.categoryId }]).then(response => {
        console.log(response.data);
        numberPlayersReady.value = response.data.nbrePlayersReady;

        if (response.data.nbrePlayersReady == numberPlayers.value) {
            clearInterval(intervalTimerQuestion.value);
            clearInterval(intervalCountQuestionsinCategories.value);
            intervalTimerQuestion.value = null; // Réinitialisez l'ID de l'intervalle
            intervalCountQuestionsinCategories.value = null; // Réinitialisez l'ID de l'intervalle
            displayEvaluateAnswers.value = true;
        }


    });
}




onBeforeMount(() => {
    //Si on tombe sur notre propre question, l'id de la question s'incrémente pour passer à la prochaine
    if (props.dataCategories.questions[indexQuestion.value].userId == userId.value) {
        myQuestion.value = props.dataCategories.questions[indexQuestion.value].questionText;
        indexQuestion.value++;
    }
}
)


onMounted(() => {
    //Lancement du timer de la question dès que le template s'affiche
    intervalTimerQuestion.value = setInterval(timerQuestionDecrement, 1000);
    intervalCountQuestionsinCategories.value = setInterval(loadingPlayers, 1000);
})


// Utilisez watch pour observer les changements de 'indexQuestion.value'
watch(indexQuestion, () => {
    timerQuestion.value = 30;
    userAnswer.value = null;

    //Si on tombe sur notre propre question, l'id de la question s'incrémente pour passer à la prochaine
    if (props.dataCategories.questions[indexQuestion.value].userId == userId.value) {
        myQuestion.value = props.dataCategories.questions[indexQuestion.value].questionText;
        if (props.dataCategories.questions[indexQuestion.value + 1]) {
            indexQuestion.value++;
        } else {
            displayLoading.value = true;
        }

    }
});


//Vérifie l'état de 'timerQuestion'
watch(timerQuestion, () => {
    if (timerQuestion.value == 0) {
        validateAnswer();
    }
})

</script>


<template>
    <div class="custom-container">
        <div class="imgbanner">
            <img class="dance" src="src/assets/img/18.png" alt="">
        </div>
        <div class="header_application"></div>
        <div class="border_header">
            <div class="data-info size1-3 raleway">{{ userName }}</div>
        </div>
        <div class="container_vue">
            <i class="fa-solid fa-power-off margin-left0-3 position-fixed top-0 right-0 margin-top0-5 margin-right0-5 size1-5 cursor-pointer"
                @click="logOff"></i>
            <div v-if="displayEvaluateAnswers == false">
                <div class="margin-top5 flex-column align-center justify-center margin-bottom1 raleway"
                    v-if="displayLoading == true"> <v-card class="text-align-center padding-bottom0-7" loading
                        text="En attente des joueurs ...">
                        <div class="roboto text-align-center">{{ numberPlayersReady + ' / ' + numberPlayers }}</div>
                    </v-card>
                </div>
                <div v-if="displayLoading == false">
                    <div class=" timer20Sec roboto position-fixed top-0 left-0  margin-right0-5 background-white"
                        v-if="displayTimerQuestion == true">{{ timerQuestion
                        }}
                    </div>
                    <div class=" flex-column align-center">
                        <div class="text-align-center size1-5 flex flex-row justify-center">
                            <div class="margin-right0-3">Catégorie </div>
                            <div class="italic">{{ props.dataCategories.categoryName }}</div>
                        </div>
                        <div class="margin-bottom2 text-align-center">Question de {{
                            props.dataCategories.questions[indexQuestion].userName }}
                        </div>
                        <ul>
                            <li class="size1 myQuestion raleway margin-left1-2"> {{ props.dataCategories.questions[indexQuestion].questionText }}</li>
                        </ul>
                        

                        <div><v-textarea label="Votre réponse " variant="outlined" class="margin-bottom2"
                                v-model="userAnswer"></v-textarea>
                        </div>
                        <div class="text-align-center margin-top-2"><v-btn class=" width-10rem" @click="validateAnswer">
                                Valider
                            </v-btn></div>
                    </div>
                </div>
            </div>
            <EvaluateAnswers v-if="displayEvaluateAnswers == true" :dataEvaluateAnswers="dataEvaluateAnswers" />

        </div>
    </div>
</template>

<style scoped>
.myQuestion {
    max-width: 100%;
    /* Limiter la largeur au maximum de son conteneur parent */
    word-wrap: break-word;
    /* Permettre le passage à la ligne si le mot est trop long */
    line-height: 1.3rem;
    margin-bottom: 0.7rem;
}

.data-info {
    outline: none !important;
    border: 0 !important;
    text-align: center !important;
    z-index: 5 !important;
    color: #000 !important;
    background-color: #fff !important;
    border-radius: 22px !important;
    box-shadow: #0000001f 0 1px 6px, #0000001f 0 1px 4px !important;
    height: 45px !important;
    width: 90% !important;
    max-width: 300px !important;
    padding: 0 24px !important;
    line-height: 45px !important;
    position: relative !important;
    bottom: 20px !important;
}

.custom-container {
    max-width: 100vw;
    margin-right: auto;
    margin-left: auto;
}

.imgbanner {
    margin: auto;
    display: flex;
    justify-content: center;
}

.imgbanner img {
    width: 210px;
    border-style: none;
    background-image: no repeating-linear-gradient(45deg, black, transparent 100px);
    position: absolute;
    z-index: 55;
}

.header_application {
    padding: 30px 20px;
    background: #ffafbd;
    /* fallback for old browsers */
    background: -webkit-linear-gradient(to bottom, #ffc3a0, #ffafbd);
    /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to bottom, #ffc3a0, #ffafbd);
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    height: 200px;
    position: relative;
}

.mobile header .dance {
    height: 400px;
    position: absolute;
    top: 55px;
    left: 50%;
    transform: translateX(-50%);
}

.border_header {
    position: relative;
    height: 40px;
    width: 100%;
    /* Change the width to 100% */
    z-index: 55555;
    background: white;
    border-radius: 50px 50px 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    /* Center vertically */
    bottom: 30px;
}

.border_header input {
    font-size: 14px;
    outline: none;
    border: 0;
    text-align: center;
    z-index: 5;
    color: black;
    background-color: white;
    border-radius: 22px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px;
    height: 45px;
    width: 90%;
    /* Change the width to 90% */
    max-width: 300px;
    /* Add a max-width if needed */
    padding: 0 24px;
    line-height: 45px;
    position: relative;
    /* Remove the duplicate position property */
    bottom: 20px;

}

.container_vue {
    /* background: #f9f9f9; */
    position: relative;
    z-index: 66;
    padding: 20px 20px;
}


img {
    width: 12rem !important;
}
</style>
