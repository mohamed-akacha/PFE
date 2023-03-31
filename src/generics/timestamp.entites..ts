import { Exclude } from 'class-transformer';
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export class TimestampEntites {
  @Exclude()
  @CreateDateColumn(
    {
      update: false
    }
  )
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;
  
  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
