<script setup>
import axios from 'axios';
import { ref, watch, onMounted } from "vue";

// Valeur de la clé d'instance
const keyInstanceUser = ref();

// Déclaration de userId comme une référence réactive et initialisation à partir de sessionStorage
const userId = ref(sessionStorage.getItem('userId'));
const userName = ref(sessionStorage.getItem('userName'))

// Gère le disabled du bouton "rejoindre"
const unlockButton = ref(true);

// Gère le disabled du input de type texte
const unlockInputText = ref(false);

//Affichage du bouton "rejoindre"
const displayButton = ref(true);

//Message d'erreur si l'instance n'est pas trouvée
const displayErrorMessage = ref(false)
const errorMessage = ref('');

//Variable contenant la liste des joueurs de l'instance
const listPlayers = ref();
const numberPlayers = ref(0);

//variable utilisées dans la fonction "buttonReturnComponent"
const backButtonValue = ref(true);

//Valeur transmise au composant Home pour afficher le composant CreateCategory
const component = ref('createCategory');
const emit = defineEmits(["returnComponent", "accessCreateCategory"]);

// Si c'est true, un sablier/animation apparait pour indiquer au joueur de patienter
const loadingInstance = ref(false);


//Id de setInterval - réinitialiser la variable à null pour arrêter le setInterval lorsque l'on clique sur 'Commencer'
const intervalIdJoinInstance = ref();

const intervalIdGetListPlayers = ref();


async function joinInstance() {
    const instanceData = {
        instance: keyInstanceUser.value,
        players: { userId: userId.value, userName: userName.value, role: 'player' }
    };
    try {
        await axios.post('http://localhost/gamewithfriendsback/Instances/join_instance.php', instanceData).then(response => {
            if (response.data.success == true) {
                intervalIdGetListPlayers.value = setInterval(getListPlayers, 1000);
                loadingInstance.value = true;
                displayErrorMessage.value = false;
                sessionStorage.setItem('keyInstance', keyInstanceUser.value);
                unlockInputText.value = true;
                displayButton.value = false;
            }
            if (response.data.error) {
                errorMessage.value = response.data.error;
                displayErrorMessage.value = true;
                unlockButton.value = true;
            }
        });
    } catch (error) {
        console.error("Une erreur s'est produite : " + error);
    }

}



//Fonction pour récupérer la liste de joueurs
async function getListPlayers() {
    // Effectuez une requête HTTP POST vers votre script PHP pour supprimer l'instance
    await axios.post('http://localhost/gamewithfriendsback/Instances/get_list_players.php', { instance: keyInstanceUser.value }).then(response => {
        listPlayers.value = response.data.dataPlayers[0];
        numberPlayers.value = listPlayers.value.length;
        sessionStorage.setItem('nbrePlayers', numberPlayers.value)
    });
}




//Fonction pour accéder à l'interface de catégorie et supprimer le setInterval en cours
async function accessCreateCategory() {
    // Effectuez une requête HTTP POST vers votre script PHP pour rejoindre l'instance
    await axios.post('http://localhost/gamewithfriendsback/Instances/start_instance.php', { instance: keyInstanceUser.value, action: 'player' }).then(response => {
        if (response.data.success == true) {
            clearInterval(intervalIdJoinInstance.value);
            clearInterval(intervalIdGetListPlayers.value);
            intervalIdJoinInstance.value = null; // Réinitialisez l'ID de l'interval
            intervalIdGetListPlayers.value = null; // Réinitialisez l'ID de l'interval
            getListPlayers();
            emit("accessCreateCategory", component);
        }
    });
}



//Retour à l'écran précédent via le bouton "retour"
function buttonReturnComponent() {
    emit("returnComponent", backButtonValue);
}


//Bouton de déconnexion - sessionStorage nettoyée && rechargement de la page
function logOff() {
    sessionStorage.clear();
    location.reload();
}


//SetInterval permettant de vérifier, lorsque le composant est monté, si 'startInstance' de l'instance == 'yes' 
onMounted(() => {
    intervalIdJoinInstance.value = setInterval(accessCreateCategory, 1000);
})


// Watch est une fonction qui s'éxécute dès que la valeur en paramètre est modifiée. La saisie de la clé doit remplir les conditions suivantes pour que le bouton s'active.
watch(keyInstanceUser, () => {
    if (isNaN(keyInstanceUser.value) || keyInstanceUser.value == "" || keyInstanceUser.value == null || keyInstanceUser.value == undefined || keyInstanceUser.value.length != 6) {
        unlockButton.value = true;
    }
    else if (!isNaN(keyInstanceUser.value)) {
        unlockButton.value = false;
    }
})

</script>


<template>
    <div class="custom-container">
        <div class="imgbanner">
            <img class="dance" src="src/assets/img/15.png" alt="">
        </div>
        <div class="header_application"></div>
        <div class="border_header">
            <div class="data-info size1-3 raleway">{{ userName }}</div>
        </div>
        <div class="container_vue">
            <i class="fa-solid fa-power-off margin-left0-3 position-fixed top-0 right-0 margin-top0-5 margin-right0-5 size1-5 cursor-pointer"
                @click="logOff"></i>
            <div @click="buttonReturnComponent"
                class="position-fixed top-0 left-0 margin-top0-3 margin-left0-5 size1-5 cursor-pointer">
                <i class="fa-solid fa-rotate-left "></i>
            </div>
            <div class="text-align-left size0-8">
                <i class="fa-solid fa-key margin-right0-3"></i>Saisissez la clé
                à 6 chiffres
            </div>
            <div>
                <v-text-field label="Indiquer la clé" v-model="keyInstanceUser" placeholder="_ _ _ _ _ _" required
                    maxlength="6" :disabled="unlockInputText" variant="solo" class="roboto">
                </v-text-field>
                <div v-if="displayErrorMessage == true" class="info-error">{{ errorMessage }}
                    <i class="fa-solid fa-triangle-exclamation margin-left0-3 margin-top0-3"></i>
                </div>
            </div>
            <div v-if="loadingInstance == false" class="flex justify-center">
                <v-btn class="width-10rem"
                    :class="{ 'margin-top-0-6': displayErrorMessage == false, 'margin-top0-5': displayErrorMessage == true }"
                    @click="joinInstance" :disabled="unlockButton" v-if="displayButton == true">
                    Rejoindre
                </v-btn>
            </div>
            <div class="text-center margin-top0-5" v-if="loadingInstance == true">
                <v-card loading text="Veuillez patienter ...">
                </v-card>
            </div>
            <div>
                <div class="margin-top3 bold" v-if="numberPlayers > 0"><i
                        class="fa-solid fa-users margin-right0-3"></i>Liste
                    des joueurs </div>
                <v-divider :thickness="2" v-if="numberPlayers > 0"></v-divider>
                <v-table>
                    <thead>
                        <tr v-for="(player, index) in listPlayers" class="roboto">
                            <th class="text-left text-align-center">
                                {{ player.userName }}
                            </th>
                        </tr>
                    </thead>
                </v-table>
            </div>

        </div>
    </div>
</template>


<style scoped>
/*  Page catégories / questions / réponses   */
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
    max-width: 1140px;
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
    padding: 30px 20px;
    position: relative;
    z-index: 66;
    padding: 20px 20px;

}
</style>