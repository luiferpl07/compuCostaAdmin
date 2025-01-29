// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'



export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Agrega los headers CORS
  response.headers.append('Access-Control-Allow-Credentials', 'true')
  response.headers.append('Access-Control-Allow-Origin', 'http://localhost:5173') // Tu origen de React
  response.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
  response.headers.append(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  // Si es una solicitud OPTIONS, devolver un estado 200 sin continuar
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
