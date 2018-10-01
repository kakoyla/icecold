<template>
  <div class="bg-black text-light container-fluid">
    <div v-if="!proceed">
       <img src="../../static/img/xrp-symbol-white.svg" width="200" height="200" style="margin-bottom:10px">
     
      <!--Ask Standard Key Pair or Regular Key -->
      <div class="container" v-if="UseRegularKey ==null"> 
      <h4>Are you using Standard Key Pair or Regular Key</h4>
        <button type="button" class="btn btn-lg btn-outline-success btn-block" style="font-size:26px;" v-on:click="RegKeyTag('NO')">
          Standard Key Pair
        </button>
      <button type="button" class="btn btn-lg btn-outline-primary btn-block" style="font-size:26px;" v-on:click="RegKeyTag('YES')">
          Regular Key
        </button>
        <h5 style="margin:20px;color:lightskyblue">
            If you do not know choose <span class="text-success">Standard Key Pair</span>.
        </h5> 
        <h5 style="margin:20px;color:lightskyblue">
            A <span class="text-primary">Regular Key</span> lets you sign with a secret from a different account, 
            but must be setup first. 
        </h5>
      </div>
      <!--END Ask Standard Key Pair or Regular Key -->

    <!--Enter Regular Key Pair -->
    <div v-if=" UseRegularKey == 'YES' "> 
    <div v-if="!qrModeRegKeyAcct && !qrModeRegKeySecret">
    <div class="container" style="height:100%;width:100%;">
     
     <!--Enter Initiating Account -->
    <div v-if="!initiatingSet">     
    <h4>Enter Initiating Account:</h4>
    <div class="col-boom">
        	<input class="effect-2 no-border" type="text" placeholder="r............................."  v-model="initiatingAcct" @blur="initAcctCheck()">
            <span class="focus-border"></span>
    </div>
    <h5 v-if="!initAcctValid" style="margin:20px;color:lightskyblue">
            If you see this message, the initiating account is currently invalid. Please review and make sure the account begins with a lowercase letter
            "r", does not contain: capital letters "O" or "I", the lowercase letter "l" or the number "0" and is between 25 and 35 characters in length. 
    </h5>
      <div v-if="!initAcctValid" style="margin-top:50px; margin-bottom:50px;">  
      <div style="margin-bottom:40px">or</div>
        <button @click="qrModeRegKeyAcct=true" class="btn btn-outline-primary" type="button">
          <i class="fa fa-qrcode fa-5x" style="color:white;"></i>
        </button>
      <div style="font-size:20px;">Scan QR Code</div>
    </div>
    <div v-if="initiatingAcct && initAcctValid" class="container">
      <div class="text-light" style="font-size:20px;">Initiating Account: </div>
      <div class="buttercup" style="font-size:36px;"> {{initiatingAcct}} </div> 
      <div style="margin-top:50px; margin-bottom:50px;">  
        <button @click="initiatingSet=true, walletAddress=initiatingAcct" class="btn btn-outline-primary btn-lg" style="color:white" type="button">NEXT</button>
      </div>
    </div>    
    </div>
     <!--End Enter Initiating Account -->

     <!--Enter Regular Key Secret -->
    <div v-if="initiatingSet">
      <h4>Enter Regular Key (signing account) Secret:</h4>
      <div class="col-boom">
        <input class="effect-2 no-border" type="text" placeholder="s............................."  v-model="regularKeySecret" @blur="getKeypairRegularKeySecret()">
        <span class="focus-border"></span>
      </div>
  
      <div v-if="!regularKeySecret" style="margin-top:50px; margin-bottom:50px;">  
      <div style="margin-bottom:40px">or</div>
        <button @click="qrModeRegKeySecret=true" class="btn btn-outline-primary" type="button">
          <i class="fa fa-qrcode fa-5x" style="color:white;"></i>
        </button>
      <div style="font-size:20px;">Scan QR Code</div>
    </div>
    <div v-if="regularKeyAddress" class="container" style="margin-top:10%">
      <div class="buttercup" style="font-size:20px;">Initiating Account: </div>
      <div class="lightskyblue" style="font-size:26px;"> {{walletAddress}} </div> 
      <div class="buttercup" style="font-size:20px;">Regular Key (signing) Account: </div>
      <div class="lightskyblue" style="font-size:26px;"> {{regularKeyAddress}} </div>

      <div class="container" style="margin-top:50px; margin-bottom:50px;">  
        <button @click="seed=regularKeySecret, proceed=true" class="btn btn-outline-primary btn-lg" style="color:white" type="button">NEXT</button>
      </div>
    </div>    

      
      
    </div>

  

    
    </div>
    </div>
    <div v-if= "qrModeRegKeyAcct">
      <qrcodeReader @decode="onQrDecodeInitAcct"> </qrcodeReader>
      <button type="button" class="btn btn-outline-primary" style="color:white; margin-top:10px" v-on:click ="cancelInitAcctQr()">
            Cancel
      </button>
    </div>
    <div v-if= "qrModeRegKeySecret">
      <qrcodeReader @decode="onQrDecodeRegKeySecret"> </qrcodeReader>
      <button type="button" class="btn btn-outline-primary" style="color:white; margin-top:10px" v-on:click ="cancelRegKeySecretQr()">
            Cancel
      </button>
    </div>


    </div>
    <!--END Enter Regular Key Pair -->
    
    <!--Enter Standard Key Pair -->
    <div v-if=" UseRegularKey == 'NO' ">
    <div v-if="!qrModeSeed">
    <div class="container" style="height:100%;width:100%;">
     
         
    
    <div class="col-boom">
        	<input class="effect-2 no-border" type="text" placeholder="Enter Secret"  v-model="seed" @blur="getKeypair()">
            <span class="focus-border"></span>
            </div>
        </div>
    <div v-if="walletAddress" class="container">
      <div class="text-light" style="font-size:20px;">wallet address: </div>
    <div class="buttercup" style="font-size:36px;"> {{walletAddress}} </div> 
     <div v-if="walletAddress" style="margin-top:50px; margin-bottom:50px;">  
    <button @click="proceed=true" class="btn btn-outline-primary btn-lg" style="color:white" type="button">NEXT</button>
    </div>
    </div>
    <div v-if="walletAddress == null" style="margin-top:50px; margin-bottom:50px;">  
      <div style="margin-bottom:40px">or</div>
    <button @click="qrModeSeed=true" class="btn btn-outline-primary" type="button"><i class="fa fa-qrcode fa-5x" style="color:white;"></i></button>
      <div style="font-size:20px;">Scan QR Code</div>
    </div>
    
    </div>
    <div v-if= "qrModeSeed">
      <qrcodeReader @decode="onQrDecode"> </qrcodeReader>
      <button type="button" class="btn btn-outline-primary" style="color:white; margin-top:10px" v-on:click ="cancelSeedQr()">
            Cancel
      </button>
    </div>
    </div> 
    <!--end Standard Key Pair -->

    </div>
    <!-- Chose Tx Type -->
  <div v-if="proceed && !txType" class='container'> 
      <h4> Which type of transaction would you like to create? </h4>
      <button type="button" class="btn btn-lg btn-outline-success btn-block" style="font-size:26px;" v-on:click="display('Payment')">
          Payment
        </button>
        <button type="button" class="btn btn-lg btn-outline-primary btn-block" style="font-size:26px;" v-on:click="display('TrustSet')">
          Set Trust
        </button>
      <button type="button" class="btn btn-lg btn-outline-warning btn-block" style="font-size:26px;" v-on:click="display('SetRegularKey')">
          Set Regular Key
        </button>
