<template>
<b-container fluid>
  <b-form @submit.stop.prevent @reset="onReset">
    <b-form-group
      id="sender"
      label="From:"
      label-for="sender"
    >
      <b-form-input
        id="sender"
        v-model="form.sender"
        type="email"
        placeholder="Enter email"
        :state="validationState('sender')"
        required
      ></b-form-input>
      <b-form-invalid-feedback :state="validationState('sender')">
        {{validation.sender}}
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group
      id="recipient"
      label="To:"
      label-for="recipient"
    >
      <b-form-input
        id="recipient"
        v-model="form.recipient"
        type="email"
        placeholder="Enter email"
        :state="validationState('recipient')"
        required
      ></b-form-input>
      <b-form-invalid-feedback :state="validationState('recipient')">
        {{validation.recipient}}
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group id="subject" label="Subject:" label-for="subject">
      <b-form-input
        id="subject"
        v-model="form.subject"
        placeholder="Enter Subject"
        :state="validationState('subject')"
        required
      ></b-form-input>
      <b-form-invalid-feedback :state="validationState('subject')">
        {{validation.subject}}
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group id="text" label="Text:" label-for="text">
      <Editor v-model="text"/>
      <!-- <div v-html="text"></div> -->
      <b-form-invalid-feedback :state="validationState('text')">
        {{validation.text}}
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group id="file" label="Attachment:" label-for="file">
      <b-form-file
        multiple
        v-model="attachments"
        :state="Boolean(attachments)"
        placeholder="Choose files or drop them here..."
        drop-placeholder="Drop file here..."
      ></b-form-file>
      <b-form-invalid-feedback :state="validationState('attachments')">
        {{validation.attachments}}
      </b-form-invalid-feedback>
    </b-form-group>

    <b-button @click="onSubmit" variant="primary">Submit</b-button>
    <b-button type="reset" variant="danger">Reset</b-button>
    <nuxt-link to="/" class="btn btn-link">Home</nuxt-link>
  </b-form>
</b-container>
</template>

<script>
import api from '../../services/api';
import Editor from "../../components/Editor";

export default {
  components: {
    Editor
  },
  data() {
    return {
      error: '',
      loading: false,
      validation: {},
      form: {},
      text: '',
      attachments: [],
    }
  },
  async mounted() {
    // this.loading = true;
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      try {
        const formData = new FormData();
        formData.append('sender', this.form.sender);
        formData.append('recipient', this.form.recipient);

        if (this.form.subject) {
          formData.append('subject', this.form.subject);
        }
        if (this.text) {
          formData.append('text', this.text);
        }

        this.attachments.map(attach => {
          formData.append('attachments[]', attach);
        });

        await api.postMutliPart(`emails`, formData);
        this.loading = false
        this.validation = {};
        this.form = {};
        this.$router.push({
          path: '/'
        });
        return;
      } catch (error) {
        if (error.response) {
          if (error.response.status == 422) {
            this.validation = error.response.data.errors;
            const errors = error.response.data.errors;
            Object.keys(errors).map(e => {
              this.validation[e] = errors[e][0];
            });
          }
          this.error = error.response.data.message;
        } else {
          this.error = error.statusText;
        }
        this.loading = false
        return [];
      }
    },
    onReset() {
      this.form = {};
      this.validation = {};
    },
    validationState(key) {
      if (Object.keys(this.validation) == 0) return undefined;
      if (this.validation[key] !== undefined) return false;
      return undefined;
    }
  }
}
</script>

<style>
.buttons {
  margin: 10px 0px;
}
.btn-primary, .btn-danger {
  color: #fff;
}
</style>
