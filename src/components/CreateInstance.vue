<script setup>
import axios from 'axios';
import { ref, onMounted } from "vue";


// Valeur de la clé d'instance
const keyInstanceAdmin = ref();

// Variable utilisée dans la fonction "buttonReturnComponent"
const backButtonValue = ref(true);

//Valeur transmise au composant Home pour afficher le composant CreateCategory
const component = ref('createCategory');

const emit = defineEmits(["returnComponent", "accessCreateCategory"]);

// Déclaration de userId comme une référence réactive et initialisation à partir de sessionStorage
const userId = ref(sessionStorage.getItem('userId'));
const userName = ref(sessionStorage.getItem('userName'))


//Variable contenant la liste des joueurs de l'instance
const listPlayers = ref();
const numberPlayers = ref();

//Id de setInterval - réinitialiser la variable à null pour arrêter le setInterval lorsque l'on clique sur 'Commencer'
const intervalId = ref();

// Retour à l'écran précédent via le bouton "retour"
function buttonReturnComponent() {
  emit("returnComponent", backButtonValue);
}

// Génère une clé d'instance
async function generateKeyInstance() {
  try {
    const response = await axios.post('http://localhost/gamewithfriendsback/Instances/create_key_instance.php');
    keyInstanceAdmin.value = response.data.chiffres;

    // Créer une nouvelle instance dans le fichier "instances.json" avec userId
    const instanceData = {
      instance: keyInstanceAdmin.value,
      startInstance: 'no',
      players: [{ userId: userId.value, userName: userName.value, role: 'admin' }]
    };

    axios.post('http://localhost/gamewithfriendsback/Instances/create_instance.php', instanceData).then(response => {
      console.log(response.data);
      if (response.data.success == true) {
        sessionStorage.setItem('keyInstance', keyInstanceAdmin.value);
      }
    });
  } catch (error) {
    console.error("Une erreur s'est produite : " + error);
  }
}


// Fonction pour supprimer l'instance
function destroyInstance() {
  try {
    // Effectuez une requête HTTP POST vers votre script PHP pour supprimer l'instance
    axios.post('http://localhost/gamewithfriendsback/Instances/delete_instance.php', { instance: keyInstanceAdmin.value }).then(response => {
      console.log(response.data);
      if (response.data != null || response.data != undefined) {
        // Redirigez l'utilisateur vers la page d'accueil ou effectuez d'autres actions nécessaires
        buttonReturnComponent();
      }
    });
  } catch (error) {
    console.error("Une erreur s'est produite : " + error);
  }
}




//Fonction pour récupérer la liste de joueurs
async function getListPlayers() {
  // Effectuez une requête HTTP POST vers votre script PHP pour supprimer l'instance
  await axios.post('http://localhost/gamewithfriendsback/Instances/get_list_players.php', { instance: keyInstanceAdmin.value }).then(response => {
    listPlayers.value = response.data.dataPlayers[0];
    numberPlayers.value = listPlayers.value.length;
    sessionStorage.setItem('nbrePlayers', numberPlayers.value)
  });
}


//Fonction pour accéder à l'interface de catégorie et supprimer le setInterval en cours
async function accessInterfaceCreateCategory() {
  await axios.post('http://localhost/gamewithfriendsback/Instances/start_instance.php', { instance: keyInstanceAdmin.value, action: 'admin' }).then(response => {
    console.log(response.data);
    if (response.data.success == true) {
      clearInterval(intervalId.value);
      intervalId.value = null; // Réinitialisez l'ID de l'intervalle
      getListPlayers();
      emit("accessCreateCategory", component);
    }
  });
}


//Bouton de déconnexion - sessionStorage nettoyée && rechargement de la page
function logOff() {
  sessionStorage.clear();
  location.reload();
}


// Appeler generateKeyInstance lorsque le composant est monté
onMounted(() => {
  generateKeyInstance();
});

//SetInterval permettant de récupérer la liste des joueurs toutes les 2 secondes lorsque le composant est monté
onMounted(() => {
  intervalId.value = setInterval(getListPlayers, 1000);
})




</script>


<template>
  <div class="custom-container">
    <div class="imgbanner">
      <img class="dance" src="src/assets/img/14.png" alt="">
    </div>
    <div class="header_application"></div>
    <div class="border_header">
      <div class="data-info size1-3 roboto"><div>{{ keyInstanceAdmin }}</div><div class="margin-top-0-6 size0-7">Renseignez la clé à 6 chiffres aux joueurs</div></div>
    </div>
    <i class="fa-solid fa-power-off margin-left0-3 position-fixed top-0 right-0 margin-top0-5 margin-right0-5 size1-5 cursor-pointer"
      @click="logOff"></i>
    <div @click="destroyInstance" class="position-fixed top-0 left-0 margin-top0-3 margin-left0-5 size1-5 cursor-pointer">
      <i class="fa-solid fa-rotate-left "></i>
    </div>
    <div class="container_vue">

      <div class="text-center margin-top0-5">
        <v-card text="En attente des joueurs ..." loading></v-card>
      </div>
      <div>
        <div class="margin-top3 bold">
          <i class="fa-solid fa-users margin-right0-3"></i>
          Liste des joueurs
        </div>
        <v-divider :thickness="2"></v-divider>
        <v-table>
          <thead>
            <tr v-for="(player) in listPlayers" class="roboto">
              <th class="text-left text-align-center">
                {{ player.userName }}
              </th>
            </tr>
          </thead>
        </v-table>
        <div class=" text-align-center">
          <v-btn stacked variant="outlined" class="width-10rem height-2rem margin-top1 margin-bottom3"
            v-if="numberPlayers > 1" @click="accessInterfaceCreateCategory">
            Commencer
          </v-btn>
        </div>
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
  padding-left: 1rem;
  padding-right: 1rem;
  position: relative;
  z-index: 66;
}

img {
  width: 10rem !important;
}
</style>



