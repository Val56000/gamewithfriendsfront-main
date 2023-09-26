<script setup>
import { ref } from "vue";
import CreateInstance from "./CreateInstance.vue"
import JoinInstance from "./JoinInstance.vue"
import CreateCategory from "./CreateCategory.vue"

const path = ref('home');

//Bouton de déconnexion - sessionStorage nettoyée && rechargement de la page
function logOff() {
  sessionStorage.clear();
  location.reload();
}

function displayHome(backButtonValue) {
  if (backButtonValue.value == true) {
    path.value = 'home';
  }
}

//Fonction affichant le composant souhaité
function accessComponent(component) {
  path.value = component;
}

//Fonction affichant le composant souhaité
function accessCreateCategory(component) {
  if (component.value == 'createCategory') {
    path.value = 'createCategory';
    console.log(path.value);
  }
}

</script>
<template>
  <div id="wrapper" class="raleway">
    <section v-if="path == 'home'" class="padding-bottom0-5">
      <header>
        <div class="custom-container">
          <i class="fa-solid fa-power-off margin-left0-3 position-fixed top-0 right-0 margin-top0-5 margin-right0-5 size1-5 cursor-pointer black"
            @click="logOff"></i>
          <div class="custom-row">

          </div>
        </div>
      </header>
      <div class="custom-container">

        <!-- HERO CARD -->
        <div class="custom-row ">
          <div class="custom-col-4 center flex flex-column margin-bottom1">
            <DIV class="width-90vw line-height1-4 text-align-left size1-4 bold">Bienvenue sur l'application</DIV>
            <v-divider :thickness="1" class="border1 width-90vw"></v-divider>
          </div>
          <div class="custom-col-6">
            <div class="hero-card">
              <div class="content-image">
                <img src="../assets/img/12.png" alt="">
              </div>
              <div class="card-content">
                <div class="raleway margin-left0-5 bold">Je lance une partie</div>
                <div class="content-input">
                  <i class="gg-search"></i>
                  <v-btn class="content-input" @click="accessComponent('createInstance')">
                    Créer une instance
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
          <div class="custom-col-6">
            <div class="hero-card">
              <div class="content-image">
                <img src="../assets/img/13.png" alt="">
              </div>
              <div class="card-content">
                <div class="raleway margin-left0-5 bold">Je rejoins une partie</div>
                <div class="content-input">
                  <i class="gg-search"></i>
                  <v-btn class="content-input" @click="accessComponent('joinInstance')">
                    Rejoindre l'instance
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="custom-col-6 margin-top2">
          <h3 class="line-height1-2"><i class="fa-solid fa-gear margin-right0-3"></i>Comment ça marche ?</h3>
          <ol class="instruction-list">
            <li class="margin-bottom1 line-height0-9">Créez ou rejoignez une partie</li>
            <li class="margin-bottom1 line-height0-9">Ensuite, créez une thématique</li>
            <li class="margin-bottom1 line-height0-9">Les joueurs, vous y compris, devront créer une question sur cette
              thématique</li>
            <li class="margin-bottom1 line-height0-9">Répondez aux questions des autres joueurs (30s par question)</li>
            <li class="margin-bottom1 line-height0-9">Evaluez les réponses des joueurs</li>
            <li>Accédez au classement final</li>
          </ol>
        </div>
      </div>
    </section>

    <CreateInstance v-if="path == 'createInstance'" @returnComponent="displayHome"
      @accessCreateCategory="accessCreateCategory" />
    <JoinInstance v-if="path == 'joinInstance'" @returnComponent="displayHome"
      @accessCreateCategory="accessCreateCategory" />
    <CreateCategory v-if="path == 'createCategory'" />
  </div>
</template>

<style scoped>
:root {
  /*Animations*/
  --delay-titles: 0.3s;
  --delay-product: 0.6s;
  --delay-product-image: 1s;
  --delay-product-detail: 1.1s;
  --delay-product-star: 1.3s;
  /*icons Size multiply*/
  --ggs: 1.5;
  /*Colors*/
  --color-light: #faf4f4;
  --color-dark: #17171f;
  --color-dark-rgb: 23, 23, 31;
  /*Font Familiy*/
  --font-family: "Poppins", sans-serif;
}

body {
  background-color: var(--color-light);
  font-family: var(--font-family);
}

body .margin-vertical {
  margin: 10px 0;
}

body .col-6-sm {
  animation: fade-in-bottom 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) both var(--delay-titles);
}

/* #wrapper {
 width: 420px;
 height: 720px;
 margin: 40px auto;
 background: #f9f9f9;
 border-radius: 45px;
 overflow-y: auto;
 overflow-x: hidden;
 box-shadow: -40px 50px 40px -20px #000;
} */
@media (max-width: 540px) {
  #wrapper {
    margin: 0px;
    width: 100%;
    border-radius: 0;
    padding: 0;
    height: 100vh;
  }

  .custom-row {
    display: flex;
    flex-direction: column !important;
  }

  .custom-col-6 {

    max-width: 90% !important;
  }
}

