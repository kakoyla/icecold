<template>
  <div class="container">


  <!-- Payment -->
  <div class="container"> 
      
      <!-- Enter Destination -->
    <div v-if="!paymentStep">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="$parent.txType=null" >Back</button> 
        </div>
        <h4>Enter the Destination Account</h4>
        <div class="col-boom1">
        	<input class="effect-2 no-border" type="text" placeholder="r*****************************"  v-model="destination.Account" @blur="destinationCheck()">
            <span class="focus-border"></span>
        </div>
        <h5 v-if="!destination.Valid" style="margin:20px;color:lightskyblue">
            If you see this message, the destination account is currently invalid. Please review and make sure the account begins with a lowercase letter
            "r", does not contain: capital letters "O" or "I", the lowercase letter "l" or the number "0" and is between 25 and 35 characters in length. 
        </h5>
            <div  v-if="destination.Valid" >
            <button type="button" @click="pymtStep('destinationTag')" class="btn btn-outline-primary btn-lg" style="color:white">NEXT</button>
            </div>
            <div v-if="!destination.Valid && !qrModeDest" style="margin-top:50px; margin-bottom:50px;">  
                <div style="margin-bottom:40px">or</div>
                <button @click="qrModeDest=true" class="btn btn-outline-primary" type="button"><i class="fa fa-qrcode fa-5x" style="color:white;"></i></button>
                <div style="font-size:20px;">Scan QR Code</div>
                <h5 style="margin:20px;color:lightskyblue">Tip: Use your phone to look up the account on Bithomp, the QR Code will be displayed for easy scanning</h5>
            </div>
        <div v-if= "qrModeDest">
            <qrcodeReader @decode="onQrDecodeDestination"> </qrcodeReader>
            <button type="button" class="btn btn-outline-primary" style="color:white; margin-top:10px" v-on:click ="cancelDestQr()">
            Cancel
            </button>
        </div>
    </div> 
    <!-- end Enter Destination -->

    <!-- Enter Destination Tag -->
    <div v-if="paymentStep =='destinationTag'" class="container">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="paymentStep=null" >Back</button> 
        </div>
        <h4> Do you have a Destination tag to enter? </h4> 
        <button type="button" class="btn btn-lg btn-outline-success btn-block" :class= "{'active' : (destTag =='yes')}" style="font-size:26px;" v-on:click="dTag('yes')">
          YES
        </button>
      <button type="button" class="btn btn-lg btn-outline-danger btn-block" :class= "{'active' : (destTag =='no')}" style="font-size:26px;" v-on:click="dTag('no'),(destination.Tag=null)">
          NO
        </button>
        <div v-if="destTag =='yes'" class="col-boom">
        	<input class="effect-2 no-border" style="width:100%" type="number" placeholder="destination tag" min=0 max=4294967295 step=1  v-model="destination.Tag">
            <span class="focus-border"></span>
        </div>
        

        <h5 style="margin:20px;color:lightskyblue">
            Hint: Destination tags are often used by exchanges, make sure to enter one if your exchange requires it, or your payment could be lost. 
            Destination tags are not required when sending to another on ledger account you control. 
        </h5>

        <div v-if="destTag =='no' || destination.Tag" >
            <button type="button" @click="pymtStep('currencyType')" class="btn btn-outline-primary btn-lg" style="color:white;margin-top:5px">NEXT</button>
            </div>
    </div>
    <!-- end Enter Destination Tag -->

    <!-- Enter Currency Type -->
    <div v-if="paymentStep =='currencyType'" class="container">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="paymentStep='destinationTag'" >Back</button> 
        </div>
        <h4> Are you sending <span class="lightskyblue" > XRP </span> or an other currency? </h4>
        <button type="button" class="btn btn-lg btn-outline-primary btn-block" :class= "{'active' : (curXrp =='XRP')}" style="font-size:26px;" v-on:click="curType('XRP')">
           XRP 
        </button>
      <button type="button" class="btn btn-lg btn-outline-primary btn-block" :class= "{'active' : (curXrp =='OTH')}" style="font-size:26px;" v-on:click="curType('OTH')">
           Other 
        </button>

    <!-- Enter Other Currency Info -->
        <div v-if="curXrp =='OTH'" class="container">
            <h4 style="margin:20px">
              Enter the CURRENCY CODE you want to send:  
            </h4>
        <div class="col-boom">
        	<input v-model="currencyAmount.currency" type="text" class="form-control" maxlength="3" minlength="3" placeholder="ex: USD / BTC / etc">
            <span class="focus-border"></span>
        </div>
        

        <h5 v-if="!currencyAmount.currency" style="margin:20px;color:lightskyblue">
            Enter 3 Character currency code. Use ALL CAPS unless instructed not to. Although it is possible to use currencies codes on XRPL that are longer than 3 characters,
            it is assumed if you know how to use these you wouldn't be using this tool.
        </h5>

        <div v-if="currencyAmount.currency" class="container"> 
            <h4 style="margin:20px">
              Enter the ISSUER of the <span class="buttercup" > {{currencyAmount.currency}} </span> you want to send:  
            </h4>
        <div class="col-boom1">
        	            <input v-model="currencyAmount.issuer" type="text" class="effect-2 no-border" placeholder="r****************************" @blur="issuerCheck()">

            <span class="focus-border"></span>
        </div>
        <h5 v-if="!currencyAmount.valid" style="margin:20px;color:lightskyblue">
            If you see this message, the issuer account is currently invalid. Please review and make sure the account begins with a lowercase letter
            "r", does not contain: capital letters "O" or "I", the lowercase letter "l" or the number "0" and is between 25 and 35 characters in length. 
        </h5>
        <div v-if="!currencyAmount.valid && !qrModeIssuer" style="margin-top:50px; margin-bottom:50px;">  
                <div style="margin-bottom:40px">or</div>
                <button @click="qrModeIssuer=true" class="btn btn-outline-primary" type="button"><i class="fa fa-qrcode fa-5x" style="color:white;"></i></button>
                <div style="font-size:20px;">Scan QR Code</div>
                <h5 style="margin:20px;color:lightskyblue">Tip: Use your phone to look up the account on Bithomp, the QR Code will be displayed for easy scanning</h5>
            </div>
        <div v-if= "qrModeIssuer">
            <qrcodeReader @decode="onQrDecodeIssuer"> </qrcodeReader>
            <button type="button" class="btn btn-outline-primary" style="color:white; margin-top:10px" v-on:click ="cancelIssuerQr()">
            Cancel
            </button>
        </div>
        </div> 
    </div>
    <!--end Enter Other Currency Info -->

    <div  v-if="( currencyAmount.currency && currencyAmount.valid ) || curXrp == 'XRP'" >
            <button type="button" @click="pymtStep('enterAmount'),currency2Send()" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
        </div>
    </div>
    <!--end Enter Currency Type -->

    <!-- Enter Payment Amount -->
    <div class="container" v-if="paymentStep =='enterAmount'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="paymentStep='currencyType'" >Back</button> 
        </div>
        <h4>Enter how much <span class="buttercup">{{cur2Send}}</span> you want to send</h4>
        <div v-if="cur2Send =='XRP'">
        <div class="col-boom">
        	<input v-model="amountToSend" style="width:100%" type="number" class="effect-2 no-border" placeholder="0.000000" step="0.000001" min="0.000001" max="99999999999.999999">
            <span class="focus-border"></span>
        </div>
        <h5 style="margin:20px;color:lightskyblue">
            Enter amount in XRP. Up to 6 decimal places allowed
            </h5>
        </div>
        <div v-if="cur2Send !='XRP'">
        <div class="col-boom">
        	<input v-model="currencyAmount.value" type="number" rDpsdD9vTwkf1GiNkxunLLDBXsEXG9GNmk class="effect-2 no-border" maxlength=16 placeholder="0.00">
            <span class="focus-border"></span>
        </div>
        <h5 style="margin:20px;color:lightskyblue">
            Enter amount in {{cur2Send}}. Non-XRP currency values allow for up to 16 significant digits.
            </h5>
        </div>
        <div v-if="currencyAmount.value || amountToSend">
         <button type="button" @click="pymtStep('enterMemo')" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
        </div>

    </div>
    <!--end Enter Payment Amount -->

    <!-- Enter Memo -->
    <div class="container-fluid" v-if="paymentStep =='enterMemo'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="paymentStep='enterAmount'" >Back</button> 
        </div>
        <h4>Do you want to enter a Memo?</h4>
        <button type="button" class="btn btn-lg btn-outline-success btn-block" :class= "{'active' : (memoTag =='yes')}" style="font-size:26px;" v-on:click="MemoTag('yes')">
          YES
        </button>
      <button type="button" class="btn btn-lg btn-outline-danger btn-block" :class= "{'active' : (memoTag =='no')}" style="font-size:26px;" v-on:click="MemoTag('no')">
          NO
        </button>
        <div v-if="memoTag =='yes'" class="col-boom">
        	<input class="effect-2 no-border" type="text" placeholder="Enter Memo Here"  v-model="memo">
            <span class="focus-border"></span>
        </div>
        

        <h5 style="margin:20px;color:lightskyblue">
            
        </h5>

        <div v-if="memoTag =='no' || memo" >
            <button type="button" @click="pymtStep('enterSequence')" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
            </div>
    

    </div>
    <!--end Enter Memo -->

     <!-- Enter Sequence -->
    <div v-if="paymentStep =='enterSequence'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="paymentStep='enterMemo'" >Back</button> 
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
            <button type="button" @click="pymtStep('enterFee')" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
            </div>
    </div> 
    <!-- end Enter Sequence -->

         <!-- Enter Fee -->
    <div v-if="paymentStep =='enterFee'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="paymentStep='enterSequence'" >Back</button> 
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

            <div  v-if="Sequence" >
            <button type="button" @click="pymtStep('ReviewPayment'),prepPymt()" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
            </div>
    </div> 
    <!-- end Enter Fee -->

     <!-- Review Payment -->
    <div v-if="paymentStep =='ReviewPayment'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="paymentStep='enterFee'" >Back</button> 
        </div>
        <h4 class="buttercup" style="margin:20px"><u> Please review your payment information:</u></h4>
        
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
            To verify the memo, you can enter the memo data into a Hex to ASCII converter found on the web.  
        </h5>

        

            <div>
            <button type="button" class="btn btn-lg btn-outline-success" style="margin:20px;color:white;font-size:30px" @click="signTx(), pymtStep('signedTx')" >Sign Transaction</button>
            </div>
    </div> 
    <!-- end Review Payment -->

    <!-- Signed Tx -->
    <div v-if="paymentStep =='signedTx'">
        <div style="text-align:left; margin-bottom:0px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="prepPymt(),paymentStep='ReviewPayment'" >Back</button> 
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
    <!-- end Payment -->

      

  </div>
 


  
