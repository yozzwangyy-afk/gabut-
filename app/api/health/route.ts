import { NextResponse } from 'next/server';

export async function GET() {
  const healthcheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
  };
  
  return NextResponse.json(healthcheck);
}
