<script setup>
import { useStore } from 'vuex';
import axios from 'axios';
import { ref, watch, onBeforeMount, onMounted } from "vue";

const store = useStore();

//Variable contenant la liste des catégories de l'instance
const listCategories = ref();

//Variable contenant la liste des questions rentrées par l'utilisateur
const listQuestions = ref([])

//Objet contenant les questions qui seront envoyées au serveur
const listQuestionsRequest = ref(null);

// Données envoyées dans la requête POST 
const keyInstanceUser = ref(parseInt(sessionStorage.getItem('keyInstance')));

//Récupérer nombre de joueurs
const numberPlayers = ref(sessionStorage.getItem('nbrePlayers'));

//Affiche le nombre de joueurs prêts
const numberPlayersReady = ref(1);

//Récupérer le nom du joueur
const userName = ref(sessionStorage.getItem('userName'))

//Récupérer l'id du joueur
const userId = ref(sessionStorage.getItem('userId'))

//Mettre le nombre de questions de chaque catégorie dans cette variable
const numberQuestionsInCategories = ref([]);

//Cacher les éléments du template / Quand 'response.data.success' == true displayAllElements.value = false
const displayAllElements = ref(true);

//Affichage du bouton "enregistrer"
const displayButton = ref(true);

// Gère le disabled du bouton "enregistrer"
const unlockButton = ref(true);

//Id de setInterval - réinitialiser la variable à null pour arrêter le setInterval lorsque tous les joueurs sont prêts
const intervalId = ref();

//Afficher les conseils aux joueurs avant qu'ils ne créent leurs questions
const displayAdvice = ref(true);

//Fonction pour récupérer toutes les catégories
onBeforeMount(async () => {
    // Effectuez une requête HTTP POST vers votre script PHP pour enregistrer la categorie
    await axios.post('http://localhost/gamewithfriendsback/Categories/get_list_categories.php', { gameInstanceId: keyInstanceUser.value }).then(response => {
        listCategories.value = response.data.dataCategories;
    });
})

//Bouton de déconnexion - sessionStorage nettoyée && rechargement de la page
function logOff() {
    sessionStorage.clear();
    location.reload();
}


async function validateQuestions() {
    // Effectuez une requête HTTP POST vers votre script PHP pour enregistrer les questions
    await axios.post('http://localhost/gamewithfriendsback/Questions/create_questions.php', listQuestionsRequest.value).then(response => {
        if (response.data.success == true) {
            displayButton.value = false;
            displayAllElements.value = false;

        }
    });
}

async function checkQuestionsInCategories() {
    // Effectuez une requête HTTP POST vers votre script PHP pour vérifier le nombre de questions par categories d'une instance
    await axios.post('http://localhost/gamewithfriendsback/Questions/count_questions_in_categories.php', { gameInstanceId: keyInstanceUser.value }).then(response => {
        numberQuestionsInCategories.value = response.data.categoriesSize;



        const obj = numberQuestionsInCategories.value;

        for (const prop in obj) {
            numberPlayersReady.value = obj[prop];
            console.log(numberPlayersReady.value)
            break; // Pour s'assurer que nous sortons de la boucle après la première itération
        }


        //Le nombre de questions par catégorie est stocké dans ce tableau
        const valuesArrayQuestions = [];

        //Parcourir l'objet reçu en réponse pour stocker les valeurs dans le tableau 'valuesArrayQuestions.value'
        for (const key in numberQuestionsInCategories.value) {
            if (Object.hasOwnProperty.call(numberQuestionsInCategories.value, key)) {
                valuesArrayQuestions.push(numberQuestionsInCategories.value[key]);
            }
        }


        for (let index = 0; index < valuesArrayQuestions.length; index++) {
            const element = valuesArrayQuestions[index];
            if (element != numberPlayers.value) {
                return;
            }
            clearInterval(intervalId.value);
            intervalId.value = null; // Réinitialisez l'ID de l'intervalle
            store.commit('setAccessInterfaceGetQuestions', true);
        }
    });
}


// Watch est une fonction qui s'éxécute dès que la valeur en paramètre est modifiée. La saisie de la catégorie doit remplir les conditions suivantes pour que le bouton s'active.
watch(listQuestions.value, () => {
    console.log(listCategories.value);
    listQuestionsRequest.value = null;
    //Toutes les valeurs nécessaires à la création des questions sont stockées dans 'listQuestionsRequest' qui sera envoyé au serveur quand le joueur cliquera sur 'enregistrer'
    for (let index = 0; index < listQuestions.value.length; index++) {
        //Si 'listQuestionsRequest est vide'
        if (listQuestionsRequest.value == null) {
            listQuestionsRequest.value = [{ gameInstanceId: keyInstanceUser.value, categoryId: listCategories.value[index].categoryId, questionId: null, questionText: listQuestions.value[index], userName: userName.value, userId: userId.value, numberPlayers: numberPlayers.value }]
        }
        //Si 'listQuestionsRequest' contient au moins une question alors on push les questions suivantes dans le array
        else if (listQuestionsRequest.value.length != null) {
            listQuestionsRequest.value.push({ gameInstanceId: keyInstanceUser.value, categoryId: listCategories.value[index].categoryId, questionId: null, questionText: listQuestions.value[index], userName: userName.value, userId: userId.value, numberPlayers: numberPlayers.value })
        }
    }


    //Si toutes les questions sont remplies alors le bouton 'enregistrer' est activé
    let allQuestionsValid = true;

    for (let index = 0; index < listQuestions.value.length; index++) {
        const element = listQuestions.value[index];
        if (element == null || element == undefined || element.replace(/\s+/g, '') == "" || element.length <= 2) {
            allQuestionsValid = false; // Si l'une des questions ne remplit pas les conditions, définissez à false
            break; // Sortez de la boucle dès que vous trouvez une question non valide
        }
    }
    if (listQuestions.value.length != numberPlayers.value || !allQuestionsValid) {
        unlockButton.value = true;
    } else {
        unlockButton.value = false;
    }
})


