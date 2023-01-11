<template>
    <div class="content">
        <p>title: {{ theTitle }}</p>
    </div>
</template>

<script>

export default{
    name: "MediaCOntent",
    props : {
        theTitle : String
    },

}
</script>