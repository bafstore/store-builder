import { useState } from 'react'

import { CreateToastFnReturn, useDisclosure } from '@chakra-ui/react'
import axios from 'axios'

export function useDeleteStore(
  toast: CreateToastFnReturn,
  fetchStores: () => void,
) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [targetDeleteStoreId, setTargetDeleteStoreId] = useState('' as string)

  const handleOpenDeleteModal = (id: string) => {
    setTargetDeleteStoreId(id)
    onOpen()
  }

  const handleDeleteClose = () => {
    setTargetDeleteStoreId('')
    onClose()
  }

  const submitDeleteStore = (id: string) => async () => {
    try {
      await axios.delete(`/api/stores/${id}`)
      fetchStores()
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        status: 'error',
        duration: 2500,
        isClosable: true
      })
    }
    handleDeleteClose()
  }

  return {
    isOpen,
    onOpen,
    onClose,
    handleOpenDeleteModal,
    handleDeleteClose,
    submitDeleteStore,
    targetDeleteStoreId
  }
}
