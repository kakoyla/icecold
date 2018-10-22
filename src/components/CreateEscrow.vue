<template>
  <div class="container">


  <!-- EscrowCreate -->
  <div class="container"> 
      
      <!-- Enter Destination -->
    <div v-if="!escrowStep">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="$parent.txType=null" >Back</button> 
        </div>
        <h4>Enter the Destination Account</h4>
        <h5 class="lightskyblue" style="margin:20px">This is the account the escrowed amount will be delivered to upon completion</h5>
        <div v-if="!qrModeDest">
        <div class="col-boom1">
        	<input class="effect-2 no-border" type="text" placeholder="r*****************************"  v-model="destination.Account" @blur="destinationCheck()">
            <span class="focus-border"></span>
        </div>
        <button v-if="!useOriginating" type="button" class="btn btn-outline-primary" style="font-size:20px;margin:20px" v-on:click="destination.Account = walletAddress, destinationCheck()">
        Deliver Back to Originating Account
    </button>
        <h5 v-if="!destination.Valid" style="margin:20px;color:lightskyblue">
            If you see this message, the destination account is currently invalid. Please review and make sure the account begins with a lowercase letter
            "r", does not contain: capital letters "O" or "I", the lowercase letter "l" or the number "0" and is between 25 and 35 characters in length. 
        </h5>
    </div>
            <div  v-if="destination.Valid" >
            <button type="button" @click="EscrowStep('destinationTag')" class="btn btn-outline-primary btn-lg" style="color:white">NEXT</button>
            </div>
            <div v-if="!destination.Valid && !qrModeDest" style="margin-top:10px; margin-bottom:10px;">  
                <div style="margin-bottom:10px">or</div>
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
    <div v-if="escrowStep =='destinationTag'" class="container">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="escrowStep=null" >Back</button> 
        </div>
        <h4> Do you have a Destination tag to enter? </h4> 
        <button type="button" class="btn btn-lg btn-outline-success btn-block" :class= "{'active' : (destTag =='yes')}" style="font-size:26px;" v-on:click="dTag('yes')">
          YES
        </button>
      <button type="button" class="btn btn-lg btn-outline-danger btn-block" :class= "{'active' : (destTag =='no')}" style="font-size:26px;" v-on:click="dTag('no'),(destination.Tag=null)">
          NO
        </button>
        <div v-if="destTag =='yes'" class="col-boom">
        	<input class="effect-2 no-border" style="width:100%" type="number" placeholder="destination tag" min=0 max=4294967295 step=1  v-model="destination.Tag" @blur="dtCheck()">
            <span class="focus-border"></span>
        </div>
        

        <h5 style="margin:20px;color:lightskyblue">
            Hint: Destination tags are often used by exchanges, make sure to enter one if your exchange requires it, or your payment could be lost. 
            Destination tags are not required when sending to another on ledger account you control. 
        </h5>

        <div v-if="destTag =='no' || destination.Tag" >
            <button type="button" @click="EscrowStep('enterAmount')" class="btn btn-outline-primary btn-lg" style="color:white;margin-top:5px">NEXT</button>
            </div>
    </div>
    <!-- end Enter Destination Tag -->

    

    <!-- Enter Escrow Amount -->
    <div class="container" v-if="escrowStep =='enterAmount'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="escrowStep='destinationTag'" >Back</button> 
        </div>
        <h4>Enter how much XRP do you want to Escrow?</h4>
        
        <div class="col-boom">
        	<input v-model="amount" style="width:100%" type="number" class="effect-2 no-border" placeholder="0.000000" step="0.000001" min="0.000001" max="99999999999.999999">
            <span class="focus-border"></span>
        </div>
        <h5 style="margin:20px;color:lightskyblue">
            Enter amount in XRP. Up to 6 decimal places allowed
            </h5>
        
        <div v-if="amount">
         <button type="button" @click="EscrowStep('enterTime')" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
        </div>

    </div>
    <!--end Enter Escrow Amount -->

    <!-- Enter Escrow Time -->
    <div class="container" v-if="escrowStep =='enterTime'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="escrowStep='enterAmount'" >Back</button> 
        </div>
        <h4>When do you want this Escrow to be unlocked?</h4>
        <div style="text-align:center;margin: 0 auto;width:400px"><flat-pickr placeholder="Select date and time"  :config="config" v-model="FinishAfter"></flat-pickr></div>
        <!--div class="col-boom">
        	<input v-model="FinishAfter" style="width:100%" type="datetime-local" class="effect-2 no-border" placeholder="0.000000" step="0.000001" min="0.000001" max="99999999999.999999">
            <span class="focus-border"></span>
        </div -->
        <h5 style="margin:20px" class="buttercup">
            Please make sure your system's time zone is set correctly, even if the time itself is not accurate. If the time zone is not correct, fix it then refresh the browswer to ensure the correct settings have been loaded. 
            </h5>
        <h5 style="margin:20px;color:lightskyblue">
            There is an assumption being made that your system is set to the correct time-zone. 
            The time you enter is assumed to be your systems local time.
            Local time then converted to <span class="text-success"> Unix Epoch Time </span> and finally converted to <span class="text-success"> Ripple Epoch Time </span>  (which is equal to Unix Epoch Time - 946684800 seconds).
            </h5>
        <h5 style="margin:20px;color:lightskyblue">
            If you attempt to submit an Escrow Create Transaction with a Finish date that has already past, it will fail with an error code of <span class="text-danger">tecNO_PERMISSION</span>
            </h5>
        <h5 style="margin:20px" class="buttercup">
            Note: The escrow release requires you to submit an Escrow Finish transaction, it is NOT automatic.
            </h5>
        <div v-if="FinishAfter">
        <h2 class="text-primary"><i class="fas fa-unlock"></i> UNLOCK DATE: </h2>    
        <h1>{{escrowsdate}}</h1>
        <h3>Ripple Epoch Time: {{calcRippleTime}}</h3>
        </div>
        
        <div v-if="FinishAfter">
         <button type="button" @click="EscrowStep('enterMemo')" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
        </div>

    </div>
    <!--end Enter Escrow Time -->

    <!-- Enter Memo -->
    <div class="container-fluid" v-if="escrowStep =='enterMemo'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="escrowStep='enterTime'" >Back</button> 
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
            <button type="button" @click="EscrowStep('enterSequence')" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
            </div>
    

    </div>
    <!--end Enter Memo -->

     <!-- Enter Sequence -->
    <div v-if="escrowStep =='enterSequence'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="escrowStep='enterMemo'" >Back</button> 
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
            <button type="button" @click="EscrowStep('enterFee')" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
            </div>
    </div> 
    <!-- end Enter Sequence -->

         <!-- Enter Fee -->
    <div v-if="escrowStep =='enterFee'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="escrowStep='enterSequence'" >Back</button> 
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
            Fee currently set to: <span class="buttercup"> {{ feeXRP }} </span> XRP
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
            <button type="button" @click="EscrowStep('ReviewPayment'),prepPymt()" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
            </div>
    </div> 
    <!-- end Enter Fee -->

     <!-- Review Payment -->
    <div v-if="escrowStep =='ReviewPayment'">
      
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="escrowStep='enterFee'" >Back</button> 
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
    <div v-if="!multiSignSetup">       
        <h5 style="margin:20px;color:lightskyblue">
            After verifying the information above is correct, you can sign the transaction. 
            The next screen will provide you with the transaction blob, which you can submit on an online computer.
            To verify the memo, you can enter the memo data into a Hex to ASCII converter found on the web.  
        </h5>

        

            
            <button type="button" class="btn btn-lg btn-outline-success" style="margin:20px;color:white;font-size:30px" @click="signTx(), EscrowStep('signedTx')" >Sign Transaction</button>
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
    <!-- end Review Payment -->

    <!-- Signed Tx -->
    <div v-if="escrowStep =='signedTx'">
        <div style="text-align:left; margin-bottom:0px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="prepPymt(),escrowStep='ReviewPayment'" >Back</button> 
        </div>
        <h4 class="buttercup" style=""> Here is the Signed Transaction:</h4>

        <div style="color:lightskyblue;word-wrap: break-word;">{{decodeTxBlob}}</div>

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
import VueQrcode from "@xkeshi/vue-qrcode";
import Modalbtn from "./modalBtn";
import { QrcodeReader } from "vue-qrcode-reader";
import binary from "ripple-binary-codec";
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';



