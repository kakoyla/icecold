<template>
  <div class="bg-black text-light container-fluid">
    <!--Get Initiating info -->
    <div v-if="!proceed">
       
     
      <!--Ask Standard Key Pair or Regular Key -->
      <div class="container" v-if="UseRegularKey ==null"> 
      <img src="../../static/img/xrp-symbol-white.svg" width="100" height="100" style="margin-bottom:10px">
      <h4>Choose your signing method:</h4>
        <button type="button" class="btn btn-lg btn-outline-success btn-block" style="font-size:26px;" v-on:click="RegKeyTag('NO')">
          Standard Key Pair
        </button>
      <button type="button" class="btn btn-lg btn-outline-primary btn-block" style="font-size:26px;" v-on:click="RegKeyTag('YES')">
          Regular Key
        </button>
      <button type="button" class="btn btn-lg btn-outline-warning btn-block" style="font-size:26px;" v-on:click="RegKeyTag('MULTI'), multiSignSetup=true">
          Multi-Sign
        </button>
      <button type="button" class="btn btn-lg btn-outline-danger btn-block" style="font-size:26px;" v-on:click="RegKeyTag('ADDSIG')">
          Add Signature
      </button>
        <h5 style="margin:20px;color:lightskyblue">
            If you do not know choose <span class="text-success">Standard Key Pair</span>.
        </h5> 
        <h5 style="margin:20px;color:lightskyblue">
            A <span class="text-primary">Regular Key</span> lets you sign with a secret from a different account, 
            but must be setup first. 
        </h5>
        <h5 style="margin:20px;color:lightskyblue">
            If you plan on Multi-Signing choose <span class="text-warning"> Multi-Sign </span> to setup the transaction.
        </h5>
        <h5 style="margin:20px;color:lightskyblue">
            Choose <span class="text-danger">Add Signature</span> if you are adding an additional signature to an already created <span class="text-warning">Multi-Sign</span> transaction.
        </h5>
      </div>
      <!--END Ask Standard Key Pair or Regular Key -->

    <!--Enter Regular Key Pair -->
    <div class="container" v-if=" UseRegularKey == 'YES' ">
    <div v-if="!qrModeRegKeyAcct && !qrModeRegKeySecret">
    <div class="container" style="height:100%;width:100%;">
     
     <!--Enter Initiating Account -->
    <div v-if="!initiatingSet">
    <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="resetKeypair()" >Back</button> 
    </div>
    <img src="../../static/img/xrp-symbol-white.svg" width="100" height="100" style="margin-bottom:10px">      
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
      <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="initiatingSet = false" >Back</button> 
      </div>
      <img src="../../static/img/xrp-symbol-white.svg" width="100" height="100" style="margin-bottom:10px">
      <h4>Enter Regular Key (signing account) Secret:</h4>
      <div class="col-boom">
        <input class="effect-2 no-border" :type="secretType" placeholder="s............................."  v-model="regularKeySecret" @blur="getKeypairRegularKeySecret()">
        <span class="focus-border"></span>
      </div>
  
      <div v-if="!regularKeySecret" style="margin-top:50px; margin-bottom:50px;">  
      <div style="margin-bottom:40px">or</div>
        <button @click="qrModeRegKeySecret=true" class="btn btn-outline-primary" type="button">
          <i class="fa fa-qrcode fa-5x" style="color:white;"></i>
        </button>
      <div style="font-size:20px;">Scan QR Code</div>
    </div>
    <div v-if="regularKeyAddress" class="container" style="margin-top:5%">
      <div class="buttercup" style="font-size:40px;"><u>Initiating Account:</u> </div>
      <div class="lightskyblue" style="font-size:40px;"> {{walletAddress}} </div> 
      <div class="buttercup" style="font-size:40px;"><u>Key (signing) Account:</u> </div>
      <div class="lightskyblue" style="font-size:40px;"> {{regularKeyAddress}} </div>

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
      <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="resetKeypair()" >Back</button> 
    </div>
    <img src="../../static/img/xrp-symbol-white.svg" width="100" height="100" style="margin-bottom:10px">
     
         
    
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

    <!--Create Multi-Sig Transaction -->
    <div v-if=" UseRegularKey == 'MULTI'">
    <div v-if="!qrModeRegKeyAcct" class="container" style="height:100%;width:100%;">
     
     <!--Enter Initiating Account -->
     <div style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="resetKeypair()" >Back</button> 
    </div>
    <img src="../../static/img/xrp-symbol-white.svg" width="100" height="100" style="margin-bottom:10px">

    
    <h4>Enter the Multi-Sig Account which will be initiating the Transaction</h4>
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
      
      <h5 style="margin:20px">
            How Many Signers will be Signing this Transaction prior to Submission?
    </h5>
    <div class="col-boom">
        	<input type="number" min=1 max=8 step=1 class="rounded" style="border-color: #FBCD4B; width:40%; border-width:5px  " placeholder="number of signers" v-model="signerCount" @keyup="checkSignerCount()">
            
        </div>
        <h5 style="margin:20px;color:lightskyblue">
           The fee you set later on will be multiplied by the number of signers +1.  
        </h5>

      <div v-if="initiatingAcct && signerCount" style="margin-top:50px; margin-bottom:50px;">  
        <button @click="walletAddress=initiatingAcct, proceed = true" class="btn btn-outline-primary btn-lg" style="color:white" type="button">NEXT</button>
      </div>
    </div>    
    </div>
     <!--End Enter Initiating Account -->
     <div v-if= "qrModeRegKeyAcct">
      <qrcodeReader @decode="onQrDecodeInitAcct"> </qrcodeReader>
      <button type="button" class="btn btn-outline-primary" style="color:white; margin-top:10px" v-on:click ="cancelInitAcctQr()">
            Cancel
      </button>
    </div>
    </div> <!--end Create Multi-Sig Transaction -->

    <!--Enter Additional Signature Key Pair -->
    <div v-if=" UseRegularKey == 'ADDSIG' ">
    <div v-if="!qrModeSigningSeed">
    <div class="container" style="height:100%;width:100%;">
    <div v-if="!tx" style="text-align:left; margin-bottom:40px"> <!--back button -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="resetKeypair()" >Back</button> 
    </div>
    <img src="../../static/img/xrp-symbol-white.svg" width="100" height="100" style="margin-bottom:10px">
     
         
    <h4> Enter the Secret for the Account you want to sign the Multi-Sig transaction with </h4>
    <div class="col-boom">
        	<input class="effect-2 no-border" type="text" placeholder="Enter Secret"  v-model="signingSeed" @blur="getSigningKeypair()">
            <span class="focus-border"></span>
            </div>
        </div>
    <div v-if="signingAddress" class="container">
      <div class="text-light" style="font-size:20px;">signing wallet address: </div>
    <div class="buttercup" style="font-size:36px;"> {{signingAddress}} </div> 
     <div v-if="signingAddress" style="margin-top:50px; margin-bottom:50px;">  
    <button @click="proceed=true, txType ='Add Signature'" class="btn btn-outline-primary btn-lg" style="color:white" type="button">NEXT</button>
    </div>
    </div>
    <div v-if="signingAddress == null" style="margin-top:50px; margin-bottom:50px;">  
      <div style="margin-bottom:40px">or</div>
    <button @click="qrModeSigningSeed=true" class="btn btn-outline-primary" type="button"><i class="fa fa-qrcode fa-5x" style="color:white;"></i></button>
      <div style="font-size:20px;">Scan QR Code</div>
    </div>
    
    </div>
    <div v-if= "qrModeSigningSeed">
      <qrcodeReader @decode="onQrSigningDecode"> </qrcodeReader>
      <button type="button" class="btn btn-outline-primary" style="color:white; margin-top:10px" v-on:click ="cancelSigningSeedQr()">
            Cancel
      </button>
    </div>
    </div> 
    <!--END Enter Additional Signature Key Pair -->

    </div> <!--end get initiating info -->
    <!-- Chose Tx Type -->
  <div v-if="proceed && !txType" class='container'> 
      <div v-if="initiatingSet" style="text-align:left; margin-bottom:20px"> <!--back button to regkey selection -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="proceed = false" >Back</button> 
      </div>
      <div v-if="!initiatingSet && !signerCount" style="text-align:left; margin-bottom:20px"> <!--back button to standard key selection -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="proceed = false" >Back</button> 
      </div>
      <div v-if="signerCount" style="text-align:left; margin-bottom:20px"> <!--back button to standard key selection -->
            <button type="button" class="btn btn-outline-primary btn-lg" style="margin-top:5px;color:white" @click="proceed = false" >Back</button> 
      </div>





      <h4> Which type of transaction would you like to create? </h4>
      <button type="button" class="btn btn-lg btn-outline-success btn-block" style="font-size:26px;" v-on:click="display('Payment')">
          <i class="fas fa-money-bill-alt"></i> Payment
        </button>
        <button type="button" class="btn btn-lg btn-outline-success btn-block" style="font-size:26px;" v-on:click="display('CreateEscrow')">
         <i class="fas fa-lock"></i> Create Escrow
        </button>
        <button type="button" class="btn btn-lg btn-outline-success btn-block" style="font-size:26px;" v-on:click="display('FinishEscrow')">
         <i class="fas fa-unlock"></i> Finish Escrow
        </button>
        <button type="button" class="btn btn-lg btn-outline-primary btn-block" style="font-size:26px;" v-on:click="display('TrustSet')">
          <i class="fas fa-handshake"></i> Set Trust
        </button>
        <button type="button" class="btn btn-lg btn-outline-primary btn-block" style="font-size:26px;" v-on:click="display('AccountSet')">
          <i class="fas fa-list-alt"></i> Set Account Options
        </button>
        <button type="button" class="btn btn-lg btn-outline-warning btn-block" style="font-size:26px;" v-on:click="display('SetRegularKey')">
         <i class="fas fa-key"></i> Set Regular Key
        </button>
        <button type="button" class="btn btn-lg btn-outline-warning btn-block" style="font-size:26px;" v-on:click="display('SetSignerList')">
          <i class="fas fa-list-ol"></i> Set Signer List
        </button>
        <button type="button" class="btn btn-lg btn-outline-warning btn-block" style="font-size:26px;" v-on:click="display('DepositPreauth')">
         <i class="fas fa-clipboard-check"></i> Authorize Deposit Accounts
        </button>
        <button type="button" class="btn btn-lg btn-outline-danger btn-block" style="font-size:26px;" v-on:click="display('DisableMaster')">
           <i class="fas fa-skull"></i> <i class="fas fa-star fa-xs"></i> Disable Master Key <i class="fas fa-star fa-xs"></i> <i class="fas fa-skull"></i> 
        </button>
             

         <!--
      <button type="button" class="btn btn-lg btn-outline-danger btn-block" style="font-size:26px;" v-on:click="display('DisableMaster')" disabled>
          <i class="fas fa-exclamation-triangle"></i>  Disable Master Key
        </button>
  -->      

  </div>
  <!-- end Choose Tx Type -->

  <!--PAYMENTS-->
  <div v-if="proceed && txType =='Payment'" class="container" style="height:100%;width:100%;">
    <CreateTxs :walletAddress="walletAddress" :secret="seed" :signerCount="signerCount" :multiSignSetup="multiSignSetup" > </CreateTxs>
  </div>

  <!--SET REGULAR KEYS -->
  <div v-if="proceed && txType =='SetRegularKey'" class="container" style="height:100%;width:100%;">
    <SetRegularKey :walletAddress="walletAddress" :secret="seed" :signerCount="signerCount" :multiSignSetup="multiSignSetup"> </SetRegularKey>
  </div>

  <!--SET TRUST -->
  <div v-if="proceed && txType =='TrustSet'" class="container" style="height:100%;width:100%;">
    <TrustSet :walletAddress="walletAddress" :secret="seed" :signerCount="signerCount" :multiSignSetup="multiSignSetup"> </TrustSet>
  </div>
  
  <!--Account Set -->
  <div v-if="proceed && txType =='AccountSet'" class="container" style="height:100%;width:100%;">
    <AccountSet :walletAddress="walletAddress" :secret="seed" :signerCount="signerCount" :multiSignSetup="multiSignSetup"> </AccountSet>
  </div>

  <!--Deposit PreAuthorize -->
  <div v-if="proceed && txType =='DepositPreauth'" class="container" style="height:100%;width:100%;">
    <DepPreAuth :walletAddress="walletAddress" :secret="seed" :signerCount="signerCount" :multiSignSetup="multiSignSetup"> </DepPreAuth>
  </div>

  <!--Finish Escrow -->
  <div v-if="proceed && txType =='FinishEscrow'" class="container" style="height:100%;width:100%;">
    <FinishEscrow :walletAddress="walletAddress" :secret="seed" :signerCount="signerCount" :multiSignSetup="multiSignSetup"> </FinishEscrow>
  </div>

  <!--Create Escrow -->
  <div v-if="proceed && txType =='CreateEscrow'" class="container" style="height:100%;width:100%;">
    <CreateEscrow :walletAddress="walletAddress" :secret="seed" :signerCount="signerCount" :multiSignSetup="multiSignSetup"> </CreateEscrow>
  </div>

  <!--Set Signer List -->
  <div v-if="proceed && txType =='SetSignerList'" class="container" style="height:100%;width:100%;">
    <SetSignerList :walletAddress="walletAddress" :secret="seed" :signerCount="signerCount" :multiSignSetup="multiSignSetup"> </SetSignerList>
  </div>

  <!--Add Signature -->
  <div v-if="proceed && txType =='Add Signature'" class="container" style="height:100%;width:100%;">
    <AddSignature :signingAddress="signingAddress" :signingSecret="signingSeed" :tx="tx"> </AddSignature>
  </div>

  <!--Disable Master -->
  <div v-if="proceed && txType =='DisableMaster'" class="container" style="height:100%;width:100%;">
    <DisableMaster :walletAddress="walletAddress" :secret="seed" :signerCount="signerCount" :multiSignSetup="multiSignSetup"> </DisableMaster>
  </div>

  <div class="" style="position: fixed; bottom: 20px; right: 20px;">  
    <button @click="resetKeypair()" class="btn btn-outline-primary" type="button"><i class="fas fa-trash-alt fa-2x" style="color:white;"></i></button>
      <div>Clear Wallet</div>
    </div>
  
  </div>
