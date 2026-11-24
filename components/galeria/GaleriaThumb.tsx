import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import type { GaleriaItem } from '@/lib/galeria';

export interface GaleriaThumbProps {
  item: GaleriaItem;
}

export function GaleriaThumb({ item }: GaleriaThumbProps) {
  return (
    <Link
      href={item.href as Route}
      className="group flex flex-col border border-border bg-bg transition-all duration-200 hover:-translate-y-0.5 hover:border-fg hover:shadow-[3px_3px_0_0_var(--color-fg)]"
    >
      <div className="relative aspect-square w-full overflow-hidden border-b border-border bg-code-bg">
        <Image
          src={item.url}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          placeholder={item.blurDataURL ? 'blur' : 'empty'}
          blurDataURL={item.blurDataURL}
          className="object-cover saturate-50 brightness-95 transition-all duration-300 ease-out group-hover:saturate-100 group-hover:brightness-100 group-hover:scale-105"
        />
      </div>

      <div className="p-2 font-mono">
        <p className="truncate text-xs font-medium text-fg group-hover:text-link group-hover:underline">
          {item.title}
        </p>
      </div>
    </Link>
  );
}
