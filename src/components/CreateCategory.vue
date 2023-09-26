<script setup>
import axios from 'axios';
import { ref, watch, onMounted } from "vue";
import CreateQuestions from "./CreateQuestions.vue"

// Données envoyées dans la requête POST pour créer / implémenter une catégorie 
const categoryName = ref(null);
const userId = ref(sessionStorage.getItem('userId'))
const keyInstanceUser = ref(parseInt(parseInt(sessionStorage.getItem('keyInstance'))));
const userName = ref(sessionStorage.getItem('userName'));

//Le composant s'affichera en focntion de la valeur du 'path'
const path = ref('createCategory');

//Variable contenant la liste des catégories de l'instance
const listCategories = ref();
const numberCategories = ref();
const numberPlayers = ref(sessionStorage.getItem('nbrePlayers'));

//Id de setInterval - réinitialiser la variable à null pour arrêter le setInterval lorsque l'on clique sur 'Commencer'
const intervalId = ref();

// Gère le disabled du bouton "enregistrer"
const unlockButton = ref(true);

// Gère le disabled du input de type texte
const unlockInputText = ref(false);

//Affichage du bouton "enregistrer"
const displayButton = ref(true);

//Affichage de l'élément 'En attente des joueurs ...'
const displayLoading = ref(false);

//Afficher les conseils aux joueurs avant qu'ils ne créent leur catégorie
const displayAdvice = ref(true);


//Bouton de déconnexion - sessionStorage nettoyée && rechargement de la page
function logOff() {
    sessionStorage.clear();
    location.reload();
}



//Fonction pour créer ou implémenter une catégorie
async function validateCategory() {
    // Effectuez une requête HTTP POST vers votre script PHP pour enregistrer la categorie
    await axios.post('http://localhost/gamewithfriendsback/Categories/create_categories.php', { gameInstanceId: keyInstanceUser.value, categoryId: null, categoryName: categoryName.value, userId: userId.value, questions: null }).then(response => {
        if (response.data.success == "Données enregistrées avec succès") {
            displayButton.value = false;
            unlockInputText.value = true;
            displayLoading.value = true;
        }
    });
}


//Fonction pour récupérer toutes les catégories
async function getListCategories() {
    // Effectuez une requête HTTP POST vers votre script PHP pour enregistrer la categorie
    await axios.post('http://localhost/gamewithfriendsback/Categories/get_list_categories.php', { gameInstanceId: keyInstanceUser.value }).then(response => {
        listCategories.value = response.data.dataCategories;
        numberCategories.value = listCategories.value.length;
        if (numberCategories.value == numberPlayers.value) {
            clearInterval(intervalId.value);
            intervalId.value = null; // Réinitialisez l'ID de l'intervalle
            path.value = 'createQuestions'
        }
    });
}


// Watch est une fonction qui s'éxécute dès que la valeur en paramètre est modifiée. La saisie de la catégorie doit remplir les conditions suivantes pour que le bouton s'active.
watch(categoryName, () => {
    if (categoryName.value == "" || categoryName.value == null || categoryName.value == undefined || categoryName.value.length <= 2) {
        unlockButton.value = true;
    }
    else {
        unlockButton.value = false;
    }
})


//SetInterval permettant de récupérer la liste des joueurs toutes les 2 secondes lorsque le composant est monté
onMounted(() => {
    intervalId.value = setInterval(getListCategories, 1000);
})
</script>


<template>   
    <div class="custom-container" v-if="path=='createCategory'">
        <div class="imgbanner" >
            <img class="dance" src="src/assets/img/16.png" alt="">
        </div>
        <div class="header_application"></div>
        <div class="border_header">
            <div class="data-info size1-3 raleway">{{ userName }}</div>
        </div>
        <div class="container_vue">
            <div>
                <i class="fa-solid fa-power-off margin-left0-3 position-fixed top-0 right-0 margin-top0-5 margin-right0-5 size1-5 cursor-pointer"
                    @click="logOff" v-if="path == 'createCategory'"></i>
                <div
                    v-if="path == 'createCategory'">
                    <v-card-text  v-if="displayLoading == false">
                        <div class="size1-5 margin-bottom0-5 underlin">Conseil<i class="fa-regular fa-lightbulb margin-left0-3"></i></div>
                        <div class="text--primary">
                            <ul class="margin-left1">
                                <li class="margin-bottom1 line-height0-9">Prenez le temps de réfléchir soigneusement à votre thème
                                </li>
                                <li class="margin-bottom1 line-height0-9">Proposez un thème clair et compréhensible pour les
                                    autres joueurs </li>
                                <li class="line-height0-9">Les autres joueurs, y compris vous, devront générer une
                                    question liée à cette thématique</li>
                            </ul>
                        </div>
                    </v-card-text>
                    <div class="text-align-left margin-top2 ">
                        <div class="bold">Etape 1 - Créer une thématique</div>
                        <div><v-text-field label="Thématique" v-model="categoryName" placeholder="3 caractères min" required
                                :disabled="unlockInputText"></v-text-field></div>
                        <div class="text-align-center"> <v-btn class="margin-bottom1 width-10rem"
                                :disabled="unlockButton" @click="validateCategory" v-if="displayButton == true">
                                Enregistrer
                            </v-btn>
                            <v-card loading class="roboto flex flex-column padding-top1 padding-bottom1"
                                v-if="displayLoading == true">
                                <span class="padding-bottom0-7">En attente des joueurs ...</span> {{ numberCategories + ' / ' +
                                    numberPlayers }}
                            </v-card>
                        </div>
                        <div v-if="numberCategories > 0">
                            <div class="margin-top2 bold"><i class="fa-regular fa-file margin-right0-3"></i>Liste des catégories
                            </div>
                            <v-divider :thickness="2"></v-divider>
                        </div>
                        <v-table>
                            <thead>
                                <tr v-for="(categorie, index) in listCategories" class="roboto">
                                    <th class="text-left">
                                        <i class="fa-solid fa-caret-up fa-rotate-90"></i> {{ categorie.categoryName }}
                                    </th>
                                </tr>
                            </thead>
                        </v-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <CreateQuestions v-if="path == 'createQuestions'" />
</template>
<style scoped>
.data-info{
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
.imgbanner{
    margin: auto;
    display: flex;
    justify-content: center;
  }
  .imgbanner img{
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
    width: 100%; /* Change the width to 100% */
    z-index: 55555;
    background: white;
    border-radius: 50px 50px 0 0;
    display: flex;
    justify-content: center;
    align-items: center; /* Center vertically */
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
    width: 90%; /* Change the width to 90% */
    max-width: 300px; /* Add a max-width if needed */
    padding: 0 24px;
    line-height: 45px;
    position: relative; /* Remove the duplicate position property */
    bottom: 20px;

}
.container_vue {
    position: relative;
  	z-index: 66;
    padding: 0px 20px;
}

img{
    width: 20rem !important;
    padding-right: 3rem !important;
}

</style>
