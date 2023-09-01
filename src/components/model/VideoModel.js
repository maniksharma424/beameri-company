import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function VideoModel({ open, handleClose, video }) {
  return (
    <>
      <Modal show={open} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <video src={video} controls muted autoplay width={"100%"} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default VideoModel;
