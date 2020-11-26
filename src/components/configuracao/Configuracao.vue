<template>
  <div>
    Configuração
    <ul>
      <span class="adicionar" @click="adicionarItem()">+</span>
      <li v-for="item in generalConfig" :id="item">
        {{item}} 
        <span v-if="typeof(configJson[item]) === 'string'">: {{ configJson[item] }}</span>
        <ul v-else>  
          <li v-for="param in Object.keys(configJson[item])" :id="concatId(item, param)">
            {{ param }}
            <span v-if="typeof(configJson[item][param]) === 'string'">: {{ configJson[item][param] }}</span>
            <span v-else-if="typeof(configJson[item][param]) === 'boolean'">: {{ configJson[item][param] }}</span>
            <ul v-else-if="!Array.isArray(configJson[item][param])">
              <li v-for="t in Object.keys(configJson[item][param])" :id="concatId(item, param, t)">
                {{ t }}
                <ul v-if="Array.isArray(configJson[item][param][t])">
                  <li v-for="seila in configJson[item][param][t]">
                    {{ seila }}
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li> 
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      generalConfig: [],
      configJson: {}
    }
  },
  created() {
    const myConfig = {
      "separator": ":",
      "spaceSeparator":"+",
      "ga": {
          "utm_source": {
              "Veículo": ["google_ads", "facebook", "verizon", "globo", "afilio"]
          },
          "utm_medium": {
              "Inserção": ["CPC","feed", "story", "native ads", "afiliado"]
          },
          "utm_campaign": {
              "campanha": ["fifinha-na-copa", "fifinha na copa da emoção"]
          },
          "utm_content": {
              "categoriaDoProduto": ["videogame", "game"],
              "produto": ["FIFA", "PÉS", "ronaldinho soccer 64"],
              "segmentação": ["fifeiros", "nao_fifeiros", "smasheiros"],
              "criativo": ["FIFA20", "PÉS20", "smash", "amiibo", "takeshi", "pikachi", "kakachi"],
              "formato": ["darkpost", "/\\d{3}x\\d{3}/"]
          },
          "utm_term": {
              "campaignId": ["/\\d/"],
              "adId": ["/\\d/"]
          }
      },
      "facebook" : {
          "dynamicValues": true,
          "utm_source": "{{campaign.name}}",
          "utm_term": "{{ad.name}}",
          "utm_medium": "{{campaign.name}}|{{ad.name}}"
      }
    };
    this.configJson = myConfig;
    this.generalConfig = Object.keys(myConfig);
  },
  methods: {
    concatId(...ids) {
      return ids.join('-');
    },
    adicionarItem() {
      console.log("ADICIONADO");
    }
  }
}
</script>

<style scoped>
  .adicionar{
    color: green;
    font-size: 20px;
    cursor: pointer;
    user-select: none;
  }
</style>