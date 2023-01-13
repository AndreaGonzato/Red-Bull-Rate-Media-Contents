<template>
    <div class="account">
        <h1>Account</h1>

        <button @click.prevent="logout" class="btn btn-danger">Log out</button>
    </div>
</template>

<script>
import cookieManager from '@/cookieManager.js';

export default{
    name: "Account",
    methods: {
        logout(){
            this.$emit('message', {showAccount: false});
            cookieManager.removeJwtCookie();
            this.$router.push({ name: 'Home'} );
        }
    }
}
</script>

<style scoped>

.account{
    text-align: center;
}
</style>