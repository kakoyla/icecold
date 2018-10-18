<template>
  <div class="container">
    
    <div v-if="!acctSetTag">
    <div style="text-align:left; margin-bottom:20px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="$parent.txType=null" >Back</button> 
        </div>
    <div v-if="!qrModeEmail && !qrModeMessageKey">
    <h5 class="lightskyblue" style="margin:20px">
      To set or update a previously submitted value, click "SET". 
      To clear a previously submitted value click the "CLEAR" button. 
      To make no updates leave as "N/A". 
    </h5>
    
      <!--Domain-->
      <div style="margin-bottom:20px">
      <div class="input-group">
        
        <div class="input-group-prepend">
          <button class="btn btn-outline-dark" :class= "{'active' : !domain.set & !domain.clear}" type="button" @click="domain.set=false, domain.clear=false">N/A</button>
          <button class="btn btn-outline-success" :class= "{'active' : (domain.set)}" type="button" @click="domain.set=true, domain.clear=false">SET</button>
          <button class="btn btn-outline-danger" :class= "{'active' : (domain.clear)} " type="button" @click="domain.set=false, domain.clear=true, domain.value =null">CLEAR</button>
        </div>
        <h5 style="margin:10px">Domain: </h5>
         
        <input type="text" class="form-control" v-model="domain.value" placeholder="example.com" @blur="checkDomain()" :disabled="!domain.set">
      </div>
      </div>
      <hr class="black" style="width:100%; height:3px;  border:none;" />
      <!--Gravatar/Email Hash-->
      <div style="margin-bottom:20px">
      <div class="input-group">
        
        <div class="input-group-prepend">
          <button class="btn btn-outline-dark" :class= "{'active' : !email.set & !email.clear}" type="button" @click="email.set=false, email.clear=false">N/A</button>
          <button class="btn btn-outline-success" :class= "{'active' : (email.set)}" type="button" @click="email.set=true, email.clear=false">SET</button>
          <button class="btn btn-outline-danger" :class= "{'active' : (email.clear)} " type="button" @click="email.set=false, email.clear=true, email.hash=null">CLEAR</button>
        </div>
        <h5 style="margin:10px">Gravatar/Email Hash: </h5>
        <input type="text" class="form-control" :class= "{'text-danger' : (!email.valid)}" v-model="email.hash" placeholder="ex: 5b33b93c7ffe384d53450fc666bb11fb" @keyup="checkEmailHash()" :disabled="!email.set">
        <div class="input-group-append">
          <button class="btn btn-outline-light" type="button" @click="qrModeEmail = true" :disabled="!email.set"><i class="fa fa-qrcode"></i></button>
        </div>
      </div>
      </div>
      <hr class="black" style="width:100%; height:3px;  border:none;" />
      <!--MessageKey-->
      <div style="margin-bottom:20px">
      <div class="input-group">
        
        <div class="input-group-prepend">
          <button class="btn btn-outline-dark" :class= "{'active' : !messageKey.set & !messageKey.clear}" type="button" @click="messageKey.set=false, messageKey.clear=false">N/A</button>
          <button class="btn btn-outline-success" :class= "{'active' : (messageKey.set)}" type="button" @click="messageKey.set=true, messageKey.clear=false">SET</button>
          <button class="btn btn-outline-danger" :class= "{'active' : (messageKey.clear)} " type="button" @click="messageKey.set=false, messageKey.clear=true, messageKey.value=null">CLEAR</button>
        </div>
        <h5 style="margin:10px">Message Key: </h5>
        <input type="text" style="font-size:16px" class="form-control" :class= "{'text-danger' : (!messageKey.valid)}" v-model="messageKey.value" placeholder="Public key for sending encrypted messages to this account (33-byte Hex)" @keyup="checkMessageKey()" :disabled="!messageKey.set" >
        <div class="input-group-append">
          <button class="btn btn-outline-light" type="button" @click="qrModeMessageKey = true" :disabled="!messageKey.set"><i class="fa fa-qrcode"></i></button>
        </div>
      </div>
      </div>
      <hr class="black" style="width:100%; height:3px;  border:none;" />
      <!--TransferRate-->
      <div style="margin-bottom:20px">
      <div class="input-group">
        
        <div class="input-group-prepend">
          <button class="btn btn-outline-dark" :class= "{'active' : !transferRate.set & !transferRate.clear}" type="button" @click="transferRate.set=false, transferRate.clear=false">N/A</button>
          <button class="btn btn-outline-success" :class= "{'active' : (transferRate.set)}" type="button" @click="transferRate.set=true, transferRate.clear=false">SET</button>
          <button class="btn btn-outline-danger" :class= "{'active' : (transferRate.clear)} " type="button" @click="transferRate.set=false, transferRate.clear=true, transferRate.bps = null">CLEAR</button>
        </div>
        <h5 style="margin:10px">Transfer Rate (basis points): </h5>
        <input type="number" v-model="transferRate.bps" placeholder="0 bps" max=10000 min=0 step="0.01" @keyup="transferRateConvert()" @click="transferRateConvert()" @wheel="transferRateConvert()" :disabled="!transferRate.set">
        <div v-if="transferRate.bps" class="inline lightskyblue" style="margin-left: 20px; font-size:20px">( {{transferRate.percentage}} % ) </div>
      </div>
      </div>
      <hr class="black" style="width:100%; height:3px;  border:none;" />
      <!--TickSize-->
      <div style="margin-bottom:20px">
      <div class="input-group">
        
        <div class="input-group-prepend">
          <button class="btn btn-outline-dark" :class= "{'active' : !tickSize.set & !tickSize.clear}" type="button" @click="tickSize.set=false, tickSize.clear=false">N/A</button>
          <button class="btn btn-outline-success" :class= "{'active' : (tickSize.set)}" type="button" @click="tickSize.set=true, tickSize.clear=false">SET</button>
          <button class="btn btn-outline-danger" :class= "{'active' : (tickSize.clear)} " type="button" @click="tickSize.set=false, tickSize.clear=true, tickSize.value = null">CLEAR</button>
        </div>
        <h5 style="margin:10px">Tick Size (significant digits, 3-15): </h5>
        <input type="number" v-model="tickSize.value" placeholder="0" max=15 min=3 step="1" @keyup="tickSizeCheck()" @click="tickSizeCheck()" @wheel="tickSizeCheck()" :disabled="!tickSize.set">
      </div>
      </div>
      <hr class="black" style="width:100%; height:3px;  border:none;" />

    
    <h5 class="lightskyblue" style="margin:10px">
      Select a setting flag to enable or disable. Leave blank for no changes.
    </h5>


    <select class="form-control"  v-model="selected" @click="FlagOnOff(null)">
    <option  v-for="option in options" v-bind:value="option">
      {{ option.text }}
    </option>
    </select>
    <div v-if="selected.value">
    <button type="button" class="btn btn-lg btn-outline-success btn-inline-block " :class= "{'active' : (flagOnOff =='enable' & selected.abrev !=null)}" style="font-size:26px;margin-top:10px" v-on:click="FlagOnOff('enable')">
       Enable {{selected.abrev}} 
    </button>
    <button type="button" class="btn btn-lg btn-outline-danger btn-inline-block " :disabled="selected.value ==6" :class= "{'active' : (flagOnOff =='disable' & selected.abrev !=null)}" style="font-size:26px;margin-top:10px" v-on:click="FlagOnOff('disable')">
       Disable {{selected.abrev}}
    </button>
    </div>
    <div v-if="(selected.value ==null && flagOnOff ==null) || (selected.value !=null && flagOnOff !=null)" style="margin:20px">
         <button type="button" @click="AcctSetTag('enterSequence')" class="btn btn-outline-primary btn-lg" style="color:white;margin:20px">NEXT</button>
        </div>
    </div>
    <div v-if= "qrModeEmail">
            <qrcodeReader @decode="onQrDecodeEmail"> </qrcodeReader>
            <button type="button" class="btn btn-outline-primary" style="color:white; margin-top:10px" v-on:click ="cancelEmailQr()">
            Cancel
            </button>
        </div>

    <div v-if= "qrModeMessageKey">
            <qrcodeReader @decode="onQrDecodeMessageKey"> </qrcodeReader>
            <button type="button" class="btn btn-outline-primary" style="color:white; margin-top:10px" v-on:click ="cancelMessageKeyQr()">
            Cancel
            </button>
        </div>
    </div>
        
    





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
        
        <div style="text-align:left">
        <hr class="bglightskyblue" style="width:100%; height:1px;  border:none;" />  
        <h5 v-if="Transaction.Domain !=null">Domain 
            <span v-if="domain.set">
             set to: 
              <span class="buttercup">
                {{ domain.value }} 
              </span>
            </span>
            <span v-if="domain.clear"><span class="badge badge-danger"> cleared </span></span>
        </h5>
        <h5 v-if="Transaction.EmailHash !=null">Email Hash / Gravatar 
            <span v-if="email.set">
             set to: 
              <span class="buttercup">
                {{ email.hash }} 
              </span>
            </span>
            <span v-if="email.clear"><span class="badge badge-danger"> cleared </span></span>
        </h5>
        <h5 v-if="Transaction.MessageKey !=null">Message Key
            <span v-if="messageKey.set">
             set to: 
              <span class="buttercup">
                {{ messageKey.value }} 
              </span>
            </span>
            <span v-if="messageKey.clear"><span class="badge badge-danger"> cleared </span></span>
        </h5>
        <h5 v-if="Transaction.TransferRate !=null">Transfer Rate
            <span v-if="transferRate.set">
             set to: 
              <span class="buttercup">
                {{ transferRate.bps }} basis points ( {{ transferRate.percentage }} % )
              </span>
            </span>
            <span v-if="transferRate.clear"><span class="badge badge-danger"> cleared </span></span>
        </h5>
        <h5 v-if="Transaction.TickSize !=null">Tick Size
            <span v-if="tickSize.set">
             set to: 
              <span class="buttercup">
                {{ tickSize.value }} significant digits
              </span>
            </span>
            <span v-if="tickSize.clear"><span class="badge badge-danger"> cleared </span></span>
        </h5>
        <h5 v-if="Transaction.SetFlag">
            <span class="badge badge-success">Enable Flag: </span> <span class="buttercup"> {{selected.text}} </span>
        </h5>
        <h5 v-if="Transaction.ClearFlag">
            <span class="badge badge-danger">Disable Flag: </span> <span class="buttercup"> {{selected.text}} </span>
        </h5>
        <hr class="bglightskyblue" style="width:100%; height:1px;  border:none;" />
        </div>
        
        <div v-if="!multiSignSetup">
        <h5 style="margin:20px;color:lightskyblue">
            After verifying the information above is correct, you can sign the transaction. 
            The next screen will provide you with the transaction blob, which you can submit on an online computer.
        </h5>

        

            
            <button type="button" class="btn btn-lg btn-outline-success" style="margin:20px;color:white;font-size:30px" @click="signTx(), AcctSetTag('signedTx')" >Sign Transaction</button>
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
import { EventBus } from "./eventbus.js";


