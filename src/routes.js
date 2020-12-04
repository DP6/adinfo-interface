import Parametrizacao from './components/parametrizacao/Parametrizacao.vue';
import Csv from './components/csv/Csv.vue';
import Template from './components/template/Template.vue';
import AtualizarConfiguracao from './components/atualizar_configuracao/AtualizarConfiguracao.vue';
import NovaConfiguracao from './components/nova_configuracao/NovaConfiguracao.vue';

export const routes = [
    { path: '/parametrizacao', component: Parametrizacao, titulo: 'Parametrização'},
    { path: '/csv', component: Csv, titulo: 'CSV'},
    { path: '/template', component: Template, titulo: 'Template'},
    { path: '/updateConfig', component: AtualizarConfiguracao, titulo: 'Atualizar Configuração'},
    { path: '/newConfig', component: NovaConfiguracao, titulo: 'Nova Configuração'}
];