#wrapper header {
  z-index: 5;
  position: sticky;
  top: 0;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 1, 0, ) 25%, rgba(0, 1, 0, ) 100%);
  color: var(--color-light);
  padding: 30px 25px;
  padding-bottom: 15px;
}

#wrapper header .page-title {
  margin: 0;
  font-size: 22px;
  color: black;
  padding: 5px 0;
}

#wrapper header .profile {
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 15px;
  background: url("https://i.pravatar.cc/50?img=45") no-repeat center center;
  background-size: cover;
  position: relative;
}

#wrapper header .profile:before {
  width: 7px;
  height: 7px;
  border-radius: 100%;
  content: "";
  position: absolute;
  top: 0;
  display: block;
  right: 0;
  box-shadow: 0 0 0 3px var(--color-dark);
  background-color: #e7d583;
}

#wrapper section {
  padding: 0px 25px;
  box-sizing: revert;
}

#wrapper .hero-card {
  margin: 10px 0;
  /* height: 160px; */
  box-shadow: inset 1px 2px 0 rgba(255, 255, 255, 0.4);
  border-radius: 35px;
  animation: flip-in-hor-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  background: radial-gradient(farthest-side at center center, #eed8db 5%, transparent 180px), radial-gradient(farthest-side at bottom center, #f0c1bb 5%, transparent 180px), radial-gradient(farthest-side at left bottom, #ebc6c0 5%, transparent 180px), radial-gradient(farthest-side at left center, #dabbc3 5%, transparent 180px), radial-gradient(farthest-side at left top, #e7cdce 5%, transparent 180px), radial-gradient(farthest-side at right top, #bcb7d7 5%, transparent 180px), radial-gradient(farthest-side at right bottom, #bcb7d7 5%, transparent), radial-gradient(farthest-side at right center, #bcb7d7 5%, transparent), radial-gradient(farthest-side at top center, #f6ede8 60%, transparent 500px);
}

#wrapper .hero-card:before {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  transform: scaleY(0.8);
  filter: blur(35px);
  background: radial-gradient(farthest-side at center center, #eed8db 5%, transparent 180px), radial-gradient(farthest-side at bottom center, #f0c1bb 5%, transparent 180px), radial-gradient(farthest-side at left bottom, #ebc6c0 5%, transparent 180px), radial-gradient(farthest-side at left center, #dabbc3 5%, transparent 180px), radial-gradient(farthest-side at left top, #e7cdce 5%, transparent 180px), radial-gradient(farthest-side at right top, #bcb7d7 5%, transparent 180px), radial-gradient(farthest-side at right bottom, #bcb7d7 5%, transparent), radial-gradient(farthest-side at right center, #bcb7d7 5%, transparent), radial-gradient(farthest-side at top center, #f6ede8 60%, transparent 500px);
  z-index: 0;
}

#wrapper .hero-card .content-image {
  position: absolute;
  right: 0;
  top: 0.9rem;
  text-align: right;
}

#wrapper .hero-card .content-image img {
  width: 6rem;
  animation: float 6s ease-in-out infinite;
  margin-top: 6px;
  margin-right: 35px;

}

#wrapper .hero-card .card-content {
  padding: 25px;
  z-index: 1;
  position: relative;
}

#wrapper .hero-card .card-content h3 {
  margin-left: 5px;
  font-weight: 600;
  font-family: var(--font-family);
}

#wrapper .hero-card .card-content p {
  margin: 0;
  font-family: var(--font-family);
  font-size: 14px;
  font-weight: 400;
}

#wrapper .hero-card .card-content .content-input {
  margin-top: 5px;
  border-radius: 15px;
  /* max-width: 190px; */
  width: 8rem !important;
  margin-left: -7px;
  display: flex;
  flex-direction: row;
}

#wrapper .hero-card .card-content .content-input i {
  --ggs: 0.6;
  margin: 0;
  color: #b3aeab;
  flex: 0 0 16px;
}

#wrapper .hero-card .card-content .content-input input {
  padding: 0 10px;
  font-family: var(--font-family);
  width: 100%;
  outline: none;
  border: 0;
  color: #b3aeab;
  font-size: 12px;
}

button {
  font-size: 0.6rem !important;
}

#wrapper .segment-title {
  color: var(--color-light);
  font-family: var(--font-family);
  font-size: 18px;
  font-weight: 600;
  margin: 5px;
}

#wrapper .btn {
  display: inline-flex;
  color: var(--color-light);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
  background: transparent;
  transition: ease all 0.3s;
  text-decoration: none;
  font-family: var(--font-family);
  font-weight: 600;
  font-size: 12px;
}

#wrapper .btn i {
  color: var(--color-light);
}

#wrapper .btn:hover {
  background-color: var(--color-light);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0);
}

#wrapper .btn:hover i {
  color: var(--color-dark);
}

