<script setup>
import axios from 'axios';
import { ref, reactive } from "vue";
import Home from "./Home.vue";

const userId = ref();
const username = ref();
const userData = reactive({ userName: username });
const path = ref('login');


function returnComponent(backButtonValue) {
	if (backButtonValue.value == true) {
		path.value = 'login';
	}
}




function login() {
	try {
		// Effectuez une requête HTTP POST vers votre script PHP de connexion pour créer l'utilisateur
		axios.post('http://localhost/gamewithfriendsback/create_users.php', userData).then(response => {
			if (response.data.success == true) {

				userId.value = response.data.userId;
				sessionStorage.setItem('userId', userId.value);
				sessionStorage.setItem('userName', username.value);

				// Redirigez l'utilisateur vers la page d'accueil 
				path.value = 'home';
			}
		})

	} catch (error) {
		console.error("Une erreur s'est produite : " + error);
	}
}

</script>

<template>
	<div>
		<!-- Contenu existant -->
		<div v-if="path == 'login'" class="iphone-x">
			<div class="content">
				<main>
					<div class="launch">
						<div class="intro">
							<div class="intro__title raleway">GameWithFriends</div>
							<!-- Intégration du formulaire ici -->
							<form @submit.prevent="login" class="margin-bottom1 width-90vw flex flex-column align-center">
								<div style="width: 280px;">
									<v-text-field label="Prénom" v-model="username" variant="outlined"
										required></v-text-field>
								</div>
								<div class="intro__button">
									<v-btn type="submit">
										Valider
									</v-btn>
								</div>
							</form>
						</div>
						<div class="wrapper-images">
							<div class="images-line">
								<div class="line" style="background-image:url('../assets/img/1.png')">
									<div class="img" style="background-image:url('../assets/img/1.png')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/2.jpg')">
									<div class="img" style="background-image:url('../assets/img/2.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/3.jpg')">
									<div class="img" style="background-image:url('../assets/img/3.pnjpgg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/4.jpg')">
									<div class="img" style="background-image:url('../assets/img/4.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/5.jpg')">
									<div class="img" style="background-image:url('../assets/img/5.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/1.png')">
									<div class="img" style="background-image:url('../assets/img/1.png')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/2.jpg')">
									<div class="img" style="background-image:url('../assets/img/2.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/3.jpg')">
									<div class="img" style="background-image:url('../assets/img/3.pnjpgg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/4.jpg')">
									<div class="img" style="background-image:url('../assets/img/4.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/5.jpg')">
									<div class="img" style="background-image:url('../assets/img/5.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/1.png')">
									<div class="img" style="background-image:url('../assets/img/1.png')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/2.jpg')">
									<div class="img" style="background-image:url('../assets/img/2.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/3.jpg')">
									<div class="img" style="background-image:url('../assets/img/3.pnjpgg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/4.jpg')">
									<div class="img" style="background-image:url('../assets/img/4.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/5.jpg')">
									<div class="img" style="background-image:url('../assets/img/5.jpg')"></div>
								</div>
							</div>
							<div class="images-line">
								<div class="line" style="background-image:url('../assets/img/6.jpg')">
									<div class="img" style="background-image:url('../assets/img/6.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/7.jpg')">
									<div class="img" style="background-image:url('../assets/img/7.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/8.jpg')">
									<div class="img" style="background-image:url('../assets/img/8.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/9.jpg')">
									<div class="img" style="background-image:url('../assets/img/9.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/10.jpg')">
									<div class="img" style="background-image:url('../assets/img/10.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/6.jpg')">
									<div class="img" style="background-image:url('../assets/img/6.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/7.jpg')">
									<div class="img" style="background-image:url('../assets/img/7.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/8.jpg')">
									<div class="img" style="background-image:url('../assets/img/8.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/9.jpg')">
									<div class="img" style="background-image:url('../assets/img/9.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/10.jpg')">
									<div class="img" style="background-image:url('../assets/img/10.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/6.jpg')">
									<div class="img" style="background-image:url('../assets/img/6.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/7.jpg')">
									<div class="img" style="background-image:url('../assets/img/7.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/8.jpg')">
									<div class="img" style="background-image:url('../assets/img/8.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/9.jpg')">
									<div class="img" style="background-image:url('../assets/img/9.jpg')"></div>
								</div>
								<div class="line" style="background-image:url('../assets/img/10.jpg')">
									<div class="img" style="background-image:url('../assets/img/10.jpg')"></div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
		<Home v-if="path == 'home'" @returnComponent="returnComponent" />

	</div>
