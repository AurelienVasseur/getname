import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const username = searchParams.get('username');
  const errorType = searchParams.get('errorType');
  const errorMsg = searchParams.get('errorMsg');
  const regexCheck = searchParams.get('regexCheck');

  if (!url || !username || !errorType || !errorMsg || !regexCheck) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  // Vérifier si le nom d'utilisateur correspond au format requis
  const regex = new RegExp(regexCheck);
  if (!regex.test(username)) {
    return NextResponse.json({
      status: 200,
      available: false,
      error: 'Invalid username format',
      url
    });
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    const text = await response.text();

    let isAvailable = false;
    if (errorType === 'status_code') {
      isAvailable = response.status === 404;
    } else if (errorType === 'message') {
      isAvailable = text.includes(errorMsg);
    }

    return NextResponse.json({
      status: response.status,
      available: isAvailable,
      url
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json({
      status: 500,
      error: 'Failed to check URL',
      available: false,
      url
    });
  }
} 