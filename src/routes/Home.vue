<template>
  <div id="home">
    <Map :data="data" :onCountryClick="onCountryClick" />
    <Key />
    <SelectedCountry v-if="selected" :country="selected.country" />

  </div>
</template>

<script>
import Map from '@/components/Map'
import Key from '@/components/Key'
import SelectedCountry from '@/components/SelectedCountry'

export default {
  components: {
    Map,
    Key,
    SelectedCountry,
  },
  data: () => ({

    loading: true,
    data: undefined,
    selected: false,
    selectedTransactions: false
  }),
  mounted() {
    this.onConnect()
  },
  methods: {
    onConnect() {

      this.$neo4j.run(`
        MATCH (country:Country)<-[:COUNTRY]-(entity:Entity)<-[:BENEFITS]-(f)-[:ORIGINATOR]->(originEntity)-[:COUNTRY]->(origin)
        WITH country, origin, collect({ origin: originEntity, filing: f}) as filings, sum(f.amount) AS amount
        RETURN country, sum(amount) AS amount, collect({origin: origin, filings: filings}) AS countryFilings
      `)
        .then(res => {
          this.data = res.records.map(row => ({
            country: row.get('country'),
            amount: row.get('amount'),
            countryFilings: row.get('countryFilings'),
          }))
        })
        .then(() => this.loading = false)
    },
    onCountryClick(row) {
      this.selected = row
    }
  },

}
</script>

<style>

</style>