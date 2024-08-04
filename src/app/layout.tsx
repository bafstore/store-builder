import React from 'react'

import { Inter } from 'next/font/google'

import { Navbar } from '@/components/homepage'

import './globals.css'
import { Providers } from './providers'

import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BAF Kitchen',
  description: 'Belanja lebih murah dan lebih berkah'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
