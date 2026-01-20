<script setup>
import { ref } from 'vue'

const user = ref(null)

const handleLogin = (userData) => {
    user.value = userData
}

</script>

<template>
    <div id="app">
        <router-view @login="handleLogin" />
    </div>
</template>



<style scoped>
#app {
    width: 100%;
    min-height: 100vh;
}
</style>
