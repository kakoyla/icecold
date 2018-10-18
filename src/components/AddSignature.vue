<template>
  <div class="container-fluid">
    <div v-if="!tx && !decoded">
      <div class= "container text-primary bg-black rounded"  style="padding:5px">
    <div class= "text-Dak text-light bg-black rounded " style="padding:10px">
        <p style="text-align:center"><b><span class=""> Enter Tx_Blob for the transaction to be signed:</span></b></p>
    
        <div class="input-group mb-3">
          <input type="text" pattern="^\S+$" class="form-control text-Dak" placeholder=" tx_blob "onfocus="this.select();" v-model="importTx" @blur="decodeBlob(),checkSignersDups()">
        </div>
        
    </div>
    </div>
    <div v-if="!qrModeBlob" style="margin-top:50px; margin-bottom:50px;">  
      <div style="margin-bottom:40px">or</div>
        <button @click="qrModeBlob=true" class="btn btn-outline-primary" type="button">
          <i class="fa fa-qrcode fa-5x" style="color:white;"></i>
        </button>
      <div style="font-size:20px;">Scan Blob QR Code</div>
    </div>
    <div v-if= "qrModeBlob">
      <qrcodeReader @decode="onQrDecodeBlob"> </qrcodeReader>
      <button type="button" class="btn btn-outline-primary" style="color:white; margin-top:10px" v-on:click ="cancelBlobQr()">
            Cancel
      </button>
    </div>
    
    </div>
      
    <div v-if="tx || decoded"> 
      <div v-if="!signedTx">
      ADD SIGNATURE 
    <div v-if="txHolder" v-for="(value,key) in txHolder" style="word-wrap:break-word">
            <div class="row">
                <div class="col-sm-3 lightskyblue" style="font-size:20px; text-align:right">
                    {{key}}
                </div>
                <div class="col-sm-9" style="font-size:22px; text-align:left">
                    {{value}}
                </div>
            </div>
        </div>

    <div v-if="!txHolder" v-for="(value,key) in tx" style="word-wrap:break-word">
            <div class="row">
                <div class="col-sm-3 lightskyblue" style="font-size:20px; text-align:right">
                    {{key}}
                </div>
                <div class="col-sm-9" style="font-size:22px; text-align:left">
                    {{value}}
                </div>
            </div>
        </div>

    <div v-if="!txblob">       
        <h5 style="margin:20px;color:lightskyblue">
            After verifying the information above is correct, you can sign the transaction. 
              
        </h5>

        

            
            <button type="button" class="btn btn-lg btn-outline-success" style="margin:20px;color:white;font-size:30px" @click="MultisignTx() " >Sign Transaction</button>
            </div>
      </div>
      <div v-if="signedTx">
        <div v-if="txblob">
    <h4 class="buttercup" style="margin:20px"> Here is the Signed Transaction. </h4>
     <h4 class="lightskyblue" style="margin:20px"> 
       If you are the last signer you can now submit the transaction. 
       This must be submitted using "submit_multisign" as the signatures are not ordered. 
       </h4>
       <h4 class="buttercup" style="margin:20px">
         If there are additional signatures needed, you can pass this blob on to the next signer.
         </h4>
       
        

        <div v-if="txblob" style="margin-top:15px; word-wrap: break-word;">
      <label for="txJson"><span class="badge badge-success" style="margin-top:20px;font-size:25px">TX Blob:</span></label>
      <div class="" style="font-size:16px">
    {{NewBlob}}
    </div>
    </div>
  <!--Modal-->
                <div v-if="txblob" class="container" style="margin-top:10px;margin-bottom:40px;margin-left:auto;margin-right:auto">
                  <Modalbtn v-bind:txblob="NewBlob"></Modalbtn>
                </div>
                <!--end Modal-->
    
    </div>
        <h4 class="text-primary">Signed Transaction</h4>
        <div v-if="!txHolder" v-for="(value,key) in signedTx.txJSON" style="word-wrap:break-word">
            <div class="row">
                <div class="col-sm-3 lightskyblue" style="font-size:20px; text-align:right">
                    {{key}}
                </div>
                <div class="col-sm-9" style="font-size:22px; text-align:left">
                    {{value}}
                </div>
            </div>
        </div>
        <div v-if="txHolder" v-for="(value,key) in txHolder" style="word-wrap:break-word">
            <div class="row">
                <div class="col-sm-3 lightskyblue" style="font-size:20px; text-align:right">
                    {{key}}
                </div>
                <div class="col-sm-9" style="font-size:22px; text-align:left">
                <div v-if="key === 'Signers'" >
                  <div v-for="(value,key) in value" style="margin:10px">
                    ({{ key+1 }}) <span class="badge badge-light" style="font-size:20px">{{value.Signer.Account}}</span>
                  </div>
                  
                  
                  
                </div>
                <div v-else>{{value}}</div>
            </div>
        </div>
        </div>

    
    </div>
    </div>
  </div>
