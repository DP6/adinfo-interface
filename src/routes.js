import Parametrizacao from './components/parametrizacao/Parametrizacao.vue';
import Csv from './components/csv/Csv.vue';
import Template from './components/template/Template.vue';
import AtualizarConfiguracao from './components/atualizar_configuracao/AtualizarConfiguracao.vue';
import NovaConfiguracao from './components/nova_configuracao/NovaConfiguracao.vue';
import DependencyConfig from './components/dependency_config/DependencyConfig.vue';
import AlterarSenha from './components/alterar_senha/AlterarSenha.vue';
import Register from './components/register/Register.vue';
import Login from './views/Login.vue';
import Interface from './views/Interface.vue';

export const routes = [
    { path: '/', component: Interface, titulo:'Interface',
    children:[
        { path: 'parametrizacao', component: Parametrizacao, titulo: 'Parametrização', permission: 'admin|owner|user'},
        { path: 'csv', component: Csv, titulo: 'CSV', permission: 'admin|owner|user'},
        { path: 'template', component: Template, titulo: 'Template', permission: 'admin|owner|user'},
        { path: 'updateConfig', component: AtualizarConfiguracao, titulo: 'Atualizar Configuração', permission: 'admin|owner'},
        { path: 'newConfig', component: NovaConfiguracao, titulo: 'Nova Configuração', permission: 'admin|owner'},
        { path: 'register', component: Register, titulo: 'Registrar usuário', permission: 'admin|owner'},
        { path: 'dependencyConfig', component: DependencyConfig, titulo: 'Dependências', permission: 'admin|owner'},
        { path: 'alterarSenha', component: AlterarSenha, titulo: 'Alterar Senha', permission: 'admin|owner|user'}
    ]},
    { path: '/login', component: Login, titulo:'Login'},
];