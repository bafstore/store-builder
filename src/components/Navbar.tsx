import { Box, Flex, Button, useColorModeValue, Stack } from '@chakra-ui/react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { DASHBOARD_LOGIN_PATH } from '@/constants/auth'
import Link from 'next/link'

export default function Navbar() {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      document.cookie =
        'sb-qviqbtgkunhmasnzbmoh-auth-token-code-verifier=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      if (error) {
        console.error('Error logging out:', error)
      }
      router.push(DASHBOARD_LOGIN_PATH)
    } catch (error) {
      console.log(error, 'error')
    }
  }

  return (
    <Box
      bg={useColorModeValue('gray.100', 'gray.900')}
      px={4}
      dropShadow="initial"
    >
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box>
          <Link href="/dashboard">Admin Dashboard</Link>
        </Box>

        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={7}>
            <Button onClick={handleLogout}>Logout</Button>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  )
}
