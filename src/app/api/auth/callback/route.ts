import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { type CookieOptions, createServerClient } from '@supabase/ssr'
import axios from 'axios'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const { searchParams, origin } = url
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options })
          }
        }
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    const { data } = await supabase.auth.getSession()
    const createUserRequest = {
      name: data.session?.user?.user_metadata?.full_name,
      email: data.session?.user?.email,
      role: 'admin',
      phoneNumber: data.session?.user?.user_metadata?.phone_number,
      lastSignInAt: data.session?.user?.last_sign_in_at
    }

    try {
      await axios.post(`${origin}/api/users`, createUserRequest)
    } finally {
      if (!error) {
        return NextResponse.redirect(`${origin}/dashboard`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/error`)
}
