import { Exclude, Expose, Transform } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { CreatedAtColumn } from 'src/common/decorators/created-at.decorator';
import { UpdatedAtColumn } from 'src/common/decorators/updated-at.decorator';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  @Expose()
  id: number;

  @Expose()
  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @Expose()
  @ApiProperty()
  @Column()
  name: string;

  @Column()
  dob: string;

  @Exclude()
  @CreatedAtColumn({ select: false })
  createdAt: Date;

  @Exclude()
  @UpdatedAtColumn({ select: false })
  updatedAt: Date;

  /// --- Additional Fields --- ///
  @Expose()
  @ApiPropertyOptional()
  @Transform(({ obj }) => obj.calculateAge())
  age?: number;

  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }

  private calculateAge(): number {
    const today = new Date();
    const dob = new Date(this.dob);
    let age = today.getFullYear() - dob.getFullYear();
    const month = today.getMonth() - dob.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) age--;

    return age;
  }
}
