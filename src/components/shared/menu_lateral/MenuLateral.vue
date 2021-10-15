<template>
    <aside class="sidebar">
        <!-- <div class="logo-details">
            <i class="material-icons menu bx-menu">menu</i>
        </div> -->
        <h2>ADINFO</h2>
        <ul class="nav-links">
            <li class="item-menu" v-for="menu in menus" :key="menu.titulo">
                <div v-if="!menu.grupo">
                    <router-link :to="menu.atributos[0].path">
                        <i class='bx bx-grid-alt material-icons'>{{menu.atributos[0].icon}}</i>
                        <span class="link_name">{{menu.atributos[0].titulo}}</span>
                    </router-link>
                    <ul class="sub-menu blank">
                        <li><router-link :to="menu.atributos[0].path" class="link_name">{{menu.atributos[0].titulo}}</router-link></li>
                    </ul>
                </div>
                <div v-else>
                    <div class="icon-link">
                        <a>
                            <i class='bx bx-collection material-icons'>{{menu.atributos[0].icon}}</i>
                            <span class="link_name">{{menu.atributos[0].grupo}}</span>
                        </a>
                        <i class='bx bxs-chevron-down material-icons arrow'>expand_more</i>
                    </div>
                    <ul class="sub-menu">
                        <li><a class="link_name material-icons" href="#">{{menu.atributos[0].icon}}</a></li>
                        <li v-for="submenu in menu.atributos" :key="submenu.titulo">
                            <router-link :to="submenu.path">{{submenu.titulo}}</router-link>
                        </li>
                    </ul>
                </div>
            </li>            
            <li>
                <div class="logout-section">
                    <div class="logout-content">
                        <botao-logout class="logout"></botao-logout>
                    </div>
                    <div>
                        <div class="logout-text">Logout</div>
                    </div>
                </div>
            </li>
        </ul>
        <!-- https://www.codinglabweb.com/2021/06/dropdown-sidebar-menu-html-css.html -->
    </aside>
</template>

<script>
import BotaoLogout from '../botao_logout/BotaoLogout.vue';

export default {
    components: {
        'botao-logout': BotaoLogout,
    },
    props: {
        routes: {
            required: true,
            type: Array
        }
    },
    data() {
        return {
            interfaceChildren : this.routes[0]
                .children
                .filter(route => route.permission.indexOf(localStorage.getItem("permission")) > -1),
            permission: localStorage.getItem("permission"),
            menus: [] 
        }
    },
    created() {
        console.log(this.interfaceChildren)
        this.interfaceChildren.forEach(interfaceChild => {
            if(interfaceChild.group) {
                const grupoJaExiste = this.menus.filter(menu => menu.nome === interfaceChild.group).length > 0;
                if(grupoJaExiste) {
                    this.menus = this.menus.map(item => {
                        if(item.nome === interfaceChild.group) {
                            item.atributos.push({
                                'titulo': interfaceChild.titulo,
                                'grupo': interfaceChild.group,
                                'icon': interfaceChild.icon,
                            'path': interfaceChild.path
                            })
                        }
                        return item;
                    });
                } else {
                    this.menus.push({
                        nome: interfaceChild.group,
                        grupo: true,
                        atributos: [{
                            'titulo': interfaceChild.titulo,
                            'grupo': interfaceChild.group,
                            'icon': interfaceChild.icon,
                            'path': interfaceChild.path
                        }]
                    });
                }
            } else {
                this.menus.push({
                    nome: interfaceChild.titulo,
                    grupo: false,
                    atributos: [{
                        'titulo': interfaceChild.titulo,
                        'grupo': interfaceChild.group,
                        'icon': interfaceChild.icon,
                        'path': interfaceChild.path
                    }]
                });
            }
        });
    },
    mounted() {
        const arrow = document.querySelectorAll(".arrow");
        for (var i = 0; i < arrow.length; i++) {
            arrow[i].parentElement.parentElement.parentElement.addEventListener("click", (e) => {
                let targetParent = e.target;
                while(targetParent.tagName !== 'LI') {
                    targetParent = targetParent.parentElement;
                }
                targetParent.classList.toggle("showMenu");
            });
        }

        const itensMenu = document.querySelectorAll(".item-menu");
        itensMenu[itensMenu.length - 1].classList.add("last-item-menu");

        const sidebar = document.querySelector(".sidebar");
        const sidebarBtn = document.querySelector(".bx-menu");
        sidebarBtn.addEventListener("click", ()=>{
            sidebar.classList.toggle("close");
        });
    }
}

</script>