#wrapper .btn-primary {
  position: relative;
  padding: 12px 18px 12px 25px;
  color: var(--color-dark);
  border-radius: 18px;
  transition: ease all 0.3s;
  vertical-align: middle;
  background: radial-gradient(farthest-side at bottom center, #f0c1bb 25%, transparent 75%), radial-gradient(farthest-side at left bottom, #ebc6c0 25%, transparent 75%), radial-gradient(farthest-side at left center, #dabbc3 25%, transparent 75%), radial-gradient(farthest-side at left top, #e7cdce 25%, transparent 75%), radial-gradient(farthest-side at right top, #bcb7d7 25%, transparent 75%), radial-gradient(farthest-side at right bottom, #bcb7d7 25%, transparent 75%), radial-gradient(farthest-side at right center, #bcb7d7 25%, transparent 75%), radial-gradient(farthest-side at top center, #f6ede8 60%, transparent 100%), radial-gradient(farthest-side at center center, #eed8db 100%, transparent 100%);
  z-index: 2;
  display: inline-block;
}

#wrapper .btn-primary i {
  color: var(--color-dark);
  --ggs: 0.6;
  flex: 0 0 1;
  height: 14px;
}

#wrapper .btn-primary img {
  width: 8px;
  height: 7px;
  vertical-align: middle;
  margin-left: 5px;
}

#wrapper .btn-primary:before {
  pointer-events: none;
  content: "";
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  transition: ease all 0.3s;
  transform: scaleY(0.7);
  opacity: 0.6;
  filter: blur(35px);
  background: radial-gradient(farthest-side at bottom center, #f0c1bb 25%, transparent 75%), radial-gradient(farthest-side at left bottom, #ebc6c0 25%, transparent 75%), radial-gradient(farthest-side at left center, #dabbc3 25%, transparent 75%), radial-gradient(farthest-side at left top, #e7cdce 25%, transparent 75%), radial-gradient(farthest-side at right top, #bcb7d7 25%, transparent 75%), radial-gradient(farthest-side at right bottom, #bcb7d7 25%, transparent 75%), radial-gradient(farthest-side at right center, #bcb7d7 25%, transparent 75%), radial-gradient(farthest-side at top center, #f6ede8 60%, transparent 100%), radial-gradient(farthest-side at center center, #eed8db 100%, transparent 100%);
}

#wrapper .btn-primary:hover {
  transform: scale(1.05);
}

.custom-container {
  max-width: 100vw;
  margin-right: auto;
  margin-left: auto;
}

.custom-row {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.custom-col-4,
.custom-col-12 {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}

.custom-col-4 {
  flex: 0 0 33.33333%;
  max-width: 90vw;
}

.custom-col-6 {
  position: relative;
  /* width: 22rem !important; */
  padding-right: 15px;
  padding-left: 15px;
  flex: 0 0 50%;
  /* Takes up 50% of the container's width */
  max-width: 22rem;
  /* Does not grow beyond 50% of the container's width */
}


.custom-col-12 {
  flex: 0 0 100%;
  max-width: 100%;
}

.logout-button {
  position: absolute;
  right: 0;
  z-index: 1000;
  font-family: 'Raleway', sans-serif;
  font-weight: bold;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.instruction-list {
  margin-left: 1rem;
}

.instruction-list li {
  line-height: 1.4;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}

/*Animations*/
@keyframes wobble-hor-bottom {

  0%,
  100% {
    -webkit-transform: translateX(0%);
    transform: translateX(0%);
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
  }

  15% {
    -webkit-transform: translateX(-5px) rotate(-6deg);
    transform: translateX(-5px) rotate(-6deg);
  }

  30% {
    -webkit-transform: translateX(4px) rotate(6deg);
    transform: translateX(4px) rotate(6deg);
  }

  45% {
    -webkit-transform: translateX(-3px) rotate(-3.6deg);
    transform: translateX(-3px) rotate(-3.6deg);
  }

  60% {
    -webkit-transform: translateX(2px) rotate(2.4deg);
    transform: translateX(2px) rotate(2.4deg);
  }

  75% {
    -webkit-transform: translateX(-1px) rotate(-1.2deg);
    transform: translateX(-1px) rotate(-1.2deg);
  }
}

@keyframes fade-in-bottom {
  0% {
    -webkit-transform: translateY(50px);
    transform: translateY(50px);
    opacity: 0;
  }

  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scale-in-br {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    -webkit-transform-origin: 100% 100%;
    transform-origin: 100% 100%;
    opacity: 1;
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: 100% 100%;
    transform-origin: 100% 100%;
    opacity: 1;
  }
}

@keyframes flip-in-hor-top {
  0% {
    -webkit-transform: rotateX(-80deg);
    transform: rotateX(-80deg);
    opacity: 0;
  }

  100% {
    -webkit-transform: rotateX(0);
    transform: rotateX(0);
    opacity: 1;
  }
}

@keyframes swing-in-left-fwd {
  0% {
    -webkit-transform: rotateY(100deg);
    transform: rotateY(100deg);
    -webkit-transform-origin: left;
    transform-origin: left;
    opacity: 0;
  }

  100% {
    -webkit-transform: rotateY(0);
    transform: rotateY(0);
    -webkit-transform-origin: left;
    transform-origin: left;
    opacity: 1;
  }
}

@keyframes float {
  0% {
    transform: translatey(0px);
  }

  50% {
    transform: translatey(-20px);
  }

  100% {
    transform: translatey(0px);
  }
}
</style>