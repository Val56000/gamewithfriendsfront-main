<script setup>
import { useStore } from 'vuex';
import axios from 'axios';
import { ref, onMounted, onBeforeMount } from "vue";
import Podium from "./Podium.vue";

//Utiliser le store
const store = useStore();

//Récupérer toutes les info de la catégories et des questions dans le props
const props = defineProps(["dataEvaluateAnswers"]);

//Id de la category
const categoryId = ref(props.dataEvaluateAnswers.categoryId);

//Id de l'instance
const instanceId = ref(props.dataEvaluateAnswers.gameInstanceId);

//Stocker ma question à laquelle les joueurs ont répondu
const myQuestion = ref(props.dataEvaluateAnswers.myQuestion);

//Id du joueur
const userId = ref(sessionStorage.getItem('userId'));

//Nom du joueur
const userName = ref(sessionStorage.getItem('userName'));

//Nombre de joueurs
const numberPlayers = ref(sessionStorage.getItem('nbrePlayers'))

//Toutes les réponses des joueurs sont stockées dans cette variable
const usersAnswers = ref();

//Tous les joueurs ayant la bonne réponse sont stockées dans ce tableau réactif
const arrayPointsUsers = ref([]);

//Affichage du loading
const displayLoading = ref(false)

//Affichage du composant 'Podium.vue'
const displayPodium = ref(false);

//Id de setInterval - réinitialiser la variable à null pour arrêter le setInterval 
const intervalCheckReadyPlayer = ref()

const numberPlayersReady = ref();


//Récupère les réponses des joueurs avant que le template ne soit monté
onBeforeMount(async () => {
    myQuestion.value = props.dataEvaluateAnswers.myQuestion;
    await axios.post('http://localhost/gamewithfriendsback/Responses/delete_duplicates.php', { gameInstanceId: instanceId.value, categoryId: categoryId.value, userId: userId.value }).then(response => {
        console.log(response.data);
    });

    await axios.post('http://localhost/gamewithfriendsback/Responses/get_answers.php', [{ gameInstanceId: instanceId.value, categoryId: categoryId.value, userId: userId.value }]).then(response => {
        usersAnswers.value = response.data.userAnswers;
    });
    await axios.post('http://localhost/gamewithfriendsback/Responses/update_statut_player.php', { gameInstanceId: instanceId.value, userId: userId.value }).then(response => {
        console.log(response.data);
    })
})

//Fonction pour valider les bonnes réponses
async function validatePoints() {
    if (arrayPointsUsers.value.length > 0) {
        await axios.post('http://localhost/gamewithfriendsback/Score/create_points.php', { gameInstanceId: instanceId.value, categoryId: categoryId.value, points: arrayPointsUsers.value }).then(response => {
            if (response.data.success == true) {
                displayLoading.value = true;
            }

        });
    }
    //Requête axios permettant de savoir si il y a une autre catégorie à jouer
    await axios.post('http://localhost/gamewithfriendsback/Responses/play_next_category.php', { gameInstanceId: instanceId.value, categoryId: categoryId.value, userId: userId.value, userName: userName.value, readyForNextCategory: 'yes' }).then(response => {
        if (response.data.success == true) {
            displayLoading.value = true;
        }
    })

}

//Vérifie toutes les secondes si les évaluateurs sont prêts
async function checkReadyPlayers() {
    //requete permettant de savoir si le nombre de joueurs prêts est égale au nombre de joueurs total de l'instance
    await axios.post('http://localhost/gamewithfriendsback/Responses/check_ready_players.php', { gameInstanceId: instanceId.value, categoryId: categoryId.value }).then(response => {
        numberPlayersReady.value = response.data.numberOfPlayers;
        if (response.data.numberOfPlayers == numberPlayers.value) {
            //Requête mermettant de savoir si il y a une autre catégorie
            axios.post('http://localhost/gamewithfriendsback/Categories/exist_next_category.php', { gameInstanceId: instanceId.value, categoryId: categoryId.value }).then(response => {
                if (response.data.nextCategoryExists == true) {
                    const categoryIdIncrement = ref(categoryId.value + 1)
                    store.commit('setCategoryId', categoryIdIncrement);
                    clearInterval(intervalCheckReadyPlayer.value);
                    intervalCheckReadyPlayer.value = null;
                } else if (response.data.nextCategoryExists == false) {
                    displayPodium.value = true;
                    clearInterval(intervalCheckReadyPlayer.value);
                    intervalCheckReadyPlayer.value = null;
                }
            })
        } else {
            return;
        }
    })
}


//Vérifier si tous les joueurs sont prêts pour afficher le prochain template
onMounted(() => {
    myQuestion.value = props.dataEvaluateAnswers.myQuestion;
    intervalCheckReadyPlayer.value = setInterval(checkReadyPlayers, 1000);
})


</script>



<template>
    <div v-if="displayPodium == false"> <v-card class="flex flex-column justify-center align-center padding-bottom0-7"
            loading text="En attente des joueurs ..." v-if="displayLoading == true"> {{
                numberPlayersReady + ' / ' + numberPlayers }} </v-card>
    </div>
    <div class="flex-column align-center justify-center margin-bottom1 raleway "
        v-if="displayLoading == false && displayPodium == false">
        <div class="size1-2 line-height1-4"><i class="fa-regular fa-thumbs-up margin-right0-3"></i>Sélectionnez les bonnes
            réponses</div>
        <v-divider :thickness="2"></v-divider>
        <div class="margin-top1 line-height1-2 flex flex-column justify-center align-center">

            <div class="size1 width-90vw myQuestion bold">{{ myQuestion }}</div>
        </div>

        <div v-for="(item, index) in usersAnswers">
            <div class="margin-bottom1 margin-top1  ">
                <label :for="'data' + index" class="cursor-pointer">
                    <div
                        :class="{ 'style-button-point': !arrayPointsUsers.some(user => user.userId === item.answerUserId), 'style-button-point2': arrayPointsUsers.some(user => user.userId === item.answerUserId) }">
                        <div class="flex flex-row">
                            <ul class="margin-left1-1">
                                <li class="margin-right0-5">{{ item.answerUserName }}</li>
                            </ul>
                            <div class="roboto bold"
                                v-if="arrayPointsUsers.some(user => user.userId === item.answerUserId)">+1
                            </div>
                        </div>
                        <div v-if="item.answerText != null">{{ 'Sa réponse : ' + item.answerText }}</div>
                        <div v-if="item.answerText == null">{{ "Le joueur n'a pas répondu" }} <i
                                class="fa-solid fa-ban"></i></div>
                    </div>
                </label>
                <input type="checkbox" :id="'data' + index" v-model="arrayPointsUsers"
                    :value="{ userId: item.answerUserId, userName: item.answerUserName }">
            </div>

        </div>
        <div class="flex width-90vw justify-center">
            <v-btn class="margin-bottom1 margin-top1 width-10rem" @click="validatePoints">
                Valider
            </v-btn>
        </div>
    </div>
    <Podium v-if="displayPodium == true" />
</template>

<style scoped>
.myQuestion {
    max-width: 100%;
    /* Limiter la largeur au maximum de son conteneur parent */
    word-wrap: break-word;
    /* Permettre le passage à la ligne si le mot est trop long */
}

input[type="checkbox"] {
    display: none;
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
}</style>