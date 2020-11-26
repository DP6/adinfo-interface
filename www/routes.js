import Parametrizacao from './components/parametrizacao/Parametrizacao.vue';
import Csv from './components/csv/Csv.vue';
import Template from './components/template/Template.vue';
import Configuracao from './components/configuracao/Configuracao.vue';

export const routes = [
    { path: '/parametrizacao', component: Parametrizacao, titulo: 'Parametrização'},
    { path: '/csv', component: Csv, titulo: 'CSV'},
    { path: '/template', component: Template, titulo: 'Template'},
    { path: '/config', component: Configuracao, titulo: 'Configuração'}
];