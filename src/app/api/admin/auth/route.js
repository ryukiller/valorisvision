import { NextResponse } from 'next/server'
import { authenticateUser, createSessionToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req) {
  try {
    const { username, password } = await req.json()
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' }, 
        { status: 400 }
      )
    }
    
    if (authenticateUser(username, password)) {
      const sessionToken = createSessionToken(username)
      
      const response = NextResponse.json(
        { success: true, user: { username } },
        { status: 200 }
      )
      
      // Set HTTP-only cookie
      response.cookies.set('admin_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 // 24 hours
      })
      
      return response
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req) {
  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    { status: 200 }
  )
  
  // Clear the session cookie
  response.cookies.delete('admin_session')
  
  return response
}