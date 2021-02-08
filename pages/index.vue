<template>
<b-container fluid>
  <b-row class="buttons" @keypress.enter="search">
    <b-col cols="2">
      <b-button @click="newEmail" variant="primary">New Email</b-button>
    </b-col>
    <b-col cols="8">
      <b-form-input
        id="query"
        v-model="query"
        type="text"
        placeholder="Search in senders, recipients and subjects..."
      ></b-form-input>
    </b-col>
    <b-col cols="2">
      <b-button @click="search" variant="info">Search</b-button>
    </b-col>
  </b-row>
  <b-table hover
    id="table"
    class="table"
    sticky-header
    head-variant="light"
    responsive
    :fields="fields"
    :items="provider"
    :busy.sync="loading"
    :per-page="perPage"
    :total-rows="total"
    :current-page="currentPage">
    <template #cell(action)="row">
      <b-button size="sm" @click="view(row.item)">
        Show
      </b-button>
    </template>
    <template #table-busy>
      <div class="text-center text-danger my-2">
        <b-spinner class="align-middle"></b-spinner>
        <strong>Loading...</strong>
      </div>
    </template>
  </b-table>
  <b-pagination
    v-model="currentPage"
    :total-rows="total"
    :per-page="perPage"
    class=""></b-pagination>
</b-container>
</template>

<script>
import api from '../services/api';
export default {
  data() {
    return {
      query: '',
      items: [],
      fields: [
        'subject', 'sender', 'recipient', 'status', 'created_at',
        {
          key: 'has_attachment',
          label: 'Attachment',
          formatter: (value, key, item) => {
            return value ? 'Yes' : 'No'
          },
          filterByFormatted: true
        },
        {
          key: 'action',
          label: 'Action',
        },
      ],
      loading: false,
      currentPage: 1,
      perPage: 1,
      total: 0
    }
  },
  async mounted() {
    this.loading = true;
    const res = await api.get('emails');
    this.loading = false;
    this.items = res.data.emails;
  },
  methods: {
    newEmail() {
      this.$router.push({
        path: 'emails/new'
      });
    },
    view(row) {
      this.$router.push({
        path: 'emails/'+row.id
      });
    },
    async provider(ctx, callback) {
      this.loading = true;
      try {
        const response = await api.get(`emails?page=${ctx.currentPage}&query=${this.query}`);
        this.loading = false
        this.currentPage = response.data.meta.current_page;
        this.perPage = response.data.meta.per_page;
        this.total = response.data.meta.total;

        return response.data.emails;
      } catch (error) {
        this.loading = false
        return [];
      }
    },
    async search() {
      this.$root.$emit('bv::refresh::table', 'table')
      // this.loading = true;
      // try {
      //   const response = await api.get(`emails?page=${this.currentPage}&query=${this.query}`);
      //   this.loading = false
      //   this.currentPage = response.data.meta.current_page;
      //   this.perPage = response.data.meta.per_page;
      //   this.total = response.data.meta.total;

      //   return response.data.emails;
      // } catch (error) {
      //   this.loading = false
      //   return [];
      // }
    }
  }
}
</script>

<style scoped>
.buttons {
  margin: 10px 0px;
}
.table {
  max-height: calc(100vh - 160px);
}
</style>
