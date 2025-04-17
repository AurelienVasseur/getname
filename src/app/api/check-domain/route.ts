import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get('domain')
  const zone = searchParams.get('zone')

  if (!domain || !zone) {
    return NextResponse.json(
      { error: 'Domain and zone parameters are required' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `https://api.domainsdb.info/v1/domains/search?domain=${domain}&zone=${zone}`
    )
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error checking domain:', error)
    return NextResponse.json(
      { error: 'Failed to check domain availability' },
      { status: 500 }
    )
  }
} 