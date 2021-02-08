<template>
<b-container fluid>

</b-container>
</template>

<script>
import api from '../../services/api';
export default {
  data() {
    return {
      items: [],
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

    },
    async provider(ctx, callback) {
      this.isBusy = true;
      try {
        const response = await api.get(`emails?page=${ctx.currentPage}`);
        this.isBusy = false
        this.currentPage = response.data.meta.current_page;
        this.perPage = response.data.meta.per_page;
        this.total = response.data.meta.total;

        return response.data.emails;
      } catch (error) {
        this.isBusy = false
        return [];
      }
    }
  }
}
</script>

<style>
.buttons {
  margin: 10px 0px;
}
</style>
