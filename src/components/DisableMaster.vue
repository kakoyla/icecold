<template>
  <div class="container">
    
    <div v-if="!dMasterTag">
    <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="$parent.txType=null" >Back</button> 
        </div>
    <h4>Do you want to Disable the Master Key or Re-Enable the Master Key? </h4>
    <button type="button" class="btn btn-lg btn-outline-danger btn-block" :class= "{'active' : (disableMaster == true)}" style="font-size:26px;" @click="disableMaster=true">
        Disable Master Key
    </button>
    <button type="button" class="btn btn-lg btn-outline-success btn-block" :class= "{'active' : (disableMaster == false)}" style="font-size:26px;" @click="disableMaster=false">
        Enable Master Key
    </button>
    
    <div v-if="disableMaster==false">
    <h4 style="margin:20px;color:lightskyblue">
        To Re-Enable the Master Key, you will need to sign this transaction with either the <span class="buttercup">Regular Key</span>
        or by <span class="buttercup">Mutlisigning</span> method, depending on which alternative signing method you currently have setup.
    </h4>
    <h4 style="margin:20px;color:lightskyblue">
        If you have initiated this transaction using the <span class="buttercup">Standard Key Pair</span> method, 
        you need to start over, as the transaction will <span class="text-danger"><b>FAIL</b></span>.
    </h4>
    </div>

    <div v-if="disableMaster==true">
    <h3 style="margin:20px;color:red">
        <i class="fas fa-skull"></i><b>WARNING!!!</b> This is very dangerous, please do not use if you are not 100% conifdent in what you are doing. 
    </h3>
    <h4 style="margin:20px;color:lightskyblue">
        If you disable your Master Key and do not know what your <span class="buttercup">Regular Key</span> is, and do not have 
        <span class="buttercup">MultiSigning</span> setup and tested...</h4>

    <h2 style="margin:20px"> You <b>WILL</b> lose access to your funds <b>FOREVER!</b> </h2>
     <h2 style="margin:20px"> There is <b>NO ONE </b> that will be able to help you. </h2>
    </div>

    <div v-if="disableMaster !=null">
         <button type="button" @click="DMasterTag('enterSequence')" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
        </div>
      
    </div>
    
    <!-- Enter Sequence -->
    <div v-if="dMasterTag =='enterSequence'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="DMasterTag()" >Back</button> 
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
            <button type="button" @click="DMasterTag('enterFee')" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
            </div>
    </div> 
    <!-- end Enter Fee -->

         <!-- Enter Fee -->
    <div v-if="dMasterTag =='enterFee'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="DMasterTag('enterSequence')" >Back</button> 
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
            <button type="button" @click="DMasterTag('ReviewTx'),prepTx()" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
            </div>
    </div> 
    <!-- end Enter Fee -->

    <!-- Review Tx -->
    <div v-if="dMasterTag =='ReviewTx'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="DMasterTag('enterFee')" >Back</button> 
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
            <button type="button" class="btn btn-lg btn-outline-success" style="margin:20px;color:white;font-size:30px" @click="signTx(), DMasterTag('signedTx')" >Sign Transaction</button>
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
    <div v-if="dMasterTag =='signedTx'">
        <div style="text-align:left; margin-bottom:0px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="prepTx(),DMasterTag('ReviewTx')" >Back</button> 
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
import VueQrcode from "@xkeshi/vue-qrcode";
import Modalbtn from "./modalBtn";
import qrScanBtn from "./qrScanBtn";
import { QrcodeReader } from "vue-qrcode-reader";
import { EventBus } from "./eventbus.js";

export default {
  name: "DisableMaster",

  components: {
    VueQrcode,
    Modalbtn,
    QrcodeReader,
    qrScanBtn,
    
  },
  props: ["walletAddress", "secret", "signerCount", "multiSignSetup"],
  data() {
    return {
      fee: 10,
      Sequence: null,
      signedTx: null,
      Transaction: {},
      txblob: false,
      qrModeAcct: false,
      dMasterTag: null,
      disableMaster: null,
      feeXRP: null,
      quorumReady: false,
      quorum: null,
      scan:null,
      SignerEntries: [
        {
          SignerEntry: {
            Account: null,
            SignerWeight: null
          }
        },
        {
          SignerEntry: {
            Account: null,
            SignerWeight: null
          }
        }
      ]
    };
  },
  mounted() {
    EventBus.$on('qrScan', scan => {
      this.newScan(scan)
    })
  },

  methods: {
    addSigner() {
      if (this.SignerEntries.length < 8) {
        this.SignerEntries.push({
          SignerEntry: {
            Account: null,
            SignerWeight: null
          }
        });
      }
    },

    removeSigner() {
      this.SignerEntries.pop();
    },

    DMasterTag: function(dMasterTag) {
      this.dMasterTag = dMasterTag;
    },

    prepTx() {
      this.txblob = false;
      if (this.signedTx && this.signedTx.tx_blob) {
        this.signedTx.tx_blob = null;
      }
      this.Transaction = {
        TransactionType: "AccountSet",
        Account: this.walletAddress,
        Fee: this.fee.toString(),
        Sequence: this.Sequence * 1
      };
      if (this.disableMaster ===true) {
        this.Transaction.SetFlag = 4
        }
      else if (this.disableMaster ===false) {
        this.Transaction.ClearFlag = 4  
      }
      if (this.multiSignSetup) {
        this.Transaction.Fee =
          (Number(this.fee) * (Number(this.signerCount) + 1)).toString();
        this.Transaction.SigningPubKey = "";
      }
       
    },
    signTx() {
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
    acctCheck() {
      if(this.acct){
      this.acct = this.acct.trim();
      var string = this.acct;
      if (
        string.match(/^r[a-k+m-z+A-H+J-N+P-Z0-9]{25,}/) &&
        string.length >= 25 &&
        string.length <= 35
      ) {
        this.acctValid = true;
      } else {this.acctValid = false;}
      }
    },

    quorumCheck() {
      if (this.quorum < 2) {
        this.quorum = null;
        this.quorumReady = false;
      } else if (this.quorum > 10000) {
        this.quorum = null;
        this.quorumReady = false;
      } else if (this.quorum >= 2 && this.quorum <= 10000) {
        this.quorumReady = true;
      }
    },

    newScan: function(scan) {
      this.SignerEntries[scan.i].SignerEntry.Account = scan.acct;
    },

    cancelAcctQr() {
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
    signerAddMore() {
      if (this.SignerEntries.length < 8) {
        return true;
      } else {
        return false;
      }
    },

    signerRemove() {
      if (this.SignerEntries.length > 2) {
        return true;
      } else {
        return false;
      }
    },

    weightSum() {
      let sum = this.SignerEntries.reduce(function(prev, cur) {
        return Number(prev) + Number(cur.SignerEntry.SignerWeight);
      }, 0);
      return sum;
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

input:disabled[placeholder] {
  background: black;
  color: grey;
}

.noPointer {
  pointer-events: none;
}
</style>
