<template>
  <div class="all">
    <h1>Error</h1>
    <p>{{ this.message }}</p>

    <p>
      Already have an account?
      <router-link to="/login">Login here</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: "ErrorPage",
  data(){
    return {
      message : ''
    }
  },
  created() {
    this.message = this.$route.params.message;
    console.log("Params: ", this.message);
  },
};
</script>

<style scoped>
.all {
  text-align: center;
}
</style>