</template>

<script>
import RippledWsClientSign from "rippled-ws-client-sign";
import VueQrcode from '@xkeshi/vue-qrcode';
import Modalbtn from "./modalBtn";
import { QrcodeReader } from 'vue-qrcode-reader';
import binary from "ripple-binary-codec";
import RippleKeypairs from 'ripple-keypairs';


export default {
  name: "AddSignature",

  components: {
    VueQrcode,Modalbtn,QrcodeReader,
    },
  props: ["signingAddress", "signingSecret", "tx"],
  data() {
    return {
      
      Transaction:null,
      signedTx:null,
      txblob:null,
      importTx:null,
      decoded:null,
      origSigners:null,
      txHolder:null,
      NewBlob:null,
      qrModeBlob:false,
      



      
    };
  },
  mounted() {},

  methods: {

    MultisignTx() {
      
      
      

      if(this.importTx){
        this.Transaction = this.txHolder
        this.origSigners = this.Transaction.Signers
        
        delete this.Transaction.Signers 
      
        this.Transaction = JSON.stringify(this.Transaction)
        this.multiSigSecret = {signAs: this.signingAddress};
      new RippledWsClientSign(this.Transaction, [this.signingSecret])
        .then(SignedTransaction => {
          this.signedTx = SignedTransaction;
          this.signedTx.txJSON =binary.decode(this.signedTx.tx_blob) 
          this.origSigners.push(this.signedTx.txJSON.Signers[0])
          this.txHolder.Signers = this.origSigners
          //this.txHolder = JSON.stringify(this.txHolder)
          this.NewBlob = binary.encode(this.txHolder)
          console.log("SignedTransaction", SignedTransaction);
          this.txblob = true;
        })
        .catch(SignError => {
          console.log("SignError", SignError.details);
          alert("There was an error when signing, see console log");
        });
        
      }
      else{
        this.Transaction = this.tx        
        this.Transaction = JSON.stringify(this.Transaction)
        
      this.multiSigSecret = {signAs: this.signingAddress};
      new RippledWsClientSign(this.Transaction, [this.signingSecret])
        .then(SignedTransaction => {
          this.signedTx = SignedTransaction;
          this.signedTx.txJSON =binary.decode(this.signedTx.tx_blob) 
          this.NewBlob = this.signedTx.tx_blob
          console.log("SignedTransaction", SignedTransaction);
          this.txblob = true;
        })
        .catch(SignError => {
          console.log("SignError", SignError.details);
          alert("There was an error when signing, see console log");
        });
      }
    },
    decodeBlob(){
        if(this.importTx){
        this.decoded =binary.decode(this.importTx)
        this.checkSignersDups()

        this.txHolder = this.decoded
        }
        else if(!this.importTx){
            this.decoded = null
        }
    },
    onQrDecodeBlob: function (decodedString) {
      this.importTx = decodedString;
      this.qrModeBlob = false;
      this.decodeBlob();
    },
    cancelBlobQr(){
      this.qrModeBlob = false;
    },

    checkSignersDups(){
      this.decoded.Signers.forEach(element => {
        if(element.Signer.Account ==this.signingAddress){
          this.importTx = null,
          this.decoded = null,
        
          alert("This account has already signed!")
        }
      }) 
},

    
    
  },
  computed: {
      FeeXRP(){
          this.feeXRP = this.fee / 1000000;
          return this.feeXRP
      },
/*
      decodeTxBlob() {
      return binary.decode(this.signedTx.tx_blob);
    }, */

    
    
    
  
      },
    

};
</script>

<style scoped>
input {
  text-align: center;
  background: black;
  /*background: #343a40; */
  color: #FBCD4B;
  font-size: 22px;
}
input::-webkit-input-placeholder {
  color: lightslategray !important;
}

input:-moz-placeholder {
  /* Firefox 18- */
  color: lightslategray !important;
}

input::-moz-placeholder {
  /* Firefox 19+ */
  color: lightslategray !important;
}

input:-ms-input-placeholder {
  color: lightslategray !important;
}
.no-border {
  border-top: 0;
  border-left: 0;
  border-right: 0;
  box-shadow: none;
}

input:focus {
    background-color: black;
  /*background-color: #343a40;*/
  color: lightskyblue;
}

    .dropdown-item { font-family: Lato, Arial, Tahoma, Verdana;
                font-size: 1em;
                line-height: 1.5em;
                color: #07e2ff;
                font-weight: 500;
                text-shadow: none;
              }
    .drp-list:hover {color:#07e2ff;
                  background: grey;}
</style>
