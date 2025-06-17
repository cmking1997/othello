import React, { useState } from 'react';
import { Button, Modal } from 'antd';

export function ButtonWithModal({
  buttonText,
  modalTitle,
  modalContent,
}: Readonly<{
  buttonText: string;
  modalTitle: string;
  modalContent: React.ReactNode;
}>) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal} className="menuButton">
        {buttonText}
      </Button>
      <Modal
        title={modalTitle}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onCancel={handleClose}
        footer={[
          <Button key="close" onClick={handleClose}>
            Close
          </Button>,
        ]}
      >
        {modalContent}
      </Modal>
    </>
  );
}
