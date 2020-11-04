import React from "react";
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';

function NewAlert({ closeAlert, msg }) {
  
  setTimeout(function(){ closeAlert(true) }, 4000);

  if (msg) {
      return (
        <Row key="msg" className="p-0">
          <Alert key="msg" className="mx-auto" variant="success" onClose={() => closeAlert(true)} dismissible>
            <Alert.Heading key="msg" className="font-weight-light">{msg}</Alert.Heading>
          </Alert>
        </Row>
      );
    }
    return null;
  }
  
export default NewAlert;