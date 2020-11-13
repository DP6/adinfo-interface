<template>
    <aside class="sidebar">
        <nav class="nav">
            <h2>ADINFO</h2>
            <ul>
                <li v-for="route in routes">
                    <a href="#">{{ route.titulo }}</a>
                </li>
            </ul>
        </nav>
    </aside>
</template>

<script>
export default {
    props: {
        routes: {
            required: true,
            type: Array
        }
    }
}
</script>

<style scoped>

* {
    margin: 0;
    padding: 0;
    list-style: none;
    text-decoration: none;
    font-family: 'Helvetica', sans-serif;
}

.sidebar {
    position: fixed;
    width: 300px;
    height: 100vh;
    font-size: 0.65em;
    background-image: linear-gradient(#3f2b96, #a8c0ff);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.nav {
    position: relative;
    margin: 0 25px;
    text-align: right;
    font-weight: bold;
}

h2 {
    text-align: center;
    margin: 50px 0;
    font-size: 30px;
    padding: 20px; 
    border: 2px solid white;
    color: white;
    font-weight: lighter;
    letter-spacing: 10px;
}

ul {
    list-style: none;
}

li {
    position: relative;
    margin: 3.2em 0;
}

a {
    line-height: 5em;
    text-transform: uppercase;
    text-decoration: none;
    letter-spacing: 0.4em;
    color: rgba(255, 255, 255, 0.35);
    display: block;
    transition: all ease-out 300ms;
}

li.active a {
    color: white;
}

li:not(.active)::after {
    opacity: 0.2;
}

li:not(.active):hover a {
    color: rgba(255, 255, 255, 0.75);
}

li::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 0.2em;
    background: black;
    left: 0;
    bottom: 0;
    background-image: linear-gradient(to right, #3f2b96, #a8c0ff);
}

</style>