</template>

<script>
import RippledWsClientSign from "rippled-ws-client-sign";
import { EventBus } from "./eventbus.js";
import VueQrcode from '@xkeshi/vue-qrcode';
import Modalbtn from "./modalBtn";
import { QrcodeReader } from 'vue-qrcode-reader';


export default {
  name: "CreateTxs",

  components: {
    VueQrcode,Modalbtn,QrcodeReader,
    },
  props: ["walletAddress", "secret"],
  data() {
    return {
      amountToSend:null,
      currencyAmount:{
        currency:null,
        issuer:null,
        value:null,
        valid:false,
      },
      curXrp:null,
      destination:{
          Account:null,
          Valid:false,
          Tag:null
      },
      fee:10,
      memo:null,
      memoHex:null,
      qrModeDest:false,
      qrModeIssuer:false,
      Sequence:null,
      signedTx:null,
      Transaction:{},
      txblob:false,
      txType: null,
      paymentStep: null,
      destTag:null,
      cur2Send:null,
      memoTag:null,
      feeXRP:null,
    };
  },
  mounted() {},

  methods: {
    display: function(txType) {
      this.txType = txType;
    },

    pymtStep: function(paymentStep) {
      this.paymentStep = paymentStep;
    },

    dTag: function(destTag) {
      this.destTag = destTag;
    },

    MemoTag: function(memoTag) {
      this.memoTag = memoTag;
    },

    curType: function(curXrp) {
      this.curXrp = curXrp;
    },


    prepPymt(){
      
      
    this.txblob=false
    if(this.signedTx && this.signedTx.tx_blob){
      this.signedTx.tx_blob = null
      }
    this.Transaction = {
              TransactionType: 'Payment',
              Account: this.walletAddress,
              Fee: this.fee,
              Destination: this.destination.Account,
              Sequence: this.Sequence *1,
            };
    if(this.cur2Send =="XRP"){        
        this.Transaction.Amount = this.amountToSend * 1000000 // Amount in drops, so multiply (6 decimal positions)
        }
    else{this.Transaction.Amount= {
        currency: this.currencyAmount.currency,
        value: this.currencyAmount.value,
        issuer: this.currencyAmount.issuer,
    }}

    if(this.destination.Tag){
        this.Transaction.DestinationTag = this.destination.Tag*1
    }
    else if(this.Transaction.DestinationTag){
        delete Transaction.DestinationTag
    }

    if(this.memo){
        this.Transaction.Memos = [{Memo:{MemoData: Buffer.from(this.memo, 'utf8').toString('hex').toUpperCase()}}];
        
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
          alert('There was an error when signing, see console log')
      })
    },
    onQrDecodeDestination: function (decodedString) {
      console.log(decodedString);
      this.destination.Account = decodedString;
      this.qrModeDest = false;
      this.destinationCheck();
    },

    destinationCheck() {
        this.destination.Account = this.destination.Account.trim();
      var string = this.destination.Account
      if (string.match(/^r[a-k+m-z+A-H+J-N+P-Z0-9]{25,}/) && string.length >= 25 && string.length <= 35) {
        this.destination.Valid = true
      }
      else(this.destination.Valid = false)
    },

    issuerCheck() {
        this.currencyAmount.issuer = this.currencyAmount.issuer.trim();
      var string = this.currencyAmount.issuer
      if (string.match(/^r[a-k+m-z+A-H+J-N+P-Z0-9]{25,}/) && string.length >= 25 && string.length <= 35) {
        this.currencyAmount.valid = true
      }
      else(this.currencyAmount.valid = false)
    },

    onQrDecodeIssuer: function (decodedString) {
      console.log(decodedString);
      this.currencyAmount.issuer = decodedString;
      this.qrModeIssuer = false;
      this.issuerCheck();
    },
    currency2Send: function () {
      if(this.curXrp =='XRP'){
          this.cur2Send = "XRP"
          }
        else{
              this.cur2Send = this.currencyAmount.currency
              }
      },

    cancelDestQr(){
      this.qrModeDest = false;
    },
    cancelIssuerQr(){
      this.qrModeIssuer = false;
    },

    toHex(str){
	var arr1 = [];
	for (var n = 0, l = str.length; n < l; n ++) 
     {
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
	 };
	return arr1.join('');
   },

    
  },
  computed: {
     FeeXRP(){
          this.feeXRP = this.fee / 1000000;
          return this.feeXRP
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
