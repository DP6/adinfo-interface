<template>
<md-dialog-alert
  :md-active.sync="active"
  md-title="Usuário sem permissão!"
  md-content="Desculpe, você não tem permissão para realizar esta ação."
  md-confirm-text="Voltar"
  @md-cancel="onCancel()"
  @md-confirm="redirect()" />
</template>

<script>
  export default {
    name: 'DialogConfirm',

    props: {
        active: {
            required: true,
            type: Boolean
        }
    },
    methods: {
      redirect(){
        this.$router.push('/login');
      },
      onCancel(){
        this.$emit('setShowAlertFalse');
      }
    }
  }
</script>