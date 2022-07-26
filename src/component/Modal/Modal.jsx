import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ModalBackdrop, ModalBody } from "./Modal.styled";

const modalRoot = document.querySelector('#modal')

const Modal = ({onClose, children}) => {

useEffect(() => {

    const handleKeyDown = e => {
        if (e.code === 'Escape') {
            return onClose();
        }
    }

    const handleClick = e => {
        if (e.target.nodeName !== 'IMG') {
            return onClose();
        } 
    } 

    window.addEventListener('keydown', handleKeyDown)

    window.addEventListener('click', handleClick)
})

    return createPortal(
        <ModalBackdrop>
            <ModalBody>
                {children}
            </ModalBody>
        </ModalBackdrop>, modalRoot,
    );
    
}

export default Modal;
        