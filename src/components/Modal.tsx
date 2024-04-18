'use client';

import type { Dispatch, SetStateAction } from 'react';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/modal';
import { Button } from '@nextui-org/button';

export default function ShowModal({
  show,
  setShow,
  modal,
}: {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  modal: {
    title: string;
    body: JSX.Element;
    btn?: {
      text: string;
      color?:
        | 'default'
        | 'primary'
        | 'secondary'
        | 'success'
        | 'warning'
        | 'danger';
      variant?:
        | 'shadow'
        | 'light'
        | 'solid'
        | 'bordered'
        | 'flat'
        | 'faded'
        | 'ghost';
      press?: () => void;
    }[];
  };
}) {
  return (
    <Modal
      isOpen={show}
      onOpenChange={(show) => {
        setShow(show);
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              {modal.title}
            </ModalHeader>
            <ModalBody>{modal.body}</ModalBody>
            <ModalFooter>
              {modal.btn
                ? modal.btn.map((btn, i) => {
                    return (
                      <Button
                        key={i}
                        color={btn.color}
                        variant={btn.variant}
                        onPress={btn.press ? btn.press : onClose}
                      >
                        {btn.text}
                      </Button>
                    );
                  })
                : null}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
