import { UpdateDateColumn, ColumnOptions } from 'typeorm';

export function UpdatedAtColumn(options?: ColumnOptions): PropertyDecorator {
  return UpdateDateColumn({ ...options, type: 'datetime', name: 'updated_at' });
}