<!--      <button type="button" class="btn btn-lg btn-outline-primary btn-block" style="font-size:26px;" v-on:click="display('AccountSet')">
          Set Account Options
        </button>
      <button type="button" class="btn btn-lg btn-outline-primary btn-block" style="font-size:26px;" v-on:click="display('SignersListSet')" disabled>
          Set Signer List
        </button>
      <button type="button" class="btn btn-lg btn-outline-danger btn-block" style="font-size:26px;" v-on:click="display('DisableMaster')" disabled>
          Disable Master Key
        </button>
-->
  </div>
  <!-- end Choose Tx Type -->

  <!--PAYMENTS-->
  <div v-if="proceed && txType =='Payment'" class="container" style="height:100%;width:100%;">
    <CreateTxs :walletAddress="walletAddress" :secret="seed" > </CreateTxs>
  </div>

  <!--SET REGULAR KEYS -->
  <div v-if="proceed && txType =='SetRegularKey'" class="container" style="height:100%;width:100%;">
    <SetRegularKey :walletAddress="walletAddress" :secret="seed" > </SetRegularKey>
  </div>

  <!--SET TRUST -->
  <div v-if="proceed && txType =='TrustSet'" class="container" style="height:100%;width:100%;">
    <TrustSet :walletAddress="walletAddress" :secret="seed" > </TrustSet>
  </div>
  
  <!--Account Set -->
  <div v-if="proceed && txType =='AccountSet'" class="container" style="height:100%;width:100%;">
    <AccountSet :walletAddress="walletAddress" :secret="seed" > </AccountSet>
  </div>

  <div class="" style="position: fixed; bottom: 20px; right: 20px;">  
    <button @click="resetKeypair()" class="btn btn-outline-primary" type="button"><i class="fas fa-trash-alt fa-2x" style="color:white;"></i></button>
      <div>Clear Wallet</div>
    </div>
  <!--div class="walletAcct">  
    <h5> Initiating Account: <span class="buttercup"> {{ walletAddress }} </span> </h5>
    </div -->
  </div>
