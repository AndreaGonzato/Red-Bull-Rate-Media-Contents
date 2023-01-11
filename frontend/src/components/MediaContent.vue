<template>
    <div class="content">
        <p><b>{{ theTitle }}</b></p>
        <img v-bind:src="previewImgUrl"/>
    </div>
</template>

<script>

export default{
    name: "MediaCOntent",
    props : {
        theTitle : String,
        previewImgUrl: String
    },

}
</script>

<style scoped>

img{
    max-height: 250px;
}
</style>