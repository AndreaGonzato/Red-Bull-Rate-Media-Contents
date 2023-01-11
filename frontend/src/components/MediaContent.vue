<template>
    <div class="content">
        <p><b>{{ theTitle }}</b></p>

        <button @click.prevent="viewVideo">
            <img v-bind:src="previewImgUrl" @click.prevent="viewVideo"/>
        </button>
        
    </div>
</template>

<script>

export default{
    name: "MediaContent",
    props : {
        theTitle : String,
        previewImgUrl: String
    },
    methods:{
        viewVideo(){
            console.log("To implement");
        }
    }

}
</script>

<style scoped>

img{
    max-height: 250px;
}
</style>