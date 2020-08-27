import React, { useContext, useState, useRef, createContext } from 'react'
import { PopUpWarning } from 'strapi-helper-plugin'

export const ConfirmModalContext = createContext()

// prefer to use class instead of hook coz of async workflow
export const ConfirmModalProvider = ({ children }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  // tricky async UI-render flow :smirk:
  const _promiseThenConfirmModal = useRef()

  const confirmModal = (title, message) => {
    const result = new Promise((resolve) => {
      _promiseThenConfirmModal.current = resolve
    })
    setShowConfirmModal(true)
    setTitle(title)
    setMessage(message)
    return result
  }

  const setConfirmModal = (isConfirmed) => {
    setShowConfirmModal(false)
    setMessage('')
    setTitle()
    _promiseThenConfirmModal.current(isConfirmed)
  }

  return (
    <ConfirmModalContext.Provider
      value={{
        confirmModal: confirmModal
      }}
    >
      {
        <PopUpWarning
          isOpen={showConfirmModal}
          content={{
            title,
            message
          }}
          onConfirm={() => setConfirmModal(true)}
          toggleModal={() => setConfirmModal(false)}
          popUpWarningType='danger'
        />
      }
      {children}
    </ConfirmModalContext.Provider>
  )
}

// make nicer API for triggering of the confirm window
export const useConfirm = () => {
  const { confirmModal } = useContext(ConfirmModalContext)
  return { confirmModal }
}
