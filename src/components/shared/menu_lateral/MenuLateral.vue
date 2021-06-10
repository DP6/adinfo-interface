<template>
    <aside class="sidebar">
        <div class="fixed">
            <nav class="nav">
                <div class="logo">
                    <h2>ADINFO</h2>
                    <img src="../../../assets/samsung-logo-pr-bw.png"/>
                </div>
                
                <ul>
                    <li v-for="route in interfaceChilds" :key="route">
                        <router-link class="opcao" :to="route.path">{{ route.titulo }}</router-link>
                    </li>
                </ul>
            </nav>
        </div>
    </aside>
</template>

<script>

export default {
    props: {
        routes: {
            required: true,
            type: Array
        }
    },
    data() {
        return {
            interfaceChilds : this.routes[0]
                .children
                .filter(route => route.permission.indexOf(localStorage.getItem("permission")) > -1),
            permission: localStorage.getItem("permission"),
        }
    },
}

</script>

<style scoped>

* {
    margin: 0;
    padding: 0;
    list-style: none;
    text-decoration: none;
}

.sidebar {
    width: 300px;
    height: 100%;
    font-size: 12px;
    position: absolute;
    background-color: #001522;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    padding-left: 10px;
}

.fixed {
    position: fixed;
    width: 280px;
}

.nav {
    position: relative;
    margin: 0 25px;
    text-align: right;
    font-weight: bold;
    height: 100%;
}

.logo h2 {
    text-align: start;
    margin: 30px 0 -5px 40px;
    font-size: 14px;
    color: #C5C3C3;
    font-weight: lighter;
    letter-spacing: 1px;
}

.logo img {
    width: 160px;
    display: flex;
    margin: 0 auto;
}

ul {
    list-style: none;
    padding: 0 0 0 auto;
}

li {
    position: relative;
    margin: 15px 0;
}

.opcao {
    line-height: 5em;
    text-transform: uppercase;
    text-decoration: none;
    letter-spacing: 2px;
    color: white!important;
    display: block;
    transition: all ease-out 300ms;
}

li.active .opcao {
    color: white;
}

li:not(.active)::after {
    opacity: 0.2;
}

li:not(.active):hover .opcao {
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

footer {
    position: fixed;
    bottom: 25px;
}

footer img {
    height: 40px;
    margin-left: 20px;
}

</style>