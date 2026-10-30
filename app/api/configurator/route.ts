import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const FALLBACK_COMPONENTS = [
  { id: 'cpu-1', type: 'cpu', name: 'Intel Core i5-14400F', price: 2250000, brand: 'Intel', socket: 'LGA1700', powerUsage: 65, inStock: true },
  { id: 'cpu-2', type: 'cpu', name: 'Intel Core i7-14700F', price: 4350000, brand: 'Intel', socket: 'LGA1700', powerUsage: 125, inStock: true },
  { id: 'cpu-3', type: 'cpu', name: 'AMD Ryzen 5 7600', price: 2400000, brand: 'AMD', socket: 'AM5', powerUsage: 65, inStock: true },
  { id: 'cpu-4', type: 'cpu', name: 'AMD Ryzen 7 7800X3D', price: 5100000, brand: 'AMD', socket: 'AM5', powerUsage: 120, inStock: true },
  { id: 'mb-1', type: 'motherboard', name: 'Gigabyte B760M DS3H AX (DDR5)', price: 1680000, brand: 'Gigabyte', socket: 'LGA1700', ramType: 'DDR5', inStock: true },
  { id: 'mb-2', type: 'motherboard', name: 'ASUS TUF GAMING B650-PLUS WIFI', price: 2550000, brand: 'ASUS', socket: 'AM5', ramType: 'DDR5', inStock: true },
  { id: 'ram-1', type: 'ram', name: 'Kingston FURY Beast DDR5 32GB (2x16GB) 6000MHz', price: 1550000, brand: 'Kingston', ramType: 'DDR5', capacity: '32GB', inStock: true },
  { id: 'ram-2', type: 'ram', name: 'Corsair Vengeance RGB DDR5 32GB (2x16GB) 6400MHz', price: 1850000, brand: 'Corsair', ramType: 'DDR5', capacity: '32GB', inStock: true },
  { id: 'gpu-1', type: 'gpu', name: 'NVIDIA GeForce RTX 4060 8GB GDDR6', price: 4200000, brand: 'Palit', powerUsage: 115, inStock: true },
  { id: 'gpu-2', type: 'gpu', name: 'NVIDIA GeForce RTX 4070 SUPER 12GB GDDR6X', price: 8100000, brand: 'MSI', powerUsage: 220, inStock: true },
  { id: 'gpu-3', type: 'gpu', name: 'NVIDIA GeForce RTX 4080 SUPER 16GB GDDR6X', price: 14500000, brand: 'ASUS ROG', powerUsage: 320, inStock: true },
  { id: 'ssd-1', type: 'ssd', name: 'Samsung 980 Pro 1TB NVMe M.2 SSD', price: 1350000, brand: 'Samsung', capacity: '1TB', inStock: true },
  { id: 'ssd-2', type: 'ssd', name: 'Kingston KC3000 2TB NVMe M.2 SSD', price: 2150000, brand: 'Kingston', capacity: '2TB', inStock: true },
  { id: 'psu-1', type: 'psu', name: 'DeepCool PK650D 650W 80 Plus Bronze', price: 780000, brand: 'DeepCool', wattage: 650, inStock: true },
  { id: 'psu-2', type: 'psu', name: 'Corsair RM850x 850W 80 Plus Gold Modular', price: 1750000, brand: 'Corsair', wattage: 850, inStock: true },
  { id: 'case-1', type: 'case', name: 'DeepCool CC560 V2 Black (4x LED fans)', price: 720000, brand: 'DeepCool', inStock: true },
  { id: 'case-2', type: 'case', name: 'Lian Li O11 Dynamic EVO RGB White', price: 2350000, brand: 'Lian Li', inStock: true },
];

export async function GET() {
  try {
    let components = await prisma.pCComponent.findMany({
      where: { inStock: true },
      orderBy: { price: 'asc' },
    });

    if (!components || components.length === 0) {
      components = FALLBACK_COMPONENTS as any;
    }

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
    console.error('Configurator DB lookup, using fallback components:', error);
    const grouped = {
      cpu: FALLBACK_COMPONENTS.filter((c) => c.type === 'cpu'),
      motherboard: FALLBACK_COMPONENTS.filter((c) => c.type === 'motherboard'),
      ram: FALLBACK_COMPONENTS.filter((c) => c.type === 'ram'),
      gpu: FALLBACK_COMPONENTS.filter((c) => c.type === 'gpu'),
      ssd: FALLBACK_COMPONENTS.filter((c) => c.type === 'ssd'),
      psu: FALLBACK_COMPONENTS.filter((c) => c.type === 'psu'),
      case: FALLBACK_COMPONENTS.filter((c) => c.type === 'case'),
    };
    return NextResponse.json({ components: grouped });
  }
}
