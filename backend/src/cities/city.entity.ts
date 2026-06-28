import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('cities')
export class City {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  state: string;

  @Column()
  region: string;

  @Column()
  type: string;

  @Column()
  costIndex: string;

  @Column('int')
  popularity: number;

  @Column()
  description: string;

  @Column()
  image: string;
}
