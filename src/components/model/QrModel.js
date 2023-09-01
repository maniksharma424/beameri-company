import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { qrCode } from "../../utils/branchData/branchData";
import { errorMessage, successMessage } from "../../utils/Toast";
import { BtnSpinner } from "../../utils/BtnSpinner";

function QrModel({ open, handleClose }) {
  const [loader, setLoader] = useState(false);

  const handleDownload = () => {
    setLoader(true);
    fetch(qrCode)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "qrcode.png";
        link.click();
        URL.revokeObjectURL(url);
        setLoader(false);
        successMessage("download successfully");
      })
      .catch((error) => {
        errorMessage(error?.message);
        setLoader(false);
      });
  };

  return (
    <>
      <Modal show={open} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>QR CODE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <img src={qrCode} alt="qrcode" className="img-size" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handleDownload()}
            disabled={loader}
          >
            {loader ? <BtnSpinner /> : "Download"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default QrModel;
