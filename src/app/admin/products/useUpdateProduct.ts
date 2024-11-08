import { useState } from 'react'

import { CreateToastFnReturn, useDisclosure } from '@chakra-ui/react'
import axios from 'axios'

import {
  IEditProductRequest,
  IProduct
} from '@/interfaces/product'


export function useUpdateProduct(
  toast: CreateToastFnReturn,
  fetchProducts: () => void
) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initForm = {
    id: '',
    name: '',
    price: 0,
    priceBase: 0,
    stock: 0,
    storeId: '',
    categoryIds: [],
    description: '',
    imageUrl: ''
  } as IEditProductRequest

  const [currentEditForm, setCurrentEditForm] = useState(initForm)

  const handleUpdateProduct = (request: IEditProductRequest) => async () => {
    try {
      const form = new FormData()
      form.append('name', request.name)
      form.append('price', request.price.toString())
      if(request.stock){
        form.append('stock', request.stock.toString())
      }
      form.append('storeId', request.storeId)
      form.append('categoryIds', JSON.stringify(request.categoryIds))
      form.append('description', request.description)
      if(request?.image){
        form.append('image', request?.image)
      }

      await axios.patch(`/api/products/${currentEditForm.id}`, form)
      fetchProducts()
      onClose()
    } catch (error) {
      let description
      if (
        (error as any).response.data.error.includes('resource already exist')
      ) {
        description = 'Image name is already exist. Please use another image.'
      } else {
        description = (error as Error).message
      }
      toast({
        title: 'Error',
        description,
        status: 'error',
        duration: 2500,
        isClosable: true
      })
    }
  }

  const handleEdit = (product: IProduct) => {
    const request: IEditProductRequest = {
      id: product.id,
      name: product.name,
      stock: product.stock,
      priceBase: product.priceBase,
      price: product.price,
      storeId: product.store.id,
      categoryIds: product.categories.map((category) => category.id),
      description: product.description,
      imageUrl: product.imageUrl
    }

    setCurrentEditForm(request)
    onOpen()
  }

  const handleEditClose = () => {
    setCurrentEditForm(initForm)
    onClose()
  }

  return {
    isOpen,
    onOpen: handleEdit,
    onClose: handleEditClose,
    handleUpdateProduct,
    currentEditForm
  }
}
