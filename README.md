# interface-adinfo

> A Vue.js project

# Interface-Adinfo

<div align="center"> <img src="https://raw.githubusercontent.com/DP6/templates-centro-de-inovacoes/main/public/images/centro_de_inovacao_dp6.png" height="100px" /> </div> <div align="center"> <img src="https://img.shields.io/codacy/grade/6276f660577e41e0a7b7e4605c4f0434"> <img src="https://img.shields.io/codacy/coverage/6276f660577e41e0a7b7e4605c4f0434"> <img src="https://img.shields.io/github/issues/DP6/penguin-adinfo"> <img src="https://img.shields.io/github/license/DP6/penguin-adinfo"> </div>

  **ADInfo-interface** é a interface do [penguin ADinfo](https://github.com/DP6/adinfo-interface) ferramenta que foi desenvolvida para facilitar o controle e padronização do uso de parametrização e nomenclatura de mídia digital. Os principais componentes no uso da aplicação são a configuração, um JSON contendo quais campos são aceitos na taxonomia de mídia, o permissionamento para controle de ações permitidas por nível de acesso, e o arquivo de parametrização, um CSV contendo a lista de URLs e os campos preenchidos conforme o que foi configurado.

> A interface do ADinfo, é baseada em **Vue.js**, **Node.js** & **Html & Css**, e atualmente esta sendo hospedada no **App Engine**, tendo as configurações de ambiente feitas por **App.yaml**. Também contamos com **Babelrc** para transpilar códigos e manter a compatibilidade com navegadores.

# Funcionalidade

![](https://lh4.googleusercontent.com/HMY0_gjwrD_ysy5o73A76X_FlpaVyVVyIguCZdmgk4DJ_15dLs4_yilPItgmn-6iUETTSEzTZl4Fn3GzOs3K_5IBM7bUEd1wlNmgnAs8PE-uYrBgnVlta55-TNQW_c0XUP9YjuCSzsJTBDi-C2PBiSw)

 Nossa interface foi idealizada para **simplificar** e **otimizar** a parametrização de links de forma altamente costumizável, sendo uma ferramenta descomplicada de se utilizar e que irá centralizar de **forma segura** as informações mais relevantes do seu negócio.
Por meio de controle de acessos, histórico de campanhas e versionamento de taxonomia, torna a interface do ADinfo muito amigável, visualmente simples e adaptável as necessidades de cada marca.

# Requisitos para utilização

- Ambiente de hospedagem de aplicações, em nuvem, sugestão ( [Heroku](https://www.heroku.com/), [App Engine](https://cloud.google.com/appengine?utm_source=google&utm_medium=cpc&utm_campaign=latam-BR-all-pt-dr-SKWS-all-all-trial-e-dr-1011454-LUAC0008679&utm_content=text-ad-none-any-DEV_c-CRE_429626774325-ADGP_Hybrid%20%7C%20SKWS%20-%20EXA%20%7C%20Txt%20~%20Compute_App-Engine-KWID_43700040369789872-kwd-359982465286&utm_term=KW_app%20engine-ST_App%20Engine&gclid=Cj0KCQjw3eeXBhD7ARIsAHjssr_cyDm7Ya38V6I8-BcE6voMScPtjvVzlNVGBA6ojNy62oGmesxhBmIaAjHpEALw_wcB&gclsrc=aw.ds), [AWS](https://aws.amazon.com/pt/free/?all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc&awsf.Free%20Tier%20Types=*all&awsf.Free%20Tier%20Categories=categories#compute&trk=b6664494-006e-43c0-8c10-90b5933786ac&sc_channel=ps&sc_campaign=acquisition&sc_medium=ACQ-P%7CPS-GO%7CNon-Brand%7CDesktop%7CSU%7CCompute%7CSolution%7CBR%7CPT%7CText&s_kwcid=AL!4422!3!589951437530!p!!g!!servi%C3%A7o%20de%20hospedagem&ef_id=Cj0KCQjw3eeXBhD7ARIsAHjssr9WRQ-E-HQzwFNMMxch0__BsklfRKjyQe45XxILOpWR5Kvpr5nLpR8aAkuwEALw_wcB:G:s&s_kwcid=AL!4422!3!589951437530!p!!g!!servi%C3%A7o%20de%20hospedagem), [HostGator](https://www.hostgator.com.br/hospedagem-de-sites-seu-sucesso?gclid=Cj0KCQjw3eeXBhD7ARIsAHjssr9h3DR2TJb2qaPgLohH2Ba__U9d4g6VPuvHGQdpE3iVOnEm_exgLu4aAtJEEALw_wcB)) ;
- API [ADinfo](https://github.com/DP6/penguin-adinfo#instala%C3%A7%C3%A3o) já hospedada;
- Node a partir da versão 16;
- Vue.js.
## Hospedagem



# Executando a aplicação

  

*Clone o projeto do github para sua máquina local ou Cloud Shell, usando o comando abaixo:*

  

https://github.com/DP6/adinfo-interface.git

  

**Após a instalação, será necessário apenas iniciar a interface executando os seguintes comandos :**

  

*Instala as dependências para execução local:*

  

npm install

  

*Executa a aplicação em ambiente local(http://localhost:8080/):*

  

nmp start

# Overview da Interface

## 1. Controle de acessos ao Adinfo

### **1.1 Tipos de usuários**

No Adinfo, temos dois tipos dois tipos de usuário:

  - **Admin** - Nivel mais alto de permissionamento, destinado aos usuários que estabelecerão os padrões a serem seguidos na parametrização de campanhas. Possui acesso a todos os menus, inclusive abas de Atualizar configuração ou Nova configuração, Dependências e Registro de usuários.

- **Usuário** - Nível mais limitado de acesso, destinado à operação, ou seja, que irão parametrizar e implementar campanhas. Possui acesso apenas às abas de Parametrização, CSV e Template.

 ### 1.2 Como adicionar novos usuários ao Adinfo

**![](https://lh4.googleusercontent.com/d5WKB29ZulGuVLJ4K4jixKZltp9bvFqT8WwYLvcBLDFvpxkhDnh4cif3n3YnOVEfMOf2DzeXwjYOPLvT4HDy3qM3pKq4gK78VN2Qhy8_Yydcq0fe2PiKGOfWhiVP_za0IiuLMtlZOcKpqCKfjybljSc)**

1. Através de um usuário com permissão de Adimn, visite a aba de Usuários e em seguida a de Registrar usuários;

2. Preencha os campos em aberto contendo o e-mail do novo usuário e a senha;

3. Ao clicar em criar, você receberá em resposta a senha de acesso. Com ela o novo usuário poderá utilizar a interface do Adinfo com acesso de Operação.

4. Logo abaixo na sub aba de Gerenciamento de Usuários também é possível ativar e desativar quais usuários terão acesso a plataforma de um modo bem eficiente.

  

## 2. Como parametrizar campanhas

### 2.1 **Download do arquivo de preenchimento**

O primeiro passo do processo é a consulta e download do arquivo de preenchimento ou template. O template possui todas as informações definidas pelo Administrador como necessárias nos elementos de nomenclatura e URLs, assim como suas opções de preenchimento e dependências, quando relevantes.

  

![](https://lh4.googleusercontent.com/63IHzxnijB35AAeFEVIf_IIy-JWaod0WR9C8ra7klCww9Vw1SuOEKok50yJxDNo-Siki8lTpSrKIXWSlTjwe77avvap1nL-rCUze9iu4NxKAZaJdpp19-tcVHsZfivh9vO0nACfvDJNlJWPoSWG-nGs)

1. Para acessar o template configurado, selecione a opção Parametrizar no menu lateral.

2. Em seguida a opção Template (1).

3. Em seguida, clique em Consultar template (2).

4. Após a conferência dos campos, realize o download do template em um dos dois formatos disponíveis, CSV ou XLSX (3).

  

*Após o Download, as linhas devem ser preenchidas com as respectivas informações, necessárias para a geração do arquivo de parametrização.*

  

### 2.2 Parametrização na ferramenta

Com o template devidamente preenchido, o primeiro passo é exportar a aba template em formato CSV.

  

![](https://lh4.googleusercontent.com/ZbMQAkBd6a7gciJHZn_iMuqdlA8KkXMBNoQyHC7n757Hnw0s01LtR_oHBKQCfVfa0lDfPUZLthVQ5XLRC7UeumwSQQSBZzBVCQbQb8znKog_4m6oXcyozZK4rNV5kM4nXkWZbQtmG1OwrwLWKDVV_mc)

Para realizar a parametrização, realize os passos a seguir:

  

1. Navegue até a aba parametrização, na opção Parametrizar do menu lateral;

2. Selecione o nome da sua AdOpsTeam. No exemplo, utilizamos o nome Campanhas Internas;

3. Selecione o nome da campanha desejada logo em seguida.

4. Adicione o arquivo CSV exportado com o template.

5. Selecione então a ferramenta de Analytics já predefinida.

6. E logo em seguida a mídia desejada.

  

7. Com todos os campos selecionados, clique na opção parametrizar.

  

*Após a parametrização, o Adinfo apresentará uma prévia das informações configuradas para revisão. Para consultar o resultado, selecione a opção Download Parametrização.*

  

# Como contribuir

Pull requests são bem-vindos! Nós vamos adorar ajuda para evoluir esse modulo. Sinta-se livre para navegar por issues abertas buscando por algo que possa fazer. Caso tenha uma nova feature ou bug, por favor abra uma nova issue para ser acompanhada pelo nosso time.

  

### 1.1 Requisitos obrigatórios

  Só serão aceitas contribuições que estiverem seguindo os seguintes requisitos:

- [Padrão de commit](https://www.conventionalcommits.org/en/v1.0.0/)

# Suporte

**DP6 Koopa-troopa Team**

e-mail: [koopas@dp6.com.br](mailto:koopas@dp6.com.br)

  
 <img src="https://raw.githubusercontent.com/DP6/templates-centro-de-inovacoes/main/public/images/koopa.png" height="100" />