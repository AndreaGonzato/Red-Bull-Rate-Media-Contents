<template>
  <div class="account">
    <h1>Account</h1>

    <div class="container text-center info">
      <div class="row align-items-start">
        <div class="col data-type">Username:</div>
        <div class="col data">{{ this.username }}</div>
      </div>
      <div class="row align-items-start">
        <div class="col data-type">Email:</div>
        <div class="col data">{{ this.email }}</div>
      </div>
    </div>



    <button @click.prevent="logout" class="btn btn-danger">Log out</button>
  </div>
</template>

<script>
import cookieManager from "@/cookieManager.js";
import userManager from "@/userManager.js";

export default {
  name: "Account",
  data() {
    return {
      username: "",
      email: "",
    };
  },
  async mounted() {
    const user = await userManager.whoami();
    this.username = user.username;
    this.email = user.email;
  },
  methods: {
    logout() {
      this.$emit("message", { showAccount: false });
      cookieManager.removeJwtCookie();
      this.$router.push({ name: "Home" });
    },
  },
};
</script>

<style scoped>
.account {
  text-align: center;
}

.info{
    max-width: 400px;
    margin-top: 5em;
    margin-bottom: 5em;
}
.data-type{
    text-align: right;
}
.data{
    text-align: left;
}
</style>
