<template>
  <div class="container">
  
 <nav class="navbar  navbar-dark bg-dark justify-content-center" style="border-bottom: 5px solid white">
      <a class="navbar-brand nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown">
      <span class="" style="text-align:center">Choose a Transaction Type</span>
   
   
          <div class="dropdown-menu bg-dark lightskyblue" style="width:30%; font-size:20px">
            <a class="dropdown-item drp-list" style="text-align:center" v-on:click="display('Payment')"> Payment</a>
            <a class="dropdown-item drp-list" style="text-align:center" v-on:click="display('AccountSet')"> Account Set</a>
            <a class="dropdown-item drp-list" style="text-align:center" v-on:click="display('SetRegularKey')"> Set Regular Key</a> 
            <a class="dropdown-item drp-list" style="text-align:center" v-on:click="display('TrustSet')"> Trust Set</a>
            <a class="dropdown-item drp-list" style="text-align:center" v-on:click="display('SignersListSet')"> Set Signers List</a> 
          </div></a>
           <a class="navbar-brand" style="" href="#"></a>
  
  <ul class="navbar-nav ml-auto" style="font-size:20px">

            <li class="nav-item" style="pointer-events: none">
              <a class="text-light" > Initiating Account: <span class="badge badge-dark buttercup" style="font-size:20px"> {{ walletAddress }}</span></a>
            </li>
  </ul>

    </nav>
<div class="container-fluid" style="margin-top:10px;margin-bottom:20px; font-size:22px">
  <div>Transaction Type: <span class="badge badge-success" style="font-size:20px">{{txType}}</span></div>
  </div>

  <div v-if="txType =='Payment'" class="container" style="margin-top:10px; font-size:22px">
    
   

    <!--
    
      <div class="col-boom">
          <label for="destinationAcct1"> Destination Account </label>
        	<input class="effect-2 no-border" type="text" id="destinationAcct1" placeholder="r*****************************"  v-model="seed">
            <span class="focus-border"></span>
            </div>
      

      <div class="col-boom">
        	<input class="effect-2 no-border" type="text" placeholder="Destination Account"  v-model="seed">
            <span class="focus-border"></span>
            </div>
      -->

      <form v-if="!qrModeDest">
  <div class="form-group row">
    <label for="destinationAcct" class="col-sm-3 col-form-label">Destination Account</label>
    <div class="col-sm-7">
      <div class="input-group">
      <input v-model="destination" class="form-control" type="text"  style="margin-right:1px"maxlength="35" minlength="25" id="destinationAcct" placeholder="r*****************************">
      <button @click="qrModeDest=true" class="btn btn-outline-primary zero-border" type="button"><span class="text-light" >QR</span> <i class="fa fa-qrcode" style="color:white;"></i></button>
    </div>
    </div>
  </div>
  <div class="form-group row">
    <label for="destinationTag" class="col-sm-3 col-form-label">Destination Tag</label>
    <div class="col-sm-5">
      <input v-model="destinationTag" type="number" class="form-control" id="destinationTag" placeholder="(if applicable)">
    </div>
  </div>
  <div class="form-group row">
    <label for="amountentry" class="col-sm-3 col-form-label">Amount</label>
    <div class="col-sm-5">
      <input v-model="amountToSend" type="number" step="0.000001" min="0" class="form-control" id="amountentry" placeholder=0>
    </div>
  </div>
    <div class="rounded">
    <div class="form-group row">
    <label for="currencytype" class="col-sm-3 col-form-label">Currency</label>
    <div class="col-sm-4" style="text-align:left">
    <div class="form-check">
      <input v-model="curXrp" class="form-check-input" type="radio" name="currecnyOptions" id="inlineRadio1" value="XRP">
      <label class="form-check-label" for="inlineRadio1">XRP</label>
    </div>
    <div class="form-check">
      <input v-model="curXrp" class="form-check-input" type="radio" name="currecnyOptions" id="inlineRadio2" value="OTH">
      <label class="form-check-label" for="inlineRadio2">Other</label>
    </div>
    </div>
    </div>
  
   <div class="form-group row" v-if="curXrp == 'OTH'">
    <label class="col-sm-3 col-form-label"></label>
    <label for="currency info" class="col-sm-3 col-form-label">Currency Code</label>
    <div class="col-sm-4">
            <input v-model="currencyAmount.currency" type="text" class="form-control" maxlength="3" minlength="3" id="currencyCode" placeholder="ex: USD / BTC / etc">
    </div>
  </div>
     <div class="form-group row" v-if="curXrp == 'OTH'">
    <label class="col-sm-3 col-form-label"></label>
    <label for="currency info" class="col-sm-3 col-form-label">Issuer</label>
    <div class="col-sm-4">
            <input v-model="currencyAmount.issuer" type="text" class="form-control" id="destinationAcct" maxlength="35" minlength="25" pattern="^\S+$" placeholder="r****************************">
    </div>
  </div>
  </div>
    <div class="form-group row" style="margin-top:15px">
    <label for="seqNum" class="col-sm-3 col-form-label">Sequence Number</label>
    <div class="col-sm-5">
      <input v-model="Sequence" type="number" class="form-control" id="seqNum" placeholder='required'>
    </div>
  </div>
    <div class="form-group row" style="margin-top:15px">
    <label for="Fee" class="col-sm-3 col-form-label">Fee</label>
    <div class="col-sm-5">
      <input v-model="fee" type="number" class="form-control" id="Fee" placeholder='enter in drops (10 drops = 0.000010xrp)'>
    </div>
  </div>
  <div class="form-group row">
    <label for="memo" class="col-sm-3 col-form-label">Memo</label>
    <div class="col-boom1">
      <input v-model="memo" class="effect-2A no-border" type="text" id="memo" placeholder="optional">
      <span class="focus-border"></span>
    </div>
  </div>
  <div>
    <button type="button" class="btn btn-lg btn-outline-primary" style="color:white" v-on:click ="prepPymt()">prepare</button><button type="button" class="btn btn-lg btn-outline-primary" style="color:white" v-on:click ="signTx()">Sign</button>
    </div>
    <div v-if="Transaction.Account" style="margin-top:15px;word-wrap: break-word;">
    <label for="txJson"><span class="badge badge-success">TX JSON</span></label>
    <div class="">
      {{Transaction}}
    </div>
  </div>
    
    
    
    <div v-if="txblob" style="margin-top:15px; word-wrap: break-word;">
      <label for="txJson"><span class="badge badge-success">TX Blob</span></label>
      <div class="" style="font-size:16px">
    {{signedTx.tx_blob}}
    </div>
    </div>
  <!--Modal-->
                <div v-if="txblob" class="container" style="margin-top:10px;margin-bottom:40px;margin-left:auto;margin-right:auto">
                  <Modalbtn v-bind:txblob="signedTx.tx_blob"></Modalbtn>
                </div>
                <!--end Modal-->  


    
  