//SetInterval permettant de compter toutes les questions dans chaque catégories côté serveur / Si tous les joueurs ont créé toutes leurs questions alors il y a une redirection
onMounted(() => {
    intervalId.value = setInterval(checkQuestionsInCategories, 1000);
})
</script>

<template>
    <div class="custom-container">
        <i class="fa-solid fa-power-off margin-left0-3 position-fixed top-0 right-0 margin-top0-5 margin-right0-5 size1-5 cursor-pointer"
            @click="logOff" v-if="path == 'createCategory'"></i>
        <div class="imgbanner">
            <img class="dance" src="src/assets/img/17.png" alt="">
        </div>
        <div class="header_application"></div>
        <div class="border_header">
            <div class="data-info size1-3 raleway">{{ userName }}</div>
        </div>
        <div class="container_vue">
            <i class="fa-solid fa-power-off margin-left0-3 position-fixed top-0 right-0 margin-top0-5 margin-right0-5 size1-5 cursor-pointer"
                @click="logOff"></i>
            <v-card-text>
                <div v-if="displayAllElements == true" class="size1-5 margin-bottom1 underlin">Conseil<i
                        class="fa-regular fa-lightbulb margin-left0-3"></i>
                </div>
                <div class="text--primary" v-if="displayAllElements == true">
                    <ul class="margin-left1">
                        <li class="margin-bottom1 line-height0-9">Vous êtes autorisé à concevoir les questions
                            les plus farfelus, mais veillez à ce qu'elles restent réalisables en termes de difficulté.
                        </li>
                        <li class="margin-bottom1 line-height0-9">Sur cette page, vous devez générer 1 question par
                            thématique. </li>
                        <li class="margin-bottom1 line-height0-9">En manque d'inspiration ? <br>Posez une
                            question sur vous-même ou demandez de citer un élément sur la thématique. <div class="size0-6">(Exemples ci-dessous)</div>
                        </li>
                    </ul>
                    <div class="flex flex-row margin-top0-7 justify-center">
                        <v-card class="example-question flex flex-column justify-center align-center margin-right1 background-alice-blue">
                            <div class="margin-top0-7 text-align-center roboto size1-2">Thème sport</div>
                            <div class="size0-7 line-height0-7 text-align-center">Quel est
                                le sport que je pratique ?</div>
                        </v-card>
                        <v-card class="example-question flex flex-column justify-center align-center background-alice-blue">
                            <div class="text-align-center roboto size1-2">Thème Film</div>
                            <div class="size0-7 line-height0-7 text-align-center">Cite un film d'action</div>
                        </v-card>
                    </div>
                   
                </div>
            </v-card-text>
            <div class="margin-top2 flex-column align-center justify-center margin-bottom1 raleway ">
                <div class="text-align-left">
                    <div class="line-height1 bold">Etape 2 - Créer une question pour chaque thématique</div>
                    <v-divider :thickness="2" class="margin-bottom1"></v-divider>
                    <div class="text-center margin-top0-5 ">
                        <v-card class="text-align-center padding-bottom0-7" loading text="En attente des joueurs ..."
                            v-if="displayAllElements == false">
                            <div class="roboto text-align-center">{{ numberPlayersReady + ' / ' + numberPlayers }}</div>
                        </v-card>
                    </div>
                    <div v-for="(categorie, index) in listCategories" class="roboto" v-if="displayAllElements == true">
                        <i class="fa-solid fa-caret-up fa-rotate-90"></i> {{ categorie.categoryName }}
                        <v-textarea label="Ecrivez votre question " variant="solo-inverted" class="margin-bottom2"
                            v-model="listQuestions[index]" placeholder="3 caractères min">
                        </v-textarea>
                    </div>
                </div>
                <div class="width-90vw flex justify-center margin-top-2">
                    <v-btn class="margin-bottom1" :disabled="unlockButton" @click="validateQuestions"
                        v-if="displayButton == true">
                        Enregistrer
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.example-question {
    height: 8rem !important;
    width: 12rem;
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
    position: relative;
    z-index: 66;
    padding-left: 1rem;
    padding-right: 1rem;
}
</style>