export default {
  name: "CreateEscrow",

  components: {
    VueQrcode,
    Modalbtn,
    QrcodeReader,flatPickr,
  },
  props: ["walletAddress", "secret", "signerCount", "multiSignSetup"],
  data() {
    return {
      amount: null,
      FinishAfter:null,
      config: {
         // wrap: true, // set wrap to true only when using 'input-group'
          dateFormat: 'U',      
          enableTime:true,
          altInput: true,
          altFormat: 'F	j, Y \\ @ \\ h \\:\\ i K'

        },                
      HumanTime:null,
      rippleTime:null,
      destination: {
        Account: null,
        Valid: false,
        Tag: null
      },
      fee: 10,
      memo: null,
      memoHex: null,
      qrModeDest: false,
      Sequence: null,
      signedTx: null,
      Transaction: {},
      txblob: false,
      txType: null,
      escrowStep: null,
      destTag: null,
      memoTag: null,
      feeXRP: null,

    };
  },
  mounted() {},

  methods: {
    display: function(txType) {
      this.txType = txType;
    },

    EscrowStep: function(escrowStep) {
      this.escrowStep = escrowStep;
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

    prepPymt() {
      this.txblob = false;
      if (this.signedTx && this.signedTx.tx_blob) {
        this.signedTx.tx_blob = null;
      }
      this.Transaction = {
        TransactionType: "EscrowCreate",
        Account: this.walletAddress,
        Amount: (this.amount * 1000000).toString(), // Amount in drops, so multiply (6 decimal positions)
        FinishAfter: this.rippleTime,
        Fee: this.fee.toString(),
        Destination: this.destination.Account,
        Sequence: this.Sequence * 1
      };
      if (this.destination.Tag) {
        this.Transaction.DestinationTag = this.destination.Tag * 1;
      } else if (this.Transaction.DestinationTag) {
        delete Transaction.DestinationTag;
      }

      if (this.memo) {
        this.Transaction.Memos = [
          {
            Memo: {
              MemoData: Buffer.from(this.memo, "utf8")
                .toString("hex")
                .toUpperCase()
            }
          }
        ];
      } else if (this.Transaction.Memos) {
        delete Transaction.Memos;
      }
      if (this.multiSignSetup) {
        this.Transaction.Fee =
          (Number(this.fee) * (Number(this.signerCount) + 1)).toString();
        this.Transaction.SigningPubKey = "";
      }
    },

    signTx() {
      if (this.Transaction.SigningPubKey) {
        delete this.Transaction.SigningPubKey;
      }
      new RippledWsClientSign(this.Transaction, this.secret)
        .then(SignedTransaction => {
          this.signedTx = SignedTransaction;

          console.log("SignedTransaction", SignedTransaction);
          this.txblob = true;
        })
        .catch(SignError => {
          console.log("SignError", SignError.details);
          alert("There was an error when signing, see console log");
        });
    },

    MultisignTx() {
      this.Transaction.SigningPubKey = "";
      this.multiSigSecret = [this.secret];
      new RippledWsClientSign(this.Transaction, this.multiSigSecret)
        .then(SignedTransaction => {
          this.signedTx = SignedTransaction;

          console.log("SignedTransaction", SignedTransaction);
          this.txblob = true;
        })
        .catch(SignError => {
          console.log("SignError", SignError.details);
          alert("There was an error when signing, see console log");
        });
    },

    onQrDecodeDestination: function(decodedString) {
      console.log(decodedString);
      this.destination.Account = decodedString;
      this.qrModeDest = false;
      this.destinationCheck();
    },

    destinationCheck() {
      if(this.destination.Account){
      this.destination.Account = this.destination.Account.trim();
      var string = this.destination.Account;
      if (
        string.match(/^r[a-k+m-z+A-H+J-N+P-Z0-9]{25,}/) &&
        string.length >= 25 &&
        string.length <= 35
      ) {
        this.destination.Valid = true;
      } else {this.destination.Valid = false;}
      }
    },

    dtCheck() {
      if(this.destination.Tag<0){
      this.destination.Tag = null  
      }
      else if(this.destination.Tag >4294967295){
      this.destination.Tag =null}
    },


  

    cancelDestQr() {
      this.qrModeDest = false;
    },


    toHex(str) {
      var arr1 = [];
      for (var n = 0, l = str.length; n < l; n++) {
        var hex = Number(str.charCodeAt(n)).toString(16);
        arr1.push(hex);
      }
      return arr1.join("");
    },

    sendForSigning() {
      EventBus.$emit("addSigTx", this.Transaction);
    }
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

    calcRippleTime() {
      return this.rippleTime

        
    },

    escrowsdate() {
        if(this.FinishAfter){
          this.rippleTime = Number(this.FinishAfter)-946684800
    
        this.HumanTime = new Date((this.FinishAfter) * 1000).toLocaleTimeString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour12: true,
          hour:"numeric",
          minute:"numeric",
        });}
        else{this.HumanTime = null
        this.rippleTime = null
        }

        return this.HumanTime
      
        //var date = new Date((accountObject.CancelAfter + 946684800) * 1000);
    },

    useOriginating() {
      if(!this.destination.Account){
        return false}
      else if(this.walletAddress == this.destination.Account){
        return true
      }
      else{return false}
    },

    decodeTxBlob() {
      return binary.decode(this.signedTx.tx_blob);
    }
  }
};
</script>

<style scoped>

input {
  text-align: center;
  background: black;
  /*background: #343a40; */
  color: #fbcd4b;
  font-size: 22px;
}
input::-webkit-input-placeholder {
  color: lightskyblue !important;
}

input:-moz-placeholder {
  /* Firefox 18- */
  color: lightskyblue !important;
}

input::-moz-placeholder {
  /* Firefox 19+ */
  color: lightskyblue !important;
}

input:-ms-input-placeholder {
  color: lightskyblue !important;
}

flatpickr-input::-webkit-input-placeholder {
  color: lightskyblue !important;
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

.dropdown-item {
  font-family: Lato, Arial, Tahoma, Verdana;
  font-size: 1em;
  line-height: 1.5em;
  color: #07e2ff;
  font-weight: 500;
  text-shadow: none;
}
.drp-list:hover {
  color: #07e2ff;
  background: grey;
}


</style>