</template>

<style scoped>
/* Cacher des éléments de vuetify inutile  */



body {
	background: #f4f6fc;
	min-height: 100vh;
	flex-direction: row;
	flex-wrap: wrap;
}

@media (min-width: 375px) {
	body {
		align-items: center;
	}
}

.iphone-x {
	position: relative;
	margin: 0px auto;
	width: 100%;
	height: 100vh;
	background-color: #fbfbfb;
	border-radius: 0;
	box-shadow: 0px 0px 0px 11px #f1f1f1, 0px 0px 0px 13px #eee, 0px 0px 0px 20px #ececec, 0 55px 40px #000;
}

.iphone-x:after {
	bottom: 7px;
	width: 140px;
	height: 4px;
	background-color: #f1f1f1;
	border-radius: 10px;
}

.iphone-x:before {
	top: 0px;
	width: 56%;
	height: 30px;
	background-color: #f1f1f1;
	border-radius: 0px 0px 40px 40px;
	z-index: 2;
}

.iphone-x i,
.iphone-x b,
.iphone-x s,
.iphone-x .content {
	position: absolute;
	display: block;
	color: transparent;
}

.iphone-x i {
	top: 0px;
	left: 50%;
	transform: translate(-50%, 6px);
	height: 8px;
	width: 15%;
	background-color: #dfdfdf;
	border-radius: 8px;
	box-shadow: inset 0px -3px 3px 0px rgba(256, 256, 256, 0.2);
	z-index: 3;
}

.iphone-x b {
	left: 10%;
	top: 0px;
	transform: translate(180px, 4px);
	width: 12px;
	height: 12px;
	background-color: #d5d5d5;
	border-radius: 12px;
	box-shadow: inset 0px -3px 2px 0px rgba(256, 256, 256, 0.2);
	z-index: 3;
}

.iphone-x b:after {
	content: "";
	position: absolute;
	background-color: #adadad;
	width: 6px;
	height: 6px;
	top: 2px;
	left: 2px;
	top: 3px;
	left: 3px;
	display: block;
	border-radius: 4px;
	box-shadow: inset 0px -2px 2px rgba(0, 0, 0, 0.2);
}

.iphone-x .content {
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow-x: hidden;
	z-index: 1;
	color: red;
	background: #fbfbfb;
	position: relative;
	border-radius: 0;
}

@media (min-width: 375px) {
	.iphone-x .content {
		border-radius: 40px;
	}
}

main {
	font-family: "Poppins", sans-serif;
	/* color: #fbfbfb; */
	color: #000 !important;
	position: relative;
	height: 100%;
}

