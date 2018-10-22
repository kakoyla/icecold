<template>
  <div class="container">
    
    <div v-if="!sListTag">
    <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="$parent.txType=null" >Back</button> 
        </div>
    <h4>Do you want to Set a Signer List or do you want to Delete a Signer List? </h4>
    <button type="button" class="btn btn-lg btn-outline-success btn-block" style="font-size:26px;" @click="deleteList=false, SListTag('setlist')">
        Set a Signer List
    </button>
    <button type="button" class="btn btn-lg btn-outline-danger btn-block" style="font-size:26px;" @click="deleteList=true, SListTag('enterSequence')">
        Delete a Signer List
    </button>
    <h5 style="margin:20px;color:lightskyblue">
        You can only have <span class="buttercup">ONE</span> Signer List per account.
    </h5>
    <h5 style="margin:20px;color:lightskyblue">
        To change an existing Signer List, choose <span class="text-success"> Set a Signer List </span>. 
        The previous Signer List will be replaced, <span class="buttercup">NOT</span> updated. 
    </h5>
    <h5 style="margin:20px;color:lightskyblue">
        If you attempt to <span class="text-danger">Delete a Signer List</span> without an alternative signing method in place (ex: Master Key or Regular Key),
        the transaction will fail.   
    </h5>
      
    </div>
    <div v-if="sListTag =='setlist'">    
    <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="sListTag = null" >Back</button> 
        </div>
        <div>    <!--<div v-if="!qrModeEmail && !qrModeMessageKey"> -->
        <h4 v-if="!quorumReady">What should the Signer Quorum be set to?</h4>
        <h6 v-if="!quorumReady">(2 - 10,000)</h6>
        <div class="input-group" style="max-width:30%; margin-left:35%">
        <div class="input-group-prepend">
            <button class="btn btn-outline-dark active noPointer" type="button">Quorum</button>
        </div>
        <input type="number" class="form-control" min=2 max=10000 v-model="quorum" placeholder="Signer Quorum #" @blur="quorumCheck()"> 
      </div>
      <h4 class="lightskyblue" style="margin:20px" v-if="!quorumReady">
          This is the target weight you will need to reach when multi-signing. The sum of the weights from the signatures provided will need to be greater than or equal to this value.
      </h4>
      <h5 class="lightskyblue" style="margin:20px" v-if="!quorumReady">
          <span class="buttercup">Example:</span> If your quorum is <span class="buttercup">3</span>, you would need: 
      </h5>
      <h5 class="lightskyblue" style="margin:20px" v-if="!quorumReady">
          <span class="text-light">THREE</span> signers with the weight of <span class="buttercup">1</span>
      </h5>
      <h5 class="lightskyblue" style="margin:20px" v-if="!quorumReady"> or </h5>
      <h5 class="lightskyblue" style="margin:20px" v-if="!quorumReady">
          <span class="text-light">ONE</span> signer with the weight of <span class="buttercup">2</span> and <span class="text-light">ONE</span> signer with a weight of <span class="buttercup">1</span>
      </h5>    
        <div v-if="quorumReady" style="margin:20px">    
        <h4 class="lightskyblue"> Enter the Signer List Accounts and their Signing Weight </h4>
            
    
        <div v-for="(SignerEntry,i) in SignerEntries" :key="SignerEntry.Account">
      <!--Signer1-->
      <div style="margin-bottom:20px">
      <div class="input-group">
        
        <div class="input-group-prepend" v-if="SignerEntries[i].SignerEntry.Account">
            <input type="number" class="form-control" v-model="SignerEntries[i].SignerEntry.SignerWeight" min=1 max=10000 placeholder="weight">
        </div>
        <input type="text" class="form-control" v-model="SignerEntries[i].SignerEntry.Account" placeholder="r*****************************" @blur="acctCheck(SignerEntry.Account)" > 
        <div class="input-group-append">
            <qrScanBtn v-bind:i="i"></qrScanBtn>
            
        </div>
      </div>
     <!-- <hr class="black" style="width:100%; height:3px;  border:none;" /> -->
      </div>
        </div>
        <button v-if="signerAddMore" style="margin:20px" class="btn btn-outline-success" type="button" @click="addSigner()">Add Signer Entry</button>
        <button v-if="signerRemove" style="margin:20px" class="btn btn-outline-danger" type="button" @click="removeSigner()">Remove Last Signer Entry</button>

      <h4 class="lightskyblue">Total Weight in list: <span class="buttercup">{{weightSum}}</span></h4>
      

    </div>
    </div>





        <div v-if="weightSum >= quorum">
         <button type="button" @click="SListTag('enterSequence')" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
        </div>
        <h4 v-if="weightSum < quorum" class="lightskyblue"> Total Weight in Signers List must be higher than Quorum</h4>
    </div>
    <!-- Enter Sequence -->
    <div v-if="sListTag =='enterSequence'">
        <div v-if="!deleteList" style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="SListTag('setlist')" >Back</button> 
        </div>
        <div v-if="deleteList" style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="SListTag()" >Back</button> 
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
            <button type="button" @click="SListTag('enterFee')" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
            </div>
    </div> 
    <!-- end Enter Fee -->

         <!-- Enter Fee -->
    <div v-if="sListTag =='enterFee'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="SListTag('enterSequence')" >Back</button> 
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
            <button type="button" @click="SListTag('ReviewTx'),prepTx()" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
            </div>
    </div> 
    <!-- end Enter Fee -->

    <!-- Review Tx -->
    <div v-if="sListTag =='ReviewTx'">
        <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="SListTag('enterFee')" >Back</button> 
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
            <button type="button" class="btn btn-lg btn-outline-success" style="margin:20px;color:white;font-size:30px" @click="signTx(), SListTag('signedTx')" >Sign Transaction</button>
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
    <div v-if="sListTag =='signedTx'">
        <div style="text-align:left; margin-bottom:0px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="prepTx(),SListTag('ReviewTx')" >Back</button> 
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
import qrScanBtn from "./qrScanBtn"
import { QrcodeReader } from "vue-qrcode-reader";
import { EventBus } from "./eventbus.js";

export default {
  name: "SetSignerList",

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
      sListTag: null,
      deleteList: false,
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

    SListTag: function(sListTag) {
      this.sListTag = sListTag;
    },

    prepTx() {
      this.txblob = false;
      if (this.signedTx && this.signedTx.tx_blob) {
        this.signedTx.tx_blob = null;
      }
      this.Transaction = {
        TransactionType: "SignerListSet",
        Account: this.walletAddress,
        Fee: this.fee,
        Sequence: this.Sequence * 1
      };
      if (this.deleteList) {
        this.Transaction.SignerQuorum = 0
        }
      else {
        this.Transaction.SignerQuorum = this.quorum
        this.Transaction.SignerEntries = this.SignerEntries
      }
      if (this.multiSignSetup) {
        this.Transaction.Fee =
          Number(this.fee) * (Number(this.signerCount) + 1);
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
