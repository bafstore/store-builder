'use client'

import React, { useEffect, useState } from 'react'

import { useToast } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

import { getStore, createStore } from '@/app/admin/stores/actions'
import { Layout } from '@/components'
import Form from '@/components/admin/stores/Form'
import { IStore } from '@/interfaces'

export default function AddStore({ params }: Props) {
  const toast = useToast()
  const router = useRouter()
  const { mutate, isPending } = createStore({
    onSuccess() {
      toast({
        title: 'Successfully updated store',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
      router.push('/admin/stores')
    },
    onError(error) {
      toast({
        title: 'Failed to update store',
        description: (error as Error).message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  })
  const { data: store, isFetching, error } = getStore(params.id)

  const [input, setInput] = useState<IStore.ICreateStoreRequest>({
    name: '',
    email: ''
  })

  useEffect(() => {
    if (store) {
      setInput((prev) => ({
        ...prev,
        name: store.name,
        userId: store.userId || ''
      }))
    }
  }, [store])

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    })
  }

  const breadcrumbs = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Vendor', path: '/admin/stores' },
    { label: 'tambah', path: `/admin/stores/${params.id}/add` }
  ]

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      isFetching={isFetching}
      error={error as Error}
    >
      <Form
        onChange={onChange}
        onSubmit={() => mutate(input)}
        isLoading={isPending}
        store={input}
      />
    </Layout>
  )
}

type Props = { params: { id: string } }
