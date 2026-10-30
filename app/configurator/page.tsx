'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { PCComponent } from '@/lib/types';
import {
  Cpu,
  Layers,
  HardDrive,
  Zap,
  Box,
  CheckCircle,
  AlertTriangle,
  ShoppingCart,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function ConfiguratorPage() {
  const { addToCart } = useStore();

  const [components, setComponents] = useState<{
    cpu: PCComponent[];
    motherboard: PCComponent[];
    ram: PCComponent[];
    gpu: PCComponent[];
    ssd: PCComponent[];
    psu: PCComponent[];
    case: PCComponent[];
  }>({
    cpu: [],
    motherboard: [],
    ram: [],
    gpu: [],
    ssd: [],
    psu: [],
    case: [],
  });

  const [selectedCpu, setSelectedCpu] = useState<PCComponent | null>(null);
  const [selectedMb, setSelectedMb] = useState<PCComponent | null>(null);
  const [selectedRam, setSelectedRam] = useState<PCComponent | null>(null);
  const [selectedGpu, setSelectedGpu] = useState<PCComponent | null>(null);
  const [selectedSsd, setSelectedSsd] = useState<PCComponent | null>(null);
  const [selectedPsu, setSelectedPsu] = useState<PCComponent | null>(null);
  const [selectedCase, setSelectedCase] = useState<PCComponent | null>(null);

  const [addedSuccess, setAddedSuccess] = useState(false);

  // Load components from API
  useEffect(() => {
    async function fetchComponents() {
      try {
        const res = await fetch('/api/configurator');
        if (res.ok) {
          const data = await res.json();
          setComponents(data.components);

          // Select fully compatible defaults
          const defCpu = data.components.cpu?.[0] || null;
          const defMb =
            data.components.motherboard?.find((m: PCComponent) => m.socket === defCpu?.socket && m.ramType === 'DDR5') ||
            data.components.motherboard?.[0] ||
            null;
          const defRam =
            data.components.ram?.find((r: PCComponent) => r.ramType === defMb?.ramType) ||
            data.components.ram?.[0] ||
            null;
          const defGpu = data.components.gpu?.[0] || null;
          const defSsd = data.components.ssd?.[0] || null;
          const defPsu =
            data.components.psu?.find((p: PCComponent) => (p.wattage || 0) >= 600) ||
            data.components.psu?.[0] ||
            null;
          const defCase = data.components.case?.[0] || null;

          setSelectedCpu(defCpu);
          setSelectedMb(defMb);
          setSelectedRam(defRam);
          setSelectedGpu(defGpu);
          setSelectedSsd(defSsd);
          setSelectedPsu(defPsu);
          setSelectedCase(defCase);
        }
      } catch (err) {
        console.error('Failed to fetch configurator parts:', err);
      }
    }
    fetchComponents();
  }, []);

  // Compatibility checking logic
  const compatibilityIssues: string[] = [];

  // 1. Socket check
  if (selectedCpu && selectedMb) {
    if (selectedCpu.socket !== selectedMb.socket) {
      compatibilityIssues.push(
        `Несовместимость сокета: Процессор ${selectedCpu.name} (${selectedCpu.socket}) не совместим с материнской платой ${selectedMb.name} (${selectedMb.socket}).`
      );
    }
  }

  // 2. RAM type check
  if (selectedMb && selectedRam) {
    if (selectedMb.ramType !== selectedRam.ramType) {
      compatibilityIssues.push(
        `Несовместимость типа памяти: Материнская плата поддерживает только ${selectedMb.ramType}, а выбрана планка ${selectedRam.ramType}.`
      );
    }
  }

  // 3. Power Supply Wattage check
  const estimatedPower =
    (selectedCpu?.powerUsage || 65) + (selectedGpu?.powerUsage || 115) + 100; // +100W for motherboard, fans, SSD

  const recommendedPsuWattage = Math.ceil(estimatedPower * 1.35); // 35% headroom

  if (selectedPsu && (selectedPsu.wattage || 0) < recommendedPsuWattage) {
    compatibilityIssues.push(
      `Недостаточная мощность БП: Расчетное пиковое потребление системы составляет ~${estimatedPower} Вт (рекомендуется БП от ${recommendedPsuWattage} Вт), а выбранный блок питания рассчитан на ${selectedPsu.wattage} Вт.`
    );
  }

  const isCompatible = compatibilityIssues.length === 0;

  // Total price calculation
  const totalPrice =
    (selectedCpu?.price || 0) +
    (selectedMb?.price || 0) +
    (selectedRam?.price || 0) +
    (selectedGpu?.price || 0) +
    (selectedSsd?.price || 0) +
    (selectedPsu?.price || 0) +
    (selectedCase?.price || 0);

  const formatPrice = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' UZS';
  };

  const handleAddToCart = () => {
    const buildTitle = `Кастомный ПК UPGRADE (${selectedCpu?.name || 'CPU'} / ${selectedGpu?.name || 'GPU'} / ${selectedRam?.capacity || 'RAM'})`;

    addToCart(
      {
        id: `build-${Date.now()}`,
        title: buildTitle,
        slug: 'custom-build',
        price: totalPrice,
        image: '/images/mt1.webp',
        brand: 'UPGRADE Сборка',
      },
      1
    );

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  const resetBuild = () => {
    const defCpu = components.cpu[0] || null;
    const defMb =
      components.motherboard.find((m) => m.socket === defCpu?.socket && m.ramType === 'DDR5') ||
      components.motherboard[0] ||
      null;
    const defRam = components.ram.find((r) => r.ramType === defMb?.ramType) || components.ram[0] || null;
    const defPsu = components.psu.find((p) => (p.wattage || 0) >= 600) || components.psu[0] || null;

    setSelectedCpu(defCpu);
    setSelectedMb(defMb);
    setSelectedRam(defRam);
    setSelectedGpu(components.gpu[0] || null);
    setSelectedSsd(components.ssd[0] || null);
    setSelectedPsu(defPsu);
    setSelectedCase(components.case[0] || null);
  };

  return (
    <div className="max-w-[1480px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#e5007d]">Главная</Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-bold">Конфигуратор ПК</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <span className="w-2.5 h-8 bg-[#e5007d] inline-block rounded-xs"></span>
            Конфигуратор компьютера
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Соберите компьютер мечты онлайн с автоматической проверкой совместимости деталей
          </p>
        </div>

        <button
          onClick={resetBuild}
          className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-[#e5007d] bg-white border border-gray-200 px-4 py-2 rounded-xl transition-all w-fit shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Сбросить конфигурацию</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Components Chooser */}
        <div className="lg:col-span-8 space-y-5">
          {/* 1. CPU */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
              <span className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#e5007d]" />
                1. Процессор (CPU)
              </span>
              <span className="text-xs font-bold text-[#e5007d]">
                {selectedCpu ? formatPrice(selectedCpu.price) : 'Не выбран'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {components.cpu.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCpu(c)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedCpu?.id === c.id
                      ? 'border-[#e5007d] bg-pink-50/40 text-gray-900'
                      : 'border-gray-100 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div>
                    <p className="font-bold text-xs">{c.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Сокет: {c.socket} • {c.powerUsage}W</p>
                  </div>
                  <p className="text-xs font-black text-[#e5007d] mt-2">{formatPrice(c.price)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Motherboard */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
              <span className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#e5007d]" />
                2. Материнская плата
              </span>
              <span className="text-xs font-bold text-[#e5007d]">
                {selectedMb ? formatPrice(selectedMb.price) : 'Не выбрана'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {components.motherboard.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedMb(c)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedMb?.id === c.id
                      ? 'border-[#e5007d] bg-pink-50/40 text-gray-900'
                      : 'border-gray-100 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div>
                    <p className="font-bold text-xs">{c.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Сокет: {c.socket} • Память: {c.ramType}</p>
                  </div>
                  <p className="text-xs font-black text-[#e5007d] mt-2">{formatPrice(c.price)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. RAM */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
              <span className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#e5007d]" />
                3. Оперативная память (RAM)
              </span>
              <span className="text-xs font-bold text-[#e5007d]">
                {selectedRam ? formatPrice(selectedRam.price) : 'Не выбрана'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {components.ram.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedRam(c)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedRam?.id === c.id
                      ? 'border-[#e5007d] bg-pink-50/40 text-gray-900'
                      : 'border-gray-100 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div>
                    <p className="font-bold text-xs">{c.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Тип: {c.ramType} • Объем: {c.capacity}</p>
                  </div>
                  <p className="text-xs font-black text-[#e5007d] mt-2">{formatPrice(c.price)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. GPU */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
              <span className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#e5007d]" />
                4. Видеокарта (GPU)
              </span>
              <span className="text-xs font-bold text-[#e5007d]">
                {selectedGpu ? formatPrice(selectedGpu.price) : 'Не выбрана'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {components.gpu.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedGpu(c)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedGpu?.id === c.id
                      ? 'border-[#e5007d] bg-pink-50/40 text-gray-900'
                      : 'border-gray-100 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div>
                    <p className="font-bold text-xs">{c.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Потребление: ~{c.powerUsage}W</p>
                  </div>
                  <p className="text-xs font-black text-[#e5007d] mt-2">{formatPrice(c.price)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. SSD */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
              <span className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#e5007d]" />
                5. Накопитель (SSD NVMe)
              </span>
              <span className="text-xs font-bold text-[#e5007d]">
                {selectedSsd ? formatPrice(selectedSsd.price) : 'Не выбран'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {components.ssd.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedSsd(c)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedSsd?.id === c.id
                      ? 'border-[#e5007d] bg-pink-50/40 text-gray-900'
                      : 'border-gray-100 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div>
                    <p className="font-bold text-xs">{c.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Емкость: {c.capacity}</p>
                  </div>
                  <p className="text-xs font-black text-[#e5007d] mt-2">{formatPrice(c.price)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Power Supply */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
              <span className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#e5007d]" />
                6. Блок питания (PSU)
              </span>
              <span className="text-xs font-bold text-[#e5007d]">
                {selectedPsu ? formatPrice(selectedPsu.price) : 'Не выбран'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {components.psu.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedPsu(c)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedPsu?.id === c.id
                      ? 'border-[#e5007d] bg-pink-50/40 text-gray-900'
                      : 'border-gray-100 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div>
                    <p className="font-bold text-xs">{c.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Мощность: {c.wattage}W</p>
                  </div>
                  <p className="text-xs font-black text-[#e5007d] mt-2">{formatPrice(c.price)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Case */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
              <span className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Box className="w-4 h-4 text-[#e5007d]" />
                7. Корпус (Case)
              </span>
              <span className="text-xs font-bold text-[#e5007d]">
                {selectedCase ? formatPrice(selectedCase.price) : 'Не выбран'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {components.case.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedCase?.id === c.id
                      ? 'border-[#e5007d] bg-pink-50/40 text-gray-900'
                      : 'border-gray-100 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div>
                    <p className="font-bold text-xs">{c.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{c.brand}</p>
                  </div>
                  <p className="text-xs font-black text-[#e5007d] mt-2">{formatPrice(c.price)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Build Summary & Live Recalculation */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xl space-y-4">
            <h3 className="font-black text-lg text-gray-900 uppercase tracking-tight flex items-center justify-between border-b border-gray-100 pb-3">
              <span>Ваша сборка</span>
              <Sparkles className="w-5 h-5 text-[#e5007d]" />
            </h3>

            {/* Compatibility Badge & Status */}
            {isCompatible ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-2.5 text-xs text-green-700 font-bold">
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600" />
                <span>Все детали на 100% совместимы!</span>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs text-amber-800">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
                  <span>Обнаружены замечания по совместимости:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11px] font-medium leading-relaxed">
                  {compatibilityIssues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technical Specs Summary */}
            <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Платформа сокета:</span>
                <span className="font-bold text-gray-800">{selectedCpu?.socket || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span>Стандарт памяти:</span>
                <span className="font-bold text-gray-800">{selectedRam?.ramType || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span>Пиковое потребление:</span>
                <span className="font-bold text-gray-800">~{estimatedPower} Вт</span>
              </div>
            </div>

            {/* Selected Components List */}
            <div className="space-y-2 text-xs divide-y divide-gray-100">
              <div className="pt-2 flex justify-between">
                <span className="text-gray-400">Процессор:</span>
                <span className="font-bold text-gray-800 text-right line-clamp-1 max-w-[180px]">{selectedCpu?.name}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-gray-400">Плата:</span>
                <span className="font-bold text-gray-800 text-right line-clamp-1 max-w-[180px]">{selectedMb?.name}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-gray-400">RAM:</span>
                <span className="font-bold text-gray-800 text-right line-clamp-1 max-w-[180px]">{selectedRam?.name}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-gray-400">Видеокарта:</span>
                <span className="font-bold text-gray-800 text-right line-clamp-1 max-w-[180px]">{selectedGpu?.name}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-gray-400">SSD:</span>
                <span className="font-bold text-gray-800 text-right line-clamp-1 max-w-[180px]">{selectedSsd?.name}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-gray-400">Блок питания:</span>
                <span className="font-bold text-gray-800 text-right line-clamp-1 max-w-[180px]">{selectedPsu?.name}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-gray-400">Корпус:</span>
                <span className="font-bold text-gray-800 text-right line-clamp-1 max-w-[180px]">{selectedCase?.name}</span>
              </div>
              <div className="pt-2 flex justify-between text-green-600 font-bold">
                <span>Сборка и стресс-тест:</span>
                <span>Бесплатно</span>
              </div>
            </div>

            {/* Total Price */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 uppercase font-bold">Итоговая стоимость:</p>
              <p className="text-2xl md:text-3xl font-black text-[#e5007d] tracking-tight mt-1">
                {formatPrice(totalPrice)}
              </p>
            </div>

            {addedSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-xl text-center">
                ✓ Сборка успешно добавлена в корзину!
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!isCompatible}
              className={`w-full py-4 px-6 rounded-2xl font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer ${
                isCompatible
                  ? 'bg-[#e5007d] hover:bg-[#c2005d] text-white shadow-pink-200'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Добавить сборку в корзину</span>
            </button>

            <Link
              href="/buynow"
              className="block text-center text-xs font-bold text-gray-600 hover:text-[#e5007d] transition-colors pt-2"
            >
              Перейти к оформлению заказа →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
