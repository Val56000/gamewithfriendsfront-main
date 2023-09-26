<script setup>
import axios from 'axios';
import { ref, onMounted, onBeforeMount } from "vue";

const instanceId = ref(parseInt(sessionStorage.getItem('keyInstance')));

const scoresUsers = ref();


//Récupérer tous les scores utilisateurs
onBeforeMount(async () => {
    await axios.post('http://localhost/gamewithfriendsback/Score/get_scores.php', { gameInstanceId: instanceId.value }).then(response => {
        scoresUsers.value = response.data;
    });

})


</script>


<template>
    <div class="flex-column align-center justify-center margin-bottom4 ">
        <!-- <i class="fa-solid fa-house position-fixed top-0 left-0 margin-top0-5 margin-left0-5 size1-5 cursor-pointer"
                @click="logOff"></i> -->
      <div class="size1-5">Classement final <i class="fa-solid fa-trophy"></i></div>
      <v-divider :thickness="2" ></v-divider>
        <v-table theme="dark" class="margin-top1 border-radius">
            <thead>
                <tr>
                    <th class="text-left">
                        Position
                    </th>
                    <th class="text-left">
                        Nom
                    </th>
                    <th class="text-align-center">
                        Score
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in scoresUsers" :key="item.name">
                    <td >{{ index+1 }}</td>
                    <td>{{ item.userName }}</td>
                    <td class="text-align-center">{{ item.score }}</td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>