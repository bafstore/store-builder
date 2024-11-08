/* eslint-disable no-unused-vars */
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import { ADMIN_LOGIN_PATH } from '@/constants/auth'

const initSupabase = (request: NextRequest, response: NextResponse) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options
          })
          response = NextResponse.next({
            request: {
              headers: request.headers
            }
          })
          response.cookies.set({
            name,
            value,
            ...options
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options
          })
          response = NextResponse.next({
            request: {
              headers: request.headers
            }
          })
          response.cookies.set({
            name,
            value: '',
            ...options
          })
        }
      }
    }
  )
}

export async function middleware(request: NextRequest) {
  return NextResponse.next({
    request: {
      headers: request.headers
    }
  })

  // const supabase = initSupabase(request, response)

  // const path = new URL(request.url).pathname

  // // refresh the session
  // const { data } = await supabase.auth.getSession()

  // // protected route
  // if (!data.session && path !== ADMIN_LOGIN_PATH) {
  //   response = NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url))
  // }

  // if (data.session && path === ADMIN_LOGIN_PATH) {
  //   response = NextResponse.redirect(new URL('/admin', request.url))
  // }

  // return response
}

export const config = {
  matcher: '/admin/:path*'
}
