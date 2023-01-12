<template>
    <div class="all">
        <h1>Error</h1>
        <p>{{ theMessage }}</p>
    </div>
</template>

<script>

export default{
    name: "ErrorPage",
    props: {
        theMessage : String
    }
}
</script>