</template>

<script>
import keypairs from "ripple-keypairs";
import { QrcodeReader } from 'vue-qrcode-reader';
import CreateTxs from './CreateTxs';
import SetRegularKey from './setRegularKey';
import TrustSet from './TrustSet';
import AccountSet from './AccountSet';
import { EventBus } from "./eventbus.js";

export default {
  name: 'HelloWorld',
  components: {
    QrcodeReader,
    CreateTxs,
    SetRegularKey,
    TrustSet,
    AccountSet,
  },
  data () {
    return {
      seed:null,
      walletAddress:null,
      keypair:null,
      keypairs:null,
      qrModeSeed:false,
      proceed:false,
      UseRegularKey: null,
      initiatingAcct:null,
      initAcctValid:false,
      qrModeRegKeyAcct:false,
      initiatingSet:false,
      regularKeySecret:null,
      regularKeyAddress:null,
      qrModeRegKeySecret:false,
      txType:null,


    }
  },
  methods: {

    display: function(txType) {
      this.txType = txType;
    },

    RegKeyTag: function(regKey) {
      this.UseRegularKey = regKey
    },

    getKeypair() {
      this.seed = this.seed.trim()
     
      try {
      this.keypair = keypairs.deriveKeypair(this.seed);
      this.walletAddress = keypairs.deriveAddress(this.keypair.publicKey)
        }
      catch(err){
        alert('Secret entered is invalid, please review your input. Secret should begin with a lowercase "s"')
      }
    },
    getKeypairRegularKeySecret() {
      this.regularKeySecret = this.regularKeySecret.trim()
     
      try {
      this.keypair = keypairs.deriveKeypair(this.regularKeySecret);
      this.regularKeyAddress = keypairs.deriveAddress(this.keypair.publicKey)
        }
      catch(err){
        this.regularKeyAddress =null;
        alert('Secret entered is invalid, please review your input. Secret should begin with a lowercase "s"')
      }
    },  

    resetKeypair (){
      this.keypair = null;
      this.walletAddress = null;
      this.seed = null;
      this.proceed = false;
      this.qrModeSeed = false;
      this.UseRegularKey = null;
      this.txType = null;
      this.initiatingSet = false;
      this.initAcctValid = false;
      this.initiatingAcct = null;
      this.regularKeyAddress = null;
      this.regularKeySecret = null;
    },
    onQrDecode: function (decodedString) {
      this.seed = decodedString;
      this.qrModeSeed = false;
      this.getKeypair();
    },
    cancelSeedQr(){
      this.qrModeSeed = false;
    },
    onQrDecodeInitAcct: function (decodedString) {
      this.initiatingAcct = decodedString;
      this.qrModeRegKeyAcct = false;
      this.initAcctCheck();
    },
    cancelInitAcctQr(){
      this.qrModeRegKeyAcct = false;
    },
    onQrDecodeRegKeySecret: function (decodedString) {
      this.regularKeySecret = decodedString;
      this.qrModeRegKeySecret = false;
      this.getKeypairRegularKeySecret();
    },
    cancelRegKeySecretQr(){
      this.qrModeRegKeySecret = false;
    },
    initAcctCheck() {
        this.initiatingAcct = this.initiatingAcct.trim();
      var string = this.initiatingAcct
      if (string.match(/^r[a-k+m-z+A-H+J-N+P-Z0-9]{25,}/) && string.length >= 25 && string.length <= 35) {
        this.initAcctValid = true
      }
      else(this.initAcctValid = false)
    },

  },
}
</script>


<style scoped>
input{
   text-align:center;
   background: black;
   /*background: #343a40;*/
   color:lightskyblue;
    font-size: 22px;
}
input::-webkit-input-placeholder {
color: white !important;
}

input:-moz-placeholder { /* Firefox 18- */
color: white !important;  
}

input::-moz-placeholder {  /* Firefox 19+ */
color: white !important;  
}

input:-ms-input-placeholder {  
color: white !important;  
}
.no-border {
    border-top:0;
    border-left:0;
    border-right:0;
    box-shadow: none;
}

input:focus {
  background-color: black;
  /*background-color: #343a40;*/
  color:  lightskyblue
}
</style>
