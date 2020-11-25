<template>
  <div class="app-container">
    <GuaTable />
  </div>
</template>
<script>

import GuaTable from './components/gua-table'
export default {
  name: 'Index',
  components: { GuaTable }
}
</script>

<style lang="scss">
  .gua{
    width: 100%;
  }
</style>
