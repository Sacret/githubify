'use strict';

import Reflux from 'reflux';
//
import ModalActions from '../actions/ModalActions';

/**
 *  ModalStore processes user info
 */
const ModalStore = Reflux.createStore({
  listenables: [ModalActions],
  showModal: false,

  showModal() {
    this.showModal = true;
    this.trigger(this.showModal);
  },

  hideModal() {
    this.showModal = false;
    this.trigger(this.showModal);
  }

});

export default ModalStore;
