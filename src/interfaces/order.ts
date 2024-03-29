import { IProductCart } from '@/interfaces/product'

export interface IOrderRequest {
  storeName: string
  orderer: {
    name: string
    phoneNumber: string
    address: string
  }
  items: IProductCart[]
  totalPrice: number
}

export interface IProductOrder {
  id: number
  quantity: number
  product: {
    id: string
    name: string
    price: number
  }
}

export interface IOrders {
  id: string
  total: number
  createdAt: string
  updatedAt: string
  customer: {
    name: string
    phoneNumber: string
    address: string
  }
  products: IProductOrder[]
  store: {
    name: string
  }
  status: string
}

export interface IUpdateOrderStatusRequest {
  id: string
  status: string
}

export interface IUpdateOrderStatusApiRequest {
  status: string
}
