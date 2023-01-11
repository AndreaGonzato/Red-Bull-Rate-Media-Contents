<template>
    <div class="content">
        <p><b>{{ theTitle }}</b></p>

        <button @click.prevent="toggleViewVideo">
            <img v-bind:src="previewImgUrl"/>
        </button>

        <p>{{ contentUrl }}</p>
        
    </div>
</template>

<script>

export default{
    name: "MediaContent",
    props : {
        theTitle : String,
        previewImgUrl: String,
        contentUrl: String
    },
    data(){
        return {
            viewVideo : false
        }
    },
    methods:{
        toggleViewVideo(){
            this.viewVideo = !this.viewVideo;
            console.log(this.viewVideo);
        }
    }

}
</script>

<style scoped>

img{
    max-height: 250px;
}
</style>