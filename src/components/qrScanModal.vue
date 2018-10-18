<template> 
<transition name="modal">
 <div class="modal modal-mask" style="display:block">
  <div class="modal-lg modal-dialog" role="document">
    <div class="modal-content bg-black border border-secondary rounded">
     
      
      <div class="modal-body" >
        <slot name="body"></slot>
      </div>
      
      <div class="modal-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</div>
</transition> 
</template>
<script>

export default {
  name: "qrScanModal",
  


  data() {
    return {}
  },
  
  
}
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-body {
    overflow-y: auto;
    
}
.modal-lg {
   
    
}
.nbgrad {
  background: rgb(21, 98, 171);
  background: linear-gradient(
    185deg,
    rgba(21, 98, 171, 1) 0%,
    rgba(4, 28, 84, 1) 100%
  );
}



</style>
//
https://stackoverflow.com/questions/46791340/multiple-modal-components-with-vue

The issue you are having is that all modals are bound to one data attribute (showModal) so all modals will show when you set this to true. 
The solution is to isolate each button within it's own component which has it's own showModal attribute rather than emitting it to the
parent:

Vue.component('btn',{
  template: `<div><button @click="showModal = true"><slot></slot></button>   
    <modal v-if="showModal">I am a modal for {{button}}</modal></div>`,
  props: ['button'],
  data(){
    return {
      showModal: false
    }
  }
});
 

And here's the updated JSBin

If you need different modals for each button type, then simply create two button components edit-button, delete-button etc