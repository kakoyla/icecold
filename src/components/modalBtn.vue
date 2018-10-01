<template>
    <div>
      <button type="button" class="btn btn-lg btn-outline-primary" style="color:white" @click="openModal()"> View QR Code <i class="fa fa-qrcode fa-lg" style="color:white;"></i></button>
        <modal v-if="showModal">
                 <div slot="body" style="bottom-margin:100px; margin-left:auto;margin-right:auto;height:400px; width:400px">
                    <qrcode :value ="txblob" :options="{ size: 400 }"></qrcode>
                </div>
                      
                    <div slot="footer">
                    <button type="button" class="badge badge-light float-right" @click="closeModal()"> Close </button>
                    </div>
                  </modal>
                  
    </div>
</template>
<script>

import Modal from "./modal";
import VueQrcode from '@xkeshi/vue-qrcode';

export default {
  name: "Modalbtn",

  components: { Modal,VueQrcode, },

  props: ['txblob'],

  data() {
    return {
      showModal: false,
    }
  },

  methods: {
    openModal() { 
     this.showModal = true;
    },
    closeModal() {
     this.showModal = false;
  },
  },
}
</script>