.intro {
	position: absolute;
	bottom: 0;
	width: 100%;
	left: 0;
	height: 50%;
	padding: 1rem;
	padding-top: 4rem !important;
	background: linear-gradient(transparent, white, white, white);
	z-index: 2;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.intro__title {
	text-align: center;
	font-weight: 700;
	font-size: 2rem;
	color: #262a2f;
	margin-bottom: 1.5rem;
}

.intro__description {
	text-align: center;
	font-weight: 400;
	font-size: 1rem;
	color: rgba(0, 0, 0, 0.35);
	margin-bottom: 1.5rem;
}

.intro__button button {
	border: 0;
	outline: none;
	padding: 0rem 2.5rem;
	background: #f4b7a8;
	border-radius: 60px;
	font-size: 12px;
	font-weight: 700;
	color: #fbfbfb;
	transition: ease all 0.3s;
	margin-top: -20px !important;
}

.intro__button button:hover {
	background: #ff6f4c;
}

.launch {
	overflow: hidden;
	position: relative;
	height: 100%;
}

.launch .wrapper-images {
	display: flex;
	flex-direction: column;
	height: 150vh;
	justify-content: center;
	left: 50%;
	position: absolute;
	top: 30%;
	opacity: 0.8;
	transform: translate3d(-50%, -50%, 0) perspective(800px) rotatey(10deg) rotate(-10deg);
}

.launch .images-line {
	animation: runner 20s linear infinite;
	display: flex;
	transform: translateX(23%);
}

.launch .images-line:nth-child(even) {
	animation-duration: 30s;
}

.launch .images-line .line {
	background-position: 50% 50%;
	background-size: cover;
	flex: none;
	width: 7rem;
	height: 10em;
	margin: clamp(10px, 2vw, 20px);
	position: relative;
	transition: ease-in-out all 0.3s;
	border-radius: 1rem;
}

.launch .images-line .line .img {
	position: absolute;
	z-index: 2;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background-position: 50% 50%;
	background-size: cover;
	transition: ease-in-out all 0.3s;
	overflow: hidden;
	border-radius: 1rem;
}

.launch .images-line .line:hover .img {
	cursor: pointer;
	transform: scale(1.1) translatez(0px);
}

.launch .images-line .line:hover:after {
	filter: blur(35px) opacity(0.8);
}

.launch .images-line .line:after {
	content: "";
	background: inherit;
	display: block;
	width: 100%;
	height: 100%;
	border-radius: 50%;
	top: 3vh;
	position: absolute;
	background-size: cover;
	z-index: -1;
	transition: ease-in-out all 0.3s;
	filter: blur(25px) opacity(0.8);
}

.hero {
	aspect-ratio: 1;
	background: var(--bg) no-repeat center center;
	background-size: 120% 120%;
	background-position: 100% 50%;
	margin-bottom: 1rem;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: flex-end;
	padding: 1rem;
}

.hero__title {
	font-weight: 700;
	font-size: clamp(1.5rem, 4vw, 2.2rem);
	margin-bottom: 0.5rem;
}

.hero__price {
	font-weight: 500;
	font-size: 1.2rem;
	padding: 0.7rem 1rem;
	background: #000;
	border-radius: 1.2rem;
	backdrop-filter: blur(10px);
	box-shadow: 1px 1px 0 0 #000;
}

.hero__price span {
	font-weight: 700;
}

.card-nft {
	aspect-ratio: 0.7666666667;
	background: var(--bg) no-repeat center center;
	background-size: auto 100%;
	border-radius: 35px;
	padding: 10px;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	transition: ease all 0.3s;
	position: relative;
	overflow: hidden;
}

.card-nft:hover {
	background-size: auto 110%;
}

.card-nft:after {
	position: absolute;
	content: "";
	background: linear-gradient(transparent, #000);
	height: 50%;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 0;
}

.card-nft>* {
	z-index: 1;
}

.card-nft__title {
	font-weight: 700;
	font-size: 1.1rem;
}

.card-nft__deal {
	border: 0;
	border-radius: 100%;
	width: 32px;
	height: 32px;
}

.card-nft__deal svg {
	transition: ease all 0.2s;
	transform-origin: bottom right;
}

.card-nft__deal:hover svg {
	transform: rotate(10deg);
}

.card-nft__price {
	font-weight: 500;
	font-size: 0.6rem;
	padding: 0.7rem 0.5rem;
	background: #000;
	border-radius: 1rem;
	backdrop-filter: blur(10px);
	box-shadow: 1px 1px 0 0 #000;
}

.card-nft__price span {
	font-weight: 700;
}

.filters>button {
	background: #303841;
	border: 0;
	outline: none;
	color: #fbfbfb;
}

.filters>button .icon {
	background: #fbfbfb;
}

.filters>button .icon svg {
	stroke: #303841;
}

.menu {
	position: sticky;
	bottom: 1rem;
	left: 50%;
	transform: translatex(-50%);
	width: fit-content;
	z-index: 3;
}

.menu>button {
	background: #303841;
	border: 0;
	outline: none;
	color: #fbfbfb;
	box-shadow: 0 10px 20px -5px #000;
}

@keyframes runner {
	to {
		transform: translateX(-10.3%);
	}
}
</style>