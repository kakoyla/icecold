<template>
  <div class="container">
    
    
    <!--Set Escrow Owner-->
    <div v-if="!regKeyTag">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="$parent.txType=null" >Back</button> 
        </div>
        <h4 style="margin:20px">Enter the Owner Account for the Escrow to be finished:</h4>
        <hr class="bglightskyblue" style="width:75%; height:0px;  border:none;margin-bottom:60px" />
        <div class="col-boom1">
        	<input class="effect-2 no-border" type="text" placeholder="r*****************************"  v-model="owner" @blur="ownerCheck()">
            <span class="focus-border"></span>
        </div>
        <h5 v-if="!ownerValid" style="margin:20px;color:lightskyblue">
            If you see this message, the Owner Account is currently invalid. Please review and make sure the account begins with a lowercase letter
            "r", does not contain: capital letters "O" or "I", the lowercase letter "l" or the number "0" and is between 25 and 35 characters in length. 
        </h5>
            <div  v-if="ownerValid" >
            <button type="button" @click="RegKeyTag('enterOfferSequence')" class="btn btn-outline-primary btn-lg" style="color:white">NEXT</button>
            </div>
            <div v-if="!ownerValid && !qrModeOwner" style="margin-top:50px; margin-bottom:50px;">  
                <div style="margin-bottom:40px">or</div>
                <button @click="qrModeOwner=true" class="btn btn-outline-primary" type="button"><i class="fa fa-qrcode fa-5x" style="color:white;"></i></button>
                <div style="font-size:20px;">Scan QR Code</div>
                <h5 style="margin:20px;color:lightskyblue">Tip: Use your phone to look up the account on Bithomp, the QR Code will be displayed for easy scanning</h5>
            </div>
        <div v-if= "qrModeOwner">
            <qrcodeReader @decode="onQrDecodeOwner"> </qrcodeReader>
            <button type="button" class="btn btn-outline-primary" style="color:white; margin-top:10px" v-on:click ="cancelOwnerQr()">
            Cancel
            </button>
        </div>
    </div>

    <!--Set Escrow OfferSequence-->
    <div v-if="regKeyTag =='enterOfferSequence'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="regKeyTag = null" >Back</button> 
        </div>
        <h4 style="margin:20px">Enter the Offer Sequence for the Escrow to be finished:</h4>
        <hr class="bglightskyblue" style="width:75%; height:0px;  border:none;margin-bottom:60px" />
        <div class="col-boom1">
        	<input class="effect-2 no-border" type="number" min=0 max=4294967295 placeholder="0"  v-model="offerSequence" >
            <span class="focus-border"></span>
        </div>
        <h5 style="margin:20px" class="buttercup">
            Enter the transaction sequence number of EscrowCreate transaction that created the Escrow you want to finish
            
        </h5>
        
            <div  v-if="offerSequence" >
            <button type="button" @click="RegKeyTag('enterMemo')" class="btn btn-outline-primary btn-lg" style="color:white">NEXT</button>
            </div>
            
        
    </div>

    <!-- Enter Memo -->
    <div class="container-fluid" v-if="regKeyTag =='enterMemo'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="regKeyTag='enterOfferSequence'">Back</button> 
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
            <button type="button" @click="RegKeyTag('enterSequence')" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
            </div>
    

    </div>
    <!--end Enter Memo -->

    <!-- Enter Sequence -->
    <div v-if="regKeyTag =='enterSequence'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="RegKeyTag('enterMemo')" >Back</button> 
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
            <button type="button" @click="RegKeyTag('enterFee')" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
            </div>
    </div> 
    <!-- end Enter Sequence -->

         <!-- Enter Fee -->
    <div v-if="regKeyTag =='enterFee'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="RegKeyTag('enterSequence')" >Back</button> 
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
            <button type="button" @click="RegKeyTag('ReviewTx'),prepTx()" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
            </div>
    </div> 
    <!-- end Enter Fee -->

    <!-- Review Tx -->
    <div v-if="regKeyTag =='ReviewTx'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="RegKeyTag('enterFee')" >Back</button> 
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
            <button type="button" class="btn btn-lg btn-outline-success" style="margin:20px;color:white;font-size:30px" @click="signTx(), RegKeyTag('signedTx')" >Sign Transaction</button>
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
    <div v-if="regKeyTag =='signedTx'">
        <div style="text-align:left; margin-bottom:0px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="prepTx(),RegKeyTag('ReviewTx')" >Back</button> 
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
  name: "SetRegularKey",

  components: {
    VueQrcode,Modalbtn,QrcodeReader,
    },
  props: ["walletAddress", "secret", "signerCount", "multiSignSetup"],
  data() {
    return {
      
      fee:10,
      memo:null,
      memoHex:null,
      Sequence:null,
      signedTx:null,
      Transaction:{},
      txblob:false,
      memoTag:null,
      owner:null,
      ownerValid:false,
      offerSequence:null,
      qrModeOwner: false,
      regKeyTag:null,
      feeXRP:null,
      
    };
  },
  mounted() {},

  methods: {

    MemoTag: function(memoTag) {
      this.memoTag = memoTag;
    },

    RegKeyTag: function(regKeyTag){
        this.regKeyTag = regKeyTag;
    },

    prepTx(){
      
    this.txblob=false
    if(this.signedTx && this.signedTx.tx_blob){
      this.signedTx.tx_blob = null
      }
    this.Transaction = {
              TransactionType: 'EscrowFinish',
              Account: this.walletAddress,
              Fee: this.fee.toString(),
              Sequence: this.Sequence *1,
              Owner: this.owner,
              OfferSequence: this.offerSequence,
            };
    
    if (this.multiSignSetup) {
        this.Transaction.Fee =
          (Number(this.fee) * (Number(this.signerCount) + 1)).toString();
        this.Transaction.SigningPubKey = "";
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
    onQrDecodeOwner: function (decodedString) {
      console.log(decodedString);
      this.owner = decodedString;
      this.qrModeOwner = false;
      this.ownerCheck();
    },

    ownerCheck() {
        if(this.owner){
        this.owner = this.owner.trim();
        var string = this.owner
        if (string.match(/^r[a-k+m-z+A-H+J-N+P-Z0-9]{25,}/) && string.length >= 25 && string.length <= 35) {
            this.ownerValid = true
        }
        else(this.ownerValid = false)
        }
        },

    cancelOwnerQr(){
      this.qrModeOwner = false;
    },

    MemoTag: function(memoTag) {
      this.memoTag = memoTag;
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