</form>
<div v-if= "qrModeDest">
      <qrcodeReader @decode="onQrDecodeDestination"> </qrcodeReader>
      <button type="button" class="btn btn-outline-primary" style="color:white; margin-top:10px" v-on:click ="cancelDestQr()">
        Cancel
      </button>
    </div>
    </div>

      <div v-if="txType =='AccountSet'">
    
    account set form goes HERE

    </div>
          <div v-if="txType =='SetRegularKey'">
    
    set Regular Key form goes HERE

    </div>
    <div v-if="txType =='TrustSet'">
    
    trust set form goes HERE

    </div>

      <div v-if="txType =='SignersListSet'">
    
    set signers list form goes HERE

    </div>


  </div>
</template>

<script>
import RippledWsClientSign from "rippled-ws-client-sign";
import { EventBus } from "./eventbus.js";
import VueQrcode from '@xkeshi/vue-qrcode';
import Modalbtn from "./modalBtn";
import { QrcodeReader } from 'vue-qrcode-reader';


export default {
  name: "CreateTx",

  components: {
    VueQrcode,Modalbtn,QrcodeReader,
    },
  props: ["walletAddress", "secret"],
  data() {
    return {
      amountToSend:0,
      currencyAmount:{
        currency:null,
        issuer:null,
        value:0,
      },
      curXrp:"XRP",
      destination:null,
      destinationTag:null,
      fee:10,
      memo:null,
      memoHex:null,
      qrModeDest:false,
      Sequence:null,
      signedTx:null,
      Transaction:{},
      txblob:false,
      txType: null,
      
    };
  },
  mounted() {},

  methods: {
    display: function(txType) {
      this.txType = txType;
    },
    prepPymt(){
      
      
      this.txblob=false
      if(this.signedTx && this.signedTx.tx_blob){
      this.signedTx.tx_blob = null}
      this.Transaction = {
              TransactionType: 'Payment',
              Account: this.walletAddress,
              Fee: this.fee,
              Destination: this.destination,
              Amount: this.amountToSend * 1000000, // Amount in drops, so multiply (6 decimal positions)
              Sequence: this.Sequence *1,
              DestinationTag: this.destinationTag,
            };
            if(this.memo){
        this.Transaction.Memos = [{Memo:{MemoData: Buffer.from(this.memo, 'utf8').toString('hex')}}];
      }
      else if (this.Transaction.Memos){
        delete Transaction.Memos
      }
    },
    signTx(){
      new RippledWsClientSign(this.Transaction, this.secret).then((SignedTransaction) => {
        this.signedTx = SignedTransaction

  
          console.log('SignedTransaction', SignedTransaction)
          this.txblob=true
      }).catch((SignError) => {
          console.log('SignError', SignError.details)
      })
    },
    onQrDecodeDestination: function (decodedString) {
      console.log(decodedString);
      this.destination = decodedString;
      this.qrModeDest = false;
    },
    cancelDestQr(){
      this.qrModeDest = false;
    },
    toHex(str){
	var arr1 = [];
	for (var n = 0, l = str.length; n < l; n ++) 
     {
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
	 }
	return arr1.join('');
   },
  },
  computed: {
    destinationCheck: function () {
      var valid = false
      if(this.destination){
      var string = this.destination
      if (string.match(/^r[a-k+m-z+A-H+J-N+P-Z0-9]{25,}/)) {
        valid = true
      }
    }}
  }
};
</script>

<style scoped>
input {
  text-align: center;
  background: #343a40;
  color: lightskyblue;
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
  background-color: #343a40;
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
