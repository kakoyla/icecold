<template>
  <div class="container">
    
    <div v-if="!preAuthTag">
    <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="$parent.txType=null" >Back</button> 
        </div>
    <h4>Do you want to Authorize or Unauthorize an Account for Deposits? </h4>
    <h5 style="margin:20px;color:lightskyblue">
        You need to make sure the accounts Deposit Authorization  
        </h5>

    <div>
        <button type="button" class="btn btn-lg btn-outline-success btn-inline-block " :class= "{'active' : (AuthUnauth =='authorize')}" style="font-size:26px;margin-top:10px" v-on:click="AuthUnauth = 'authorize'">
        Authorize
        </button>
        <button type="button" class="btn btn-lg btn-outline-danger btn-inline-block " :class= "{'active' : (AuthUnauth =='unauthorize')}" style="font-size:26px;margin-top:10px" v-on:click="AuthUnauth = 'unauthorize'">
        Unauthorize 
        </button>
    </div>

    <div v-if="AuthUnauth" class="container"> 
            <h4 style="margin:20px">
              Enter the account you want to <span :class="{'text-success' : (AuthUnauth =='authorize'), 'text-danger' : (AuthUnauth =='unauthorize')}" > {{ AuthUnauth }} </span> for deposits:  
            </h4>
        <div class="col-boom">
        	            <input v-model="acct" type="text" class="effect-2 no-border" placeholder="r****************************" @blur="acctCheck()">

            <span class="focus-border"></span>
        </div>
        
        <h5 v-if="!acctValid" style="margin:20px;color:lightskyblue">
            If you see this message, the issuer account is currently invalid. Please review and make sure the account begins with a lowercase letter
            "r", does not contain: capital letters "O" or "I", the lowercase letter "l" or the number "0" and is between 25 and 35 characters in length. 
        </h5>
        <div v-if="!acctValid && !qrModeAcct" style="margin-top:50px; margin-bottom:50px;">  
                <div style="margin-bottom:40px">or</div>
                <button @click="qrModeAcct=true" class="btn btn-outline-primary" type="button"><i class="fa fa-qrcode fa-5x" style="color:white;"></i></button>
                <div style="font-size:20px;">Scan QR Code</div>
                <h5 style="margin:20px;color:lightskyblue">Tip: Use your phone to look up the account on Bithomp, the QR Code will be displayed for easy scanning</h5>
            </div>
        <div v-if= "qrModeAcct">
            <qrcodeReader @decode="onQrDecodeAcct"> </qrcodeReader>
            <button type="button" class="btn btn-outline-primary" style="color:white; margin-top:10px" v-on:click ="cancelAcctQr()">
            Cancel
            </button>
        </div>
        </div>
    

        
        <div v-if="acctValid">
         <button type="button" @click="PreAuthTag('enterSequence')" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
        </div>
    </div>
    <!-- Enter Sequence -->
    <div v-if="preAuthTag =='enterSequence'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="PreAuthTag()" >Back</button> 
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
            <button type="button" @click="PreAuthTag('enterFee')" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
            </div>
    </div> 
    <!-- end Enter Sequence -->

         <!-- Enter Fee -->
    <div v-if="preAuthTag =='enterFee'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="PreAuthTag('enterSequence')" >Back</button> 
        </div>
        <h4>Enter the fee you want to pay for this transaction:</h4>
        <div class="col-boom">
        	<input class="effect-2 no-border" type="number" placeholder="enter in drops (10 drops = 0.000010xrp)" min=10 step=1 v-model="fee">
            <span class="focus-border"></span>
        </div>
        <div v-if="!multiSignSetup">
        <h5 style="margin:20px;color:lightskyblue">
            Hint: The minimum fee currently allowed is 10 drops (0.000010 XRP). If the XRPL is busy, a transaction with a low fee might not be processed in a timely manner.  
        </h5>
        <h5 style="margin:20px;color:lightskyblue">
            Fee currently set to: <span class="buttercup"> {{ FeeXRP }} </span> XRP
        </h5>
        </div>
        <div v-if="multiSignSetup">
        <h4 style="margin:20px;" class="neonRed">
            Since this is a Multi-Sign Transaction the fee will be multiplied by the <span class="buttercup"> Number of signers +1</span>  
        </h4>
        <h5 style="margin:20px;color:lightskyblue">
            Fee currently set to: <span class="buttercup"> {{ FeeXRP }} </span> XRP
        </h5>
        </div>

            <div  v-if="fee" >
            <button type="button" @click="PreAuthTag('ReviewTx'),prepTx()" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
            </div>
    </div> 
    <!-- end Enter Fee -->

    <!-- Review Tx -->
    <div v-if="preAuthTag =='ReviewTx'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="PreAuthTag('enterFee')" >Back</button> 
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
        <div v-if="!multiSignSetup"> 
        <h5 style="margin:20px;color:lightskyblue">
            After verifying the information above is correct, you can sign the transaction. 
            The next screen will provide you with the transaction blob, which you can submit on an online computer.
        </h5>
            <button type="button" class="btn btn-lg btn-outline-success" style="margin:20px;color:white;font-size:30px" @click="signTx(), PreAuthTag('signedTx')" >Sign Transaction</button>
            </div>
        <div v-if="multiSignSetup">
        <h5 style="margin:20px;color:lightskyblue">
            After verifying the information above is correct, you can apply the first signature to the transaction
            
        </h5>
            <div>
            <button type="button" class="btn btn-lg btn-outline-success" style="margin:20px;color:white;font-size:30px" @click="sendForSigning()" >Add Signature to Multi-Sign Transaction</button>
            </div>
    </div>
    </div> 
    <!-- end Review Tx -->

    <!-- Signed Tx -->
    <div v-if="preAuthTag =='signedTx'">
        <div style="text-align:left; margin-bottom:0px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="prepTx(),PreAuthTag('ReviewTx')" >Back</button> 
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
    
  
 


  
</template>

