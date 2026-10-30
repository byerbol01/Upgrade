import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const components = await prisma.pCComponent.findMany({
      where: { inStock: true },
      orderBy: { price: 'asc' },
    });

    const grouped = {
      cpu: components.filter((c) => c.type === 'cpu'),
      motherboard: components.filter((c) => c.type === 'motherboard'),
      ram: components.filter((c) => c.type === 'ram'),
      gpu: components.filter((c) => c.type === 'gpu'),
      ssd: components.filter((c) => c.type === 'ssd'),
      psu: components.filter((c) => c.type === 'psu'),
      case: components.filter((c) => c.type === 'case'),
    };

    return NextResponse.json({ components: grouped });
  } catch (error) {
    console.error('Configurator components error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки комплектующих' }, { status: 500 });
  }
}
