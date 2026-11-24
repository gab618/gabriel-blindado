import type { GaleriaItem } from '@/lib/galeria';
import { GaleriaThumb } from './GaleriaThumb';

export interface GaleriaGridProps {
  itens: GaleriaItem[];
  emptyMessage: string;
}

export function GaleriaGrid({ itens, emptyMessage }: GaleriaGridProps) {
  if (itens.length === 0) {
    return <p className="font-mono text-sm text-muted">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {itens.map((item) => (
        <GaleriaThumb key={item.id} item={item} />
      ))}
    </div>
  );
}