</template>

<script>
import keypairs from "ripple-keypairs";
import { QrcodeReader } from 'vue-qrcode-reader';
import CreateTxs from './CreateTxs';
import SetRegularKey from './setRegularKey';
import TrustSet from './TrustSet';
import AccountSet from './AccountSet';
import DepPreAuth from './DepPreAuth';
import SetSignerList from './SetSignerList';
import AddSignature from './AddSignature';
import CreateEscrow from './CreateEscrow';
import FinishEscrow from './FinishEscrow';
import DisableMaster from './DisableMaster';
import { EventBus } from "./eventbus.js";

export default {
  name: 'HelloWorld',
  components: {
    QrcodeReader,
    CreateTxs,
    SetRegularKey,
    TrustSet,
    AccountSet,
    DepPreAuth,
    SetSignerList,
    AddSignature,
    FinishEscrow,
    CreateEscrow,
    DisableMaster
  },

  mounted() {
    EventBus.$on('addSigTx', tx => {
      this.addSig(tx)
    })
  },

  data () {
    return {
      seed:null,
      walletAddress:null,
      keypair:null,
      keypairs:null,
      qrModeSeed:false,

      signingSeed:null,
      signingAddress:null,
      qrModeSigningSeed:null,
      signingKeypair:null,

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
      multiSignSetup:false,
      signerCount:null,
      tx:null,
      secretType:null,

      


    }
  },
  methods: {

    addSig(tx){
      this.tx = tx;
      this.proceed = false;
      this.txType = null;
      this.UseRegularKey = 'ADDSIG';

    },

    display: function(txType) {
      this.txType = txType;
    },

    checkSignerCount() {
      if(this.signerCount>8){
        this.signerCount = 8
      }
      else if(this.signerCount <1){
        this.signerCount = null
      }
    },

    RegKeyTag: function(regKey) {
      this.UseRegularKey = regKey
    },

    getKeypair() {
      if(this.seed){
      this.seed = this.seed.trim()
     
      try {
      this.keypair = keypairs.deriveKeypair(this.seed);
      this.walletAddress = keypairs.deriveAddress(this.keypair.publicKey)
        }
      catch(err){
        alert('Secret entered is invalid, please review your input. Secret should begin with a lowercase "s"')
      }
      }
    },

    getSigningKeypair() {
      if(this.signingSeed){
      this.signingSeed = this.signingSeed.trim()
     
      try {
      this.signingKeypair = keypairs.deriveKeypair(this.signingSeed);
      this.signingAddress = keypairs.deriveAddress(this.signingKeypair.publicKey)
        }
      catch(err){
        alert('Secret entered is invalid, please review your input. Secret should begin with a lowercase "s"')
      }
      }
    },

    getKeypairRegularKeySecret() {
      if(this.regularKeySecret){
      this.regularKeySecret = this.regularKeySecret.trim()
     
      try {
      this.keypair = keypairs.deriveKeypair(this.regularKeySecret);
      this.regularKeyAddress = keypairs.deriveAddress(this.keypair.publicKey)
      this.secretType = "password";
        }
      catch(err){
        this.regularKeyAddress =null;
        this.secretType="text";
        alert('Secret entered is invalid, please review your input. Secret should begin with a lowercase "s"')
      }
      }
      else{this.regularKeyAddress=null;
      this.secretType="text";
      }
    },  

    resetKeypair (){

      this.seed = null
      this.walletAddress=null
      this.keypair=null
      this.keypairs=null
      this.qrModeSeed=false
      this.proceed=false
      this.UseRegularKey= null
      this.initiatingAcct=null
      this.initAcctValid=false
      this.qrModeRegKeyAcct=false
      this.initiatingSet=false
      this.regularKeySecret=null
      this.regularKeyAddress=null
      this.qrModeRegKeySecret=false
      this.txType=null
      this.multiSignSetup=false
      this.signerCount=null
      this.signingSeed=null
      this.signingAddress=null
      this.qrModeSigningSeed=null
      this.signingKeypair=null
      this.tx=null
      
    },
    onQrDecode: function (decodedString) {
      this.seed = decodedString;
      this.qrModeSeed = false;
      this.getKeypair();
    },
    cancelSeedQr(){
      this.qrModeSeed = false;
    },
    onQrSigningDecode: function (decodedString) {
      this.signingSeed = decodedString;
      this.qrModeSigningSeed = false;
      this.getSigningKeypair();
    },
    cancelSigningSeedQr(){
      this.qrModeSigningSeed = false;
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
      if(this.initiatingAcct){
        this.initiatingAcct = this.initiatingAcct.trim();
      var string = this.initiatingAcct
      if (string.match(/^r[a-k+m-z+A-H+J-N+P-Z0-9]{25,}/) && string.length >= 25 && string.length <= 35) {
        this.initAcctValid = true
      }
      else {this.initAcctValid = false}
      }
      else {this.initAcctValid = false}
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
