// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define los orígenes permitidos
const allowedOrigins = [
  'http://localhost:5173',
  'https://shop.compucosta.com/' // Reemplaza X con tu IP local
]

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const origin = request.headers.get('origin')

  // Verifica si el origen está permitido
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.append('Access-Control-Allow-Credentials', 'true')
    response.headers.append('Access-Control-Allow-Origin', origin)
    response.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
    response.headers.append(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
  }

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: response.headers,
    })
  }

  return response
}

export const config = {
  matcher: '/api/:path*',
}