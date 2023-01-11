<template>
    <div class="content">
        <p><b>{{ theTitle }}</b></p>

        <button @click.prevent="toggleShowVideo">
            <img v-bind:src="previewImgUrl"/>
        </button>


        <div v-if="this.showVideo">
            <button @click.prevent="toggleShowVideo"  class="btn btn-primary close-button">Close</button>
        </div>
        

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
            showVideo : false
        }
    },
    methods:{
        toggleShowVideo(){
            this.showVideo = !this.showVideo;
            console.log(this.showVideo); // TODO remove
        }
    }

}
</script>

<style scoped>

img{
    max-height: 250px;
}
</style>