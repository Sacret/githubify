'use strict';

import React from 'react';
import Reflux from 'reflux';
//
import { Modal, Button } from 'react-bootstrap';
//
import ModalActions from '../../actions/ModalActions';
//
import ModalStore from '../../stores/ModalStore';

/**
 *  User menu displays user links
 */
const TagLimitModal = React.createClass({

  mixins: [Reflux.connect(ModalStore, 'modalStore')],

  render() {
    const showModal = this.state.modalStore;
    //
    return (
      <Modal show={showModal} onHide={ModalActions.hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Oops...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Unfortunatelly you can't add more than 50 tags</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ModalActions.hideModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

export default TagLimitModal;
