import { Suspense } from 'react'
import LoginClient from './LoginClient'

export const metadata = { title: 'Log in' }

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>}>
      <LoginClient />
    </Suspense>
  )
}
