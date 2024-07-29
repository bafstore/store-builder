import {
  ICategoryInput,
  ICreateProductInput,
  ICreateProductRequest
} from '@/interfaces/product'
import { IStore } from '@/interfaces/store'
import {
  Button,
  FormControl,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Textarea,
  useToast
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { Select as MultiSelect, MultiValue } from 'chakra-react-select'

import { useGetCateogries } from '@/app/dashboard/categories/useGetCategory'
import { useGetStore } from '@/app/dashboard/stores/useGetStore'
import { ICategory } from '@/interfaces/category'

export default function ProductFormModal(props: Props) {
  const { onSubmit, data, editMode } = props
  const toast = useToast()

  const { categories, fetchCategories } = useGetCateogries(toast)
  const { stores, fetchStores } = useGetStore(toast)

  const [input, setInput] = useState({
    name: '',
    price: '',
    stock: 0,
    storeId: '',
    categories: [],
    description: '',
    image: null
  } as ICreateProductInput)

  const unFormatPrice = (price: string) => {
    return parseInt(price.replace(/Rp|\./g, '').replace(',', '.'))
  }

  const request = {
    ...input,
    price: unFormatPrice(input.price),
    categoryIds: input.categories.map((category) => category.value)
  } as ICreateProductRequest

  useEffect(() => {
    setInput({
      name: data?.name || '',
      storeId: data?.storeId || '',
      price: data?.price || '',
      stock: data?.stock || 0,
      categories: data?.categories || [],
      description: data?.description || '',
      image: data?.image || null
    })
  }, [data?.name])

  const handleChange = (e: React.ChangeEvent<InputElement>): void => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
      categories: e.target.name === 'storeId' ? [] : input.categories
    })
  }

  const handleCategoriesChange = (value: MultiValue<ICategoryInput>) => {
    setInput({
      ...input,
      categories: value as ICategoryInput[]
    })
  }

  const handleStockChange = (value: string) => {
    const quantity = parseInt(value) || 0
    if (quantity < 0) return
    setInput({
      ...input,
      stock: quantity
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setInput({
      ...input,
      image: file
    })
  }

  const categoryOptions = categories
    .filter((category) => category.storeId === input.storeId)
    .map((category) => ({ label: category.name, value: category.id }))

  console.log({ stores })
  return (
    <>
      <FormControl marginBottom={2}>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Product Name"
          value={input.name}
          onChange={handleChange}
          name="name"
        />
      </FormControl>
      <FormControl marginBottom={2}>
        <FormLabel>Price</FormLabel>
        <Input
          as={NumericFormat}
          prefix="Rp."
          value={input.price}
          thousandSeparator="."
          decimalSeparator=","
          onChange={handleChange}
          name="price"
          placeholder="Product Price"
        />
      </FormControl>
      <FormControl marginBottom={2}>
        <FormLabel>Stock</FormLabel>
        <NumberInput value={input.stock} onChange={handleStockChange}>
          <NumberInputField placeholder="Product Stock" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <FormControl marginBottom={2}>
        <FormLabel>Store</FormLabel>
        <Select
          placeholder="Select Store"
          value={input.storeId}
          onChange={handleChange}
          name="storeId"
        >
          {!!stores.length &&
            stores.map((store) => {
              return (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              )
            })}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Categories</FormLabel>
        <MultiSelect
          isMulti
          placeholder="Select Categories"
          onChange={handleCategoriesChange}
          value={input.categories}
          options={categoryOptions}
          isDisabled={!input.storeId}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea
          placeholder="Product Description"
          value={input.description}
          onChange={handleChange}
          name="description"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Image</FormLabel>
        {editMode && data?.imageUrl && (
          <Image src={data.imageUrl} alt="product image" width={150} />
        )}
        <Input
          id="input-file"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </FormControl>
    </>
  )
}

export interface Props {
  onSubmit: (request: ICreateProductRequest) => () => void
  data?: ICreateProductInput
  title: string
  editMode?: boolean
}

type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
