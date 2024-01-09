import { CreateDateColumn, ColumnOptions } from 'typeorm';

export function CreatedAtColumn(options?: ColumnOptions): PropertyDecorator {
  return CreateDateColumn({ ...options, type: 'datetime', name: 'created_at' });
}
