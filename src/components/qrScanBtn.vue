<template>
    <div>
      <button class="btn btn-outline-light" style="height:100%"type="button" @click="qrModeSigner = true"><i class="fa fa-qrcode"></i></button>
        <qrScanModal v-if="qrModeSigner" v-bind:i="i">
        <div slot="body" >
            <qrcodeReader @decode="onQrDecode"> </qrcodeReader>
        </div>
        <div slot="footer">
            <button type="button" class="btn btn-outline-primary" style="margin-top:10px;" v-on:click ="cancelRegularKeyQr()">
            Cancel
            </button>
        </div>
        </qrScanModal>
                  
    </div>
</template>
<script>
import { QrcodeReader } from "vue-qrcode-reader";
import qrScanModal from "./qrScanModal";
import { EventBus } from "./eventbus.js";

export default {
  name: "qrScanBtn",

  components: { QrcodeReader, qrScanModal },

  props: ["i"],

  data() {
    return {
      showModal: false,
      qrModeSigner: false,
      scan: null,
      
    };
  },

  methods: {
    onQrDecode: function(decodedString) {
      console.log(decodedString);
      this.scan = {
        i: this.i,
        acct: decodedString,
      }
      EventBus.$emit("qrScan", this.scan);
      //this.acct = decodedString;
      this.qrModeSigner = false;
      //this.$Parent.SignerEntries[this.i].SignerEntry.Account = this.acct;
    },

    cancelRegularKeyQr() {
      this.qrModeSigner = false;
    }, 
  },

  computed: {}
};
</script>



