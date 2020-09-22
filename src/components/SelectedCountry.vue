<template>
  <div class="selected ui menu">
    <div class="selected-header">
      <h2>{{ name }}</h2>
    </div>

    <div class="selected-body">
      <div
        class="selected-group"
        v-for="country in countries"
        :key="country.origin.properties.code"
      >
        <div class="selected-group-header">
          <h3
            @click.prevent="toggleCountry(country.origin.properties.code)"
          >{{ country.origin.properties.name }}</h3>

          <div class="meta">({{ country.filings.length }})</div>
        </div>

        <div v-if="selectedCountry == country.origin.properties.code">
          <div class="filing" v-for="filing in country.filings" :key="filing.filing.id">

            <div class="filing-banks">
            <div class="filing-originator filing-bank">{{ filing.originator.properties.name }}</div>



            <div class="filing-benefits filing-bank">{{ filing.benefits.properties.name }}</div>
            </div>

             <div class="filing-details">
               <div class="filing-date">{{ formatDate(filing) }}</div>

              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 1000 1000"
              >
                <g>
                  <g transform="matrix(1 0 0 -1 0 1008)">
                    <path
                      d="M756.2,741.8L990,508L756.2,274.2l-27,27L918.1,490H10v36h908.1L729.3,714.8L756.2,741.8z"
                    />
                  </g>
                </g>
              </svg>

              <div class="filing-amount">{{ filing.filing.properties.amount }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    country: Object,
  },
  mounted() {
    this.loadTransactions();
  },
  data: () => ({
    loading: true,
    countries: undefined,
    selectedCountry: undefined,
  }),
  computed: {
    name() {
      return this.country.properties.name;
    },
    code() {
      return this.country.properties.code;
    },
  },
  methods: {
    formatDate(row) {
      return row.filing.properties.begin_date;
    },
    loadTransactions() {
      this.loading = true;

      this.$neo4j
        .run(
          `
                MATCH (destination:Country {code: $code})<-[:COUNTRY]-(destinationEntity:Entity)<-[:BENEFITS]-(f)-[:ORIGINATOR]->(originEntity)-[:COUNTRY]->(origin)
                RETURN
                    origin,
                    collect(distinct {originator: originEntity, benefits: destinationEntity, filing: f}) AS filings,
                    sum(f.amount) AS amount
                ORDER BY amount DESC
            `,
          { code: this.code }
        )
        .then(
          (res) =>
            (this.countries = res.records.map((row) => ({
              origin: row.get("origin"),
              filings: row.get("filings"),
              amount: row.get("amount"),
            })))
        )
        .then(() => (this.loading = false));
    },
    toggleCountry(code) {
      this.selectedCountry = code;
    },
  },
  watch: {
    country() {
      this.loadTransactions();
    },
  },
};
</script>

<style>
.selected {
  position: absolute;
  top: 12px;
  right: 12px;
  bottom: 12px;
  width: 380px;
  background: #fff;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  z-index: 5000;
}

.selected-header {
  border-bottom: 1px solid #cccccc;
  padding: 12px;
  background: #f2f2f2;
}

.selected-header h2 {
  font-size: 1.2em;
}

.selected-body {
  flex-grow: 1;
  overflow: auto;
  padding: 12px;
}

.selected-group-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.selected-group-header h3 {
  font-size: 1em;
}

.selected-group-header .meta {
  opacity: 0.6;
}

.filing {
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid #cccccc;

}

.filing-banks {
  display: flex;
  flex-direction: row;
}

.filing-bank {
  flex-direction: column;
  justify-content: center;
  width: 50%;
}

.filing-details {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 0.8em;
  flex-grow: 1;
}

.filing-benefits {
  text-align: right;;
}

.filing-details div {
  opacity: 0.6;
  text-align: center;
}

.filing svg {
  width: 22px;
  opacity: 0.6;
}
</style>