import { PrismaClient } from '@prisma/client/extension'
import { NextResponse } from 'next/server'

import { prisma } from '@/app/api/config'
import { createOrderSchema } from '@/app/api/validator'
import { EOrderStatus } from '@/constants/order'
import { inngest } from '@/inngest/client'
import { IOrderRequest } from '@/interfaces/order'
import { IProductCart } from '@/interfaces/product'
import { generateOrderHtmlEmail } from '@/utils/order'

const promiseUpdateStock = (trx: PrismaClient, items: IProductCart[]) =>
  Promise.all(
    items.map(async (item) => {
      const product = await trx.product.findUnique({
        where: {
          id: item.id
        }
      })

      if (!product) {
        throw new Error('Product does not exist')
      }

      if (product.stock < item.quantity) {
        throw new Error(`Product ${product.name} out of stock`)
      }

      await trx.product.update({
        where: {
          id: item.id
        },
        data: {
          stock: item.stock - item.quantity
        }
      })
    })
  )

export async function POST(request: Request) {
  const requestJson = await request.json()
  const createOrderReq = createOrderSchema.safeParse(requestJson)
  if (!createOrderReq.success) {
    return NextResponse.json({ error: createOrderReq.error }, { status: 400 })
  }

  const { storeName, orderer, items, totalPrice }: IOrderRequest =
    createOrderReq.data
  try {
    const store = await prisma.store.findFirst({
      where: {
        name: storeName,
        isDeleted: false
      }
    })

    const order = await prisma.$transaction(
      async (trx) => {
        await promiseUpdateStock(trx, items)

        let customer = await trx.customer.findUnique({
          where: {
            phoneNumber: orderer.phoneNumber
          }
        })

        if (!customer) {
          customer = await trx.customer.create({
            data: {
              name: orderer.name,
              email: orderer.email,
              phoneNumber: orderer.phoneNumber,
              address: orderer.address
            }
          })
        }

        const order = await trx.order.create({
          data: {
            total: totalPrice,
            customer: {
              connect: {
                id: customer!.id
              }
            },
            productOrders: {
              create: items.map((item) => {
                return {
                  product: {
                    connect: {
                      id: item.id
                    }
                  },
                  quantity: item.quantity
                }
              })
            },
            status: EOrderStatus.PENDING,
            store: {
              connect: {
                id: store?.id
              }
            }
          }
        })

        // Now you can use the order object outside the transaction
        await inngest.send({
          name: 'email/send',
          data: {
            recipientEmail: orderer.email,
            subject: `Order #${order.number} berhasil dibuat - order `,
            html: generateOrderHtmlEmail({
              totalPrice,
              items,
              customer: orderer,
              orderId: order.id
            })
          }
        })

        return order
      },
      { timeout: 20000, maxWait: 18000 }
    )

    await inngest.send({
      name: 'email/send',
      data: {
        recipientEmail: orderer.email,
        subject: `Order berhasil dibuat - order #${order.number}`,
        html: generateOrderHtmlEmail({
          totalPrice,
          items,
          customer: orderer,
          orderId: order.id
        })
      }
    })

    return NextResponse.json(
      { order, message: 'Success to order' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      productOrders: {
        include: {
          product: true
        }
      },
      store: true
    },
    where: {
      store: {
        isDeleted: false
      }
    }
  })
  return NextResponse.json(orders, { status: 200 })
}
