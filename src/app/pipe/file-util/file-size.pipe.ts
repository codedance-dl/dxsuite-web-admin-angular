import { Pipe, PipeTransform } from '@angular/core';

declare type SPEC = {
  readonly radix: number;
  readonly unit: string[];
};

const si = { radix: 1e3, unit: ['b', 'kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'] };
const iec = { radix: 1024, unit: ['b', 'Kib', 'Mib', 'Gib', 'Tib', 'Pib', 'Eib', 'Zib', 'Yib'] };
const jedec = { radix: 1024, unit: ['b', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'] };

export const SPECS: Record<string, SPEC> = { si, iec, jedec, };

/**
 * file size
 * @param bytes
 * @param fixed
 * @param spec
 */
export function byteStringify(bytes: number, fixed = 2, spec = 'jedec'): string {
  bytes = Math.abs(bytes);

  const { radix, unit } = SPECS[spec];

  let loop = 0;

  // calculate
  while (bytes >= radix) {
    bytes /= radix;
    ++loop;
  }
  return `${bytes.toFixed(fixed)} ${unit[loop]}`;
}

@Pipe({ name: 'fileSize' })
export class FileSizePipe implements PipeTransform {

  transform(bytes = 0, precision = 2): string {
    if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) {
      return '?';
    }

    return byteStringify(bytes, precision);
  }
}
