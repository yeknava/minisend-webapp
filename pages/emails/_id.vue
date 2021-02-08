<template>
<b-container fluid class="container">
  <nuxt-link to="/" class="btn btn-primary">Home</nuxt-link>
  <hr>
  <p><strong>from:</strong> {{email.sender}}</p>
  <p><strong>to:</strong> {{email.recipient}}</p>
  <p><strong>subject:</strong> {{email.subject}}</p>
  <div v-show="email.attachments && email.attachments.length">
    <p><strong>Attachments:</strong></p>
    <ul>
      <li v-for="attach in email.attachments" :key="attach.id">
        <a :href="download(attach)" target="_black">{{attach.filename}}</a>
      </li>
    </ul>
  </div>
  <div v-html="email.html"></div>
</b-container>
</template>

<script>
import api from '../../services/api';
export default {
  data() {
    return {
      email: {},
      loading: false,
    }
  },
  async mounted() {
    this.loading = true;
    const res = await api.get('emails/'+this.$route.params.id);
    this.loading = false;
    this.email = res.data.email;
  },
  methods: {
    download(attachment) {
      return process.env.baseUrl+'emails/'+this.$route.params.id+'/attachments/'+attachment.id;
    },
  }
}
</script>

<style>
.container {
  margin: 10px;
}
strong {
  font-size: 18px;
}
</style>