<style scoped>

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    h2 {
        text-align: center;
        margin-top: 40px;
        margin-right: 40px;
        margin-bottom: 10px;
        margin-left: 40px;
        font-size: 30px;
        padding: 20px;
        border: 2px solid white;
        color: white;
        font-weight: lighter;
        letter-spacing: 10px;
    }

    .sidebar.close h2 {
        display: none;
    }

    .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 300px;
        background: #11101d;
        z-index: 100;
        transition: all 0.5s ease;
    }

    .menu {
        cursor: pointer;
    }

    .sidebar .item-menu {
        cursor: pointer;
    }

    .last-item-menu {
        margin-bottom: 45px;
    }

    .sidebar.close {
        width: 78px;
    }
    
    .sidebar .logo-details {
        height: 60px;
        width: 100%;
        display: flex;
        align-items: center;
    }

    .sidebar .logo-details i {
        font-size: 30px;
        color: #fff;
        height: 50px;
        min-width: 78px;
        text-align: center;
        line-height: 50px;
    }

    .sidebar .logo-details .logo_name {
        font-size: 22px;
        color: #fff;
        font-weight: 600;
        transition: 0.3s ease;
        transition-delay: 0.1s;
    }

    .sidebar.close .logo-details .logo_name {
        transition-delay: 0s;
        opacity: 0;
        pointer-events: none;
    }

    .sidebar .nav-links {
        height: 100%;
        padding: 30px 0 150px 0;
        overflow: auto;
    }

    .sidebar.close .nav-links {
        overflow: visible;
    }
    
    .sidebar .nav-links::-webkit-scrollbar {
        display: none; 
    }

    .sidebar .nav-links li {
        position: relative;
        list-style: none;
        transition: all 0.4s ease;
    }

    .sidebar .nav-links li:hover {
        background: #1d1b31;
    }

    .sidebar .nav-links li .icon-link {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .sidebar.close .nav-links li .icon-link {
        display: block
    }

    .sidebar .nav-links li i {
        height: 50px;
        min-width: 70px;
        text-align: center;
        line-height: 50px;
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .sidebar .nav-links li i.arrow {
        text-align: right;
        padding-right: 15px;
    }

    .sidebar .nav-links li.showMenu i.arrow{
        transform: rotateX(-180deg);
    }

    .sidebar.close .nav-links i.arrow {
        display: none;
    }

    .sidebar .nav-links li a {
        display: flex;
        align-items: center;
        text-decoration: none;
    }

    .sidebar .nav-links li a .link_name {
        font-size: 18px;
        font-weight: 400;
        color: #fff;
        transition: all 0.4s ease;
    }

    .sidebar.close .nav-links li a .link_name {
        opacity: 0;
        pointer-events: none;
    }

    .sidebar .nav-links li .sub-menu {
        padding: 6px 6px 14px 80px;
        margin-top: -10px;
        background: #1d1b31;
        display: none;
    }

    .sidebar .nav-links li.showMenu .sub-menu {
        display: block;
    }

    .sidebar .nav-links li .sub-menu a {
        color: #fff;
        font-size: 15px;
        padding: 5px 0;
        white-space: nowrap;
        opacity: 0.6;
        transition: all 0.3s ease;
    }

    .sidebar .nav-links li .sub-menu a:hover {
        opacity: 1;
    }

    .sidebar.close .nav-links li .sub-menu {
        position: absolute;
        left: 100%;
        top: -10px;
        margin-top: 0;
        padding: 10px 20px;
        border-radius: 0 6px 6px 0;
        opacity: 0;
        display: block;
        pointer-events: none;
        transition: 0s;
    }

    .sidebar.close .nav-links li:hover .sub-menu {
        top: 0;
        opacity: 1;
        pointer-events: auto;
        transition: all 0.4s ease;
    }

    .sidebar .nav-links li .sub-menu .link_name {
        display: none;
    }

    .sidebar.close .nav-links li .sub-menu .link_name {
        font-size: 18px;
        opacity: 1;
        display: block;
    }

    .sidebar .nav-links li .sub-menu.blank {
        opacity: 1;
        pointer-events: auto;
        padding: 3px 20px 6px 16px;
        opacity: 0;
        pointer-events: none;
    }

    .sidebar .nav-links li:hover .sub-menu.blank {
        top: 50%;
        transform: translateY(-50%);
    }

    .sidebar .logout-section {
        position: fixed;
        bottom: 0;
        width: 300px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #1d1b31;
        padding: 12px 0;
        transition: all 0.5s ease;
    }

    .sidebar.close .logout-section {
        background: none;
    }

    .sidebar.close .logout-section {
        width: 78px;
    }

    .sidebar .logout-section .logout-content {
        display: flex;
        align-items: center;
    }

    .sidebar .logout-section img {
        height: 52px;
        width: 52px;
        object-fit: cover;
        border-radius: 16px;
        margin: 0 14px 0 12px;
        background: #1d1b31;
        transition: all 0.5s ease;
    }

    .sidebar.close .logout-section .logout {
        height: 52px;
        width: 52px;
        object-fit: cover;
        border-radius: 16px;
        margin: 0 14px 0 12px;
        transition: all 0.5s ease;
    }

    .sidebar.close .logout-section img,
    .sidebar.close .logout-section .logout {
        padding: 10px;
    }

    .sidebar .logout-section {
        display: block;
    }

    .sidebar .logout-section .logout {
        display: block;
        margin: 0 auto;
    }

    .sidebar .logout-section .logout-text {
        color: #fff;
        font-size: 18px;
        font-weight: 500;
        white-space: nowrap;
        text-align: center;
    }

    .sidebar.close .logout-section i,
    .sidebar.close .logout-section .logout-text {
        display: none;
    }

    .home-section {
        position: relative;
        background: #E4E9F7;
        height: 100vh;
        left: 260px;
        width: calc(100% - 260px);
        transition: all 0.5s ease;
    }

    .sidebar.close ~ .home-section {
        left: 78px;
        width: calc(100% - 78px);
    }

    .home-section .home-content {
        height: 60px;
        display: flex;
        align-items: center;
    }

    .home-section .home-content .bx-menu,
    .home-section .home-content .text {
        color: #11101d;
        font-size: 35px;
    }

    .home-section .home-content .bx-menu {
        margin: 0 15px;
        cursor: pointer;
    }

    .home-section .home-content .text {
        font-size: 26px;
        font-weight: 600;
    }

    @media (max-width: 420px)  {
        .sidebar.close .nav-links li .sub-menu {
            display: none;
        }
    }

</style>