import Parametrizacao from './components/parametrizacao/Parametrizacao.vue';
import Csv from './components/csv/Csv.vue';
import Template from './components/template/Template.vue';
import AtualizarConfiguracao from './components/atualizar_configuracao/AtualizarConfiguracao.vue';
import NovaConfiguracao from './components/nova_configuracao/NovaConfiguracao.vue';
import DependencyConfig from './components/dependency_config/DependencyConfig.vue';
import GerenciamentoUsuarios from './components/gerenciamento_usuarios/GerenciamentoUsuarios.vue';
import AlterarSenha from './components/alterar_senha/AlterarSenha.vue';
import Register from './components/register/Register.vue';
import Login from './views/Login.vue';
import Interface from './views/Interface.vue';
import CadastroCampaign from './components/cadastro_campaign/CadastroCampaign.vue';
import GerenciamentoCampaign from './components/gerenciamento_campaign/GerenciamentoCampaign.vue';
import ConsultaCampaign from './components/consulta_campaign/ConsultaCampaign.vue';


export const routes = [
    { path: '/', component: Interface, titulo:'Interface',
    children:[
        { path: 'parametrizacao', component: Parametrizacao, titulo: 'Parametrização', permission: 'admin|owner|agencyOwner|user', group: 'Parametrizar', icon: 'outlined_flag'},
        { path: 'listCampaigns', component: ConsultaCampaign, titulo: 'Consultar CSVs', permission: 'admin|owner|agencyOwner|user', group: 'Campanhas', icon: 'campaign'},
        { path: 'newCampaign', component: CadastroCampaign, titulo: 'Cadastrar Campanha', permission: 'admin|owner|agencyOwner', group: 'Campanhas', icon: 'campaign'},
        { path: 'gerenciamentoCampanhas', component: GerenciamentoCampaign, titulo: 'Gerenciar Campanha', permission: 'admin|owner|agencyOwner', group: 'Campanhas', icon: 'campaign'},
        { path: 'template', component: Template, titulo: 'Template', permission: 'admin|owner|agencyOwner|user', group: 'Parametrizar', icon: 'outlined_flag'},
        { path: 'updateConfig', component: AtualizarConfiguracao, titulo: 'Atualizar Configuração', permission: 'admin|owner|agencyOwner|user', group: 'Configurações', icon: 'settings'},
        { path: 'newConfig', component: NovaConfiguracao, titulo: 'Nova Configuração', permission: 'admin|owner', group: 'Configurações', icon: 'settings'},
        { path: 'register', component: Register, titulo: 'Registrar usuário', permission: 'admin|owner|agencyOwner', group: 'Usuários', icon: 'people'},
        { path: 'dependencyConfig', component: DependencyConfig, titulo: 'Dependências', permission: 'admin|owner|agencyOwner|user', group: 'Configurações', icon: 'settings'},
        { path: 'alterarSenha', component: AlterarSenha, titulo: 'Alterar Senha', permission: 'admin|owner|agencyOwner|user', group: '', icon: 'lock'},
        { path: 'gerenciamentoUsuarios', component: GerenciamentoUsuarios, titulo: 'Gerenciamento de Usuários', permission: 'admin|owner|agencyOwner', group: 'Usuários', icon: 'people'}
    ]},
    { path: '/login', component: Login, titulo:'Login'},
];