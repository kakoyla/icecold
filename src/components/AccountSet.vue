<template>
  <div class="container">
    
    <div v-if="!acctSetTag">
    <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="$parent.txType=null" >Back</button> 
        </div>
    <h4>Set Account Options </h4>
        <h5>  </h5>
    





    <!-- Enter Sequence -->
    <div v-if="acctSetTag =='enterSequence'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="AcctSetTag()" >Back</button> 
        </div>
        
        <h4>Enter the Next Sequence Number for the Initiating Account:</h4>
        <div class="col-boom">
        	<input class="effect-2 no-border" type="number" placeholder="0"  min=1 step=1 v-model="Sequence">
            <span class="focus-border"></span>
        </div>
        <h5 style="margin:20px;color:lightskyblue">
            Hint: You can find the next sequence number for an account by using Bithomp's XRP explorer (https://bithomp.com/explorer/) 
        </h5>
        <h5><img src="../../static/img/nextsequence.png" width="250" height="400" alt="Mountain View"></h5>

            <div  v-if="Sequence" >
            <button type="button" @click="AcctSetTag('enterFee')" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
            </div>
    </div> 
    <!-- end Enter Sequence -->

         <!-- Enter Fee -->
    <div v-if="acctSetTag =='enterFee'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="AcctSetTag('enterSequence')" >Back</button> 
        </div>
        <h4>Enter the fee you want to pay for this transaction:</h4>
        <div class="col-boom">
        	<input class="effect-2 no-border" type="number" placeholder="enter in drops (10 drops = 0.000010xrp)" min=10 step=1 v-model="fee">
            <span class="focus-border"></span>
        </div>
        <h5 style="margin:20px;color:lightskyblue">
            Hint: The minimum fee currently allowed is 10 drops (0.000010 XRP). If the XRPL is busy, a transaction with a low fee might not be processed in a timely manner.  
        </h5>
        <h5 style="margin:20px;color:lightskyblue">
            Fee currently set to: <span class="buttercup"> {{ FeeXRP }} </span> XRP
        </h5>

            <div  v-if="fee" >
            <button type="button" @click="AcctSetTag('ReviewTx'),prepTx()" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
            </div>
    </div> 
    <!-- end Enter Fee -->

    <!-- Review Tx -->
    <div v-if="acctSetTag =='ReviewTx'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="AcctSetTag('enterFee')" >Back</button> 
        </div>
        <h4 class="buttercup" style="margin:20px"><u> Please review your transaction information:</u></h4>
        
        <div v-for="(value,key) in Transaction">
            <div class="row">
                <div class="col-sm-3 lightskyblue" style="font-size:20px; text-align:right">
                    {{key}}
                </div>
                <div class="col-sm-5" style="font-size:22px; text-align:left">
                    {{value}}
                </div>
            </div>
        </div>
        
        <h5 style="margin:20px;color:lightskyblue">
            After verifying the information above is correct, you can sign the transaction. 
            The next screen will provide you with the transaction blob, which you can submit on an online computer.
        </h5>

        

            <div>
            <button type="button" class="btn btn-lg btn-outline-success" style="margin:20px;color:white;font-size:30px" @click="signTx(), AcctSetTag('signedTx')" >Sign Transaction</button>
            </div>
    </div> 
    <!-- end Review Tx -->

    <!-- Signed Tx -->
    <div v-if="acctSetTag =='signedTx'">
        <div style="text-align:left; margin-bottom:0px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="prepTx(),AcctSetTag('ReviewTx')" >Back</button> 
        </div>
        <h4 class="buttercup" style=""> Here is the Signed Transaction:</h4>

        <div style="color:lightskyblue;word-wrap: break-word;">{{Transaction}}</div>

        <div v-if="txblob" style="margin-top:15px; word-wrap: break-word;">
      <label for="txJson"><span class="badge badge-success" style="margin-top:20px;font-size:25px">TX Blob:</span></label>
      <div class="" style="font-size:16px">
    {{signedTx.tx_blob}}
    </div>
    </div>
  <!--Modal-->
                <div v-if="txblob" class="container" style="margin-top:10px;margin-bottom:40px;margin-left:auto;margin-right:auto">
                  <Modalbtn v-bind:txblob="signedTx.tx_blob"></Modalbtn>
                </div>
                <!--end Modal-->

    </div> 
    <!-- end Signed Tx -->
  </div>
  </div>
    
  
 


  
</template>

<script>
import RippledWsClientSign from "rippled-ws-client-sign";
import VueQrcode from '@xkeshi/vue-qrcode';
import Modalbtn from "./modalBtn";
import { QrcodeReader } from 'vue-qrcode-reader';


export default {
  name: "AccountSet",

  components: {
    VueQrcode,Modalbtn,QrcodeReader,
    },
  props: ["walletAddress", "secret"],
  data() {
    return {
      
      fee:10,
      Sequence:null,
      signedTx:null,
      Transaction:{},
      txblob:false,
      LimitAmount: {
        currency: null,
        issuer: null,
        value: null,
        },
      LimitIssuerValid:false,
      qrModeIssuer: false,
      
      acctSetTag:null,
      feeXRP:null,
      
    };
  },
  mounted() {},

  methods: {



    AcctSetTag: function(acctSetTag){
        this.acctSetTag = acctSetTag;
    },

    prepTx(){
      
    this.txblob=false
    if(this.signedTx && this.signedTx.tx_blob){
      this.signedTx.tx_blob = null
      }
    this.Transaction = {
              TransactionType: 'AccountSet',
              Account: this.walletAddress,
              Fee: this.fee,
              Sequence: this.Sequence *1,
              LimitAmount: this.LimitAmount,
            };
    
    
    },
    signTx(){
      new RippledWsClientSign(this.Transaction, this.secret).then((SignedTransaction) => {
        this.signedTx = SignedTransaction

  
          console.log('SignedTransaction', SignedTransaction)
          this.txblob=true
      }).catch((SignError) => {
          console.log('SignError', SignError.details)
          alert('There was an error when signing, see console log')
      })
    },
    issuerCheck() {
        this.LimitAmount.issuer = this.LimitAmount.issuer.trim();
      var string = this.LimitAmount.issuer
      if (string.match(/^r[a-k+m-z+A-H+J-N+P-Z0-9]{25,}/) && string.length >= 25 && string.length <= 35) {
        this.LimitIssuerValid = true
      }
      else(this.LimitIssuerValid = false)
    },

    onQrDecodeIssuer: function (decodedString) {
      console.log(decodedString);
      this.LimitAmount.issuer = decodedString;
      this.qrModeIssuer = false;
      this.issuerCheck();
    },

    cancelIssuerQr(){
      this.qrModeIssuer = false;
    },

    
  },
  computed: {
      FeeXRP(){
          this.feeXRP = this.fee / 1000000;
          return this.feeXRP
      }
    
    
  
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
