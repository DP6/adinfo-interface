<template>
    <div class="vue-app">
        <root v-bind:folder="root"></root>
    </div>
</template>

<script>
import Root from './Aloha.vue'

export default {
  name: 'app',
  data: function () {
    return {
      root: {
        text: 'config',
          leaf: false,
          expanded: true,
          children:[{
                    text: 'separator',
                    leaf: false,
                    expanded: false,
                    children: [{
                              text: ',',
                              leaf: true
                    },
                    {
                              text: ';',
                              leaf: true
                    }
                    ]
          },
          {
                    text: 'csvSeparator',
                    leaf: false,
                    expanded: false,
                    children: [{
                              text: '_',
                              leaf: true
                    }
                    ]
          },
          {
                    text: 'columns',
                    leaf: false,
                    expanded: false,
                    children: [{
                              text: 'Veiculo',
                              leaf: false,
                              expanded: false,
                              children: [{
                                text: 'googleAds',
                                leaf: true
                              },
                              {
                                text: 'facebookAds',
                                leaf:true
                              }]
                    },
                    {
                              text: 'Display',
                              leaf: false,
                              expanded: false,
                              children: [{
                                text: '500x200',
                                leaf: true
                              },
                              {
                                text: '300x300',
                                leaf:true
                              }]
                    },
                    {
                              text: 'Formato',
                              leaf: false,
                              expanded: false,
                              children: [{
                                text: 'display',
                                leaf: true
                              },
                              {
                                text: 'video',
                                leaf:true
                              }]
                    },
                    {
                              text: 'Exemplo',
                              leaf: false,
                              expanded: false,
                              children: [{
                                text: '/.*/',
                                leaf: true
                              },
                              ]
                    },
                    ]
          },
          {
                    text: 'analyticsTools',
                    leaf: false,
                    expanded: false,
                    children: [{
                              text: 'ga',
                              leaf: false,
                              expanded: false,
                              children: [
                                {
                                text: 'utm_source',
                                leaf: false,
                                expanded: false,
                                children: [{
                                  text: "Exemplo",
                                  leaf: true
                                }
                                ]
                                },
                                {
                                text: 'utm_campaign',
                                leaf: false,
                                expanded: false,
                                children: [{
                                  text: 'Formato',
                                  leaf: true
                                },
                                {
                                  text: 'Display',
                                  leaf: true
                                }]
                              },
                              {
                                text: 'utm_medium',
                                leaf: false,
                                expanded: false,
                                children: [{
                                  text: 'Veiculo',
                                  leaf: true
                              }
                              ]
                              }
                            ]
                    },
                    {
                      text: 'adobe',
                      leaf: false,
                      expanded: false,
                      children: [{
                        text:'cid',
                        leaf: false,
                        expanded: false,
                        children:[{
                          text: 'Exemplo',
                          leaf:true,
                        },
                        {
                          text: 'Formato',
                          leaf:true,
                        },
                        {
                          text: 'Display',
                          leaf:true,
                        },
                        {
                          text: 'Veiculo',
                          leaf:true,
                        }
                        ]
                      }]
                    }
                    ]
          },
          {
                    text: 'mediaTaxonomy',
                    leaf: false,
                    expanded: false,
                    children: [{
                              text: 'fb',
                              leaf: false,
                              expanded: false,
                              children:[{
                                text: 'campanha',
                                leaf: false,
                                expanded: 'false',
                                children: [{
                                  text: 'veiculo',
                                  leaf: true
                                },
                                {
                                  text: 'formato',
                                  leaf: true
                                }]
                              }]
                    }
                    ]
          },
          ]
        }
      }
    },
    components: {
      Root
    }
};
</script>