export default {
  name: "AccountSet",

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
      domain:{
        value:null,
        set:false,
        clear:false,
      },
      email:{
        hash:null,
        set:false,
        clear:false,
        valid:false,
      },
      messageKey:{
        value:null,
        set:false,
        clear:false,
        valid:false,
      },
      transferRate:{
        value:null,
        set:false,
        clear:false,
        bps:null,
        percentage:null,
      },
      tickSize:{
        value:null,
        set:false,
        clear:false,
      },
      selected:{
        value: null,
        text: null,
      },
      options: [
      { text: '', value:null, abrev:null   }, 
      { text: 'Require a Destination Tag to send transactions to this account', value:1, abrev:'RequireDest'   },
      { text: "Require Approval to hold this account's IOUs", value:2, abrev:'RequireAuth'   },
      { text: 'Do Not send XRP to this account', value:3, abrev:'DisallowXRP'   },
      { text: "Track the ID of this account's most recent transaction", value:5, abrev:'AccountTxnID'   },
      { text: 'Permanently give up the ability to freeze individual trust lines or disable Global Freeze', value:6, abrev:'NoFreeze'   },
      { text: 'Freeze all assets issued by this account', value:7, abrev:'GlobalFreeze'   },
      { text: "Rippling", value:8, abrev:'DefaultRipple'   },
      { text: 'Reject Unauthorized Deposits', value:9, abrev:'DepositAuth'  },
    ],
      qrModeEmail: false,
      qrModeMessageKey: false,
      flagOnOff:null,
      
      acctSetTag:null,
      feeXRP:null,
      
    };
  },
  mounted() {},

  methods: {

    FlagOnOff: function(onOff) {
      this.flagOnOff = onOff;
    },

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
            };
    //check for Domain
    if(this.domain.set){
        this.Transaction.Domain = Buffer.from(this.domain.value, 'utf8').toString('hex').toUpperCase()
      }
    else if(this.domain.clear){
        this.Transaction.Domain = ''
      }
    else if(this.Transaction.Domain){
      delete Transaction.Domain
      };
    //check for email
    if(this.email.set){
        this.Transaction.EmailHash = this.email.hash
      }
    else if(this.email.clear){
        this.Transaction.EmailHash = 'D41D8CD98F00B204E9800998ECF8427E'
      }
    else if(this.Transaction.EmailHash){
      delete Transaction.EmailHash
      };
    //check for message key
    if(this.messageKey.set){
        this.Transaction.MessageKey = this.messageKey.value
      }
    else if(this.messageKey.clear){
        this.Transaction.MessageKey = ""
      }
    else if(this.Transaction.MessageKey){
      delete Transaction.MessageKey
      };
    //check for transfer rate
    if(this.transferRate.set){
        this.Transaction.TransferRate = this.transferRate.value
      }
    else if(this.transferRate.clear){
        this.Transaction.TransferRate = 0
      }
    else if(this.Transaction.TransferRate){
      delete Transaction.TransferRate
      };
    //check for tick size
    if(this.tickSize.set){
        this.Transaction.TickSize = this.tickSize.value*1
      }
    else if(this.tickSize.clear){
        this.Transaction.TickSize = 0
      }
    else if(this.Transaction.TickSize){
      delete Transaction.TickSize
      };
    //check for flag
    if(this.selected.value){
      if(this.flagOnOff == 'enable'){
        this.Transaction.SetFlag = this.selected.value
        if(this.Transaction.ClearFlag){
          delete Transaction.ClearFlag
        }
      }
      else if(this.flagOnOff =='disable'){
        this.Transaction.ClearFlag = this.selected.value
        if(this.Transaction.SetFlag){
          delete Transaction.SetFlag
        }
      }}
      else if(this.Transaction.SetFlag){
        delete Transaction.SetFlag
      }
      else if(this.Transaction.ClearFlag){
        delete Transaction.ClearFlag
      };
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
    issuerCheck() {
        this.LimitAmount.issuer = this.LimitAmount.issuer.trim();
      var string = this.LimitAmount.issuer
      if (string.match(/^r[a-k+m-z+A-H+J-N+P-Z0-9]{25,}/) && string.length >= 25 && string.length <= 35) {
        this.LimitIssuerValid = true
      }
      else(this.LimitIssuerValid = false)
    },

    onQrDecodeEmail: function (decodedString) {
      console.log(decodedString);
      this.email.hash = decodedString;
      this.qrModeEmail = false;
      this.checkEmailHash();
    },

    cancelEmailQr(){
      this.qrModeEmail = false;
    },

    onQrDecodeMessageKey: function (decodedString) {
      console.log(decodedString);
      this.messageKey.value = decodedString;
      this.qrModeMessageKey = false;
      this.checkMessageKey();
    },

    cancelMessageKeyQr(){
      this.qrModeMessageKey = false;
    },

    checkDomain(){
      this.domain.value = this.domain.value.trim();
      this.domain.value = this.domain.value.replace(/^\/\/|^.*?:(\/\/)?/, ''); //removes http/s:
      this.domain.value = this.domain.value.replace(/^www\./,''); //removes www.
      this.domain.value = this.domain.value.toLowerCase();
      this.domain.value = this.domain.value.trim();
      
    },

    checkMessageKey(){
      this.messageKey.value = this.messageKey.value.trim().toUpperCase();
      var string = this.messageKey.value
      if (string.match(/^[0-9A-Fa-f]{66}$/)){
        this.messageKey.valid = true
      }
      else(this.messageKey.valid = false)
    },

    checkEmailHash(){
      this.email.hash = this.email.hash.trim().toUpperCase();
  
      var string = this.email.hash
      if (string.match(/^$|^[A-Fa-f0-9]{32}$/)){
        this.email.valid = true
      }
      else(this.email.valid = false)
    },

    transferRateConvert(){
        if(this.transferRate.bps>10000){
          this.transferRate.bps = 10000
        }
        else if(this.transferRate.bps<0){
          this.transferRate.bps =0
        };
        this.transferRate.percentage = (this.transferRate.bps/100).toFixed(7);
        this.transferRate.value = this.transferRate.bps*100000+1000000000
      },
      tickSizeCheck(){
        if(this.tickSize.value>15){
          this.tickSize.value = 15
        }
        else if(this.tickSize.value<3){
          this.tickSize.value =3
        };
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
                
input:disabled[placeholder] {
    background: black;
   color:grey;
}

select{
    background: black !important;
    color:#FBCD4B;
    font-size: 20px;
    text-align: center;
    text-align-last: center;
   
    
}
select:focus{
    background: black !important;
    color:lightskyblue;
    font-size: 20px;
    
}




   

input[type="radio"] {
  margin-top: -2px;
  vertical-align: top;
}
</style>