<script>
import RippledWsClientSign from "rippled-ws-client-sign";
import VueQrcode from '@xkeshi/vue-qrcode';
import Modalbtn from "./modalBtn";
import { QrcodeReader } from 'vue-qrcode-reader';
import { EventBus } from "./eventbus.js";


export default {
  name: "DepPreAuth",

  components: {
    VueQrcode,Modalbtn,QrcodeReader,
    },
  props: ["walletAddress", "secret", "signerCount", "multiSignSetup"],
  data() {
    return {
      
      fee:10,
      Sequence:null,
      signedTx:null,
      Transaction:{},
      txblob:false,
      qrModeAcct: false,
      AuthUnauth:null,
      acct:null,
      acctValid:false,
      preAuthTag:null,
      feeXRP:null,
      
    };
  },
  mounted() {},

  methods: {



    PreAuthTag: function(preAuthTag){
        this.preAuthTag = preAuthTag;
    },

    prepTx(){
      
    this.txblob=false
    if(this.signedTx && this.signedTx.tx_blob){
      this.signedTx.tx_blob = null
      }
    this.Transaction = {
              TransactionType: 'DepositPreauth',
              Account: this.walletAddress,
              Fee: this.fee,
              Sequence: this.Sequence *1,
            };
    if(this.AuthUnauth =="authorize"){
        this.Transaction.Authorize = this.acct
        if(this.Transaction.Unauthorize){
        delete this.Transaction.Unauthorize}
    }
    else if(this.AuthUnauth =="unauthorize"){
        this.Transaction.Unauthorize = this.acct
        if(this.Transaction.Authorize){
            delete this.Transaction.Authorize
        }
    }
    if (this.multiSignSetup) {
        this.Transaction.Fee =
          Number(this.fee) * (Number(this.signerCount) + 1);
        this.Transaction.SigningPubKey = "";
      }
    
    
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
    acctCheck() {
        if(this.acct){
        this.acct = this.acct.trim();
      var string = this.acct
      if (string.match(/^r[a-k+m-z+A-H+J-N+P-Z0-9]{25,}/) && string.length >= 25 && string.length <= 35) {
        this.acctValid = true
      }
      else{this.acctValid = false}
        }
    },

    onQrDecodeAcct: function (decodedString) {
      console.log(decodedString);
      this.acct = decodedString;
      this.qrModeAcct = false;
      this.acctCheck();
    },

    cancelAcctQr(){
      this.qrModeAcct = false;
    },
    sendForSigning() {
      EventBus.$emit("addSigTx", this.Transaction);
    },

    
  },
  computed: {
      FeeXRP() {
      let feeXRP;

      if (this.multiSignSetup) {
        feeXRP = (this.fee * (Number(this.signerCount) + 1)) / 1000000;
        return feeXRP;
      } else {
        feeXRP = this.fee / 1000000;
        return feeXRP;
      }
    },
    
    
  
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
