import { NextResponse } from 'next/server'
import whois from 'whois'
import { promisify } from 'util'

const whoisLookup = promisify(whois.lookup)

interface WhoisResponse {
  domainName: string
  registrar?: string
  creationDate?: string
  expirationDate?: string
  nameServers?: string[]
  status?: string[]
}

function parseWhoisData(data: string): WhoisResponse {
  const response: WhoisResponse = {
    domainName: ''
  }

  const lines = data.split('\n')
  for (const line of lines) {
    const [key, ...values] = line.split(':').map(s => s.trim())
    const value = values.join(':').trim()

    switch (key.toLowerCase()) {
      case 'domain name':
        response.domainName = value
        break
      case 'registrar':
        response.registrar = value
        break
      case 'creation date':
      case 'created':
        response.creationDate = value
        break
      case 'registry expiry date':
      case 'expiration date':
        response.expirationDate = value
        break
      case 'name server':
        if (!response.nameServers) response.nameServers = []
        response.nameServers.push(value)
        break
      case 'status':
        if (!response.status) response.status = []
        response.status.push(value)
        break
    }
  }

  return response
}

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

  const fullDomain = `${domain}.${zone}`

  try {
    const whoisData = await whoisLookup(fullDomain)
    const parsedData = parseWhoisData(whoisData)

    // Si nous avons des données whois, le domaine n'est pas disponible
    const isAvailable = !parsedData.domainName || 
      parsedData.status?.some(s => s.toLowerCase().includes('no match')) ||
      whoisData.toLowerCase().includes('no match') ||
      whoisData.toLowerCase().includes('not found')

    return NextResponse.json({
      available: isAvailable,
      details: isAvailable ? null : {
        registrar: parsedData.registrar,
        creationDate: parsedData.creationDate,
        expirationDate: parsedData.expirationDate,
        nameServers: parsedData.nameServers,
        status: parsedData.status
      }
    })
  } catch (error) {
    console.error('Error checking domain:', error)
    return NextResponse.json(
      { error: 'Failed to check domain availability' },
      { status: 500 }
    )
  }
} 