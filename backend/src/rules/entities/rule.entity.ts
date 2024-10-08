import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Course } from '../../courses/entities/course.entity'
import { Requirement } from '../../requirements/entities/requirement.entity'
import { RuleType } from './rule.enum'

@Entity('rules')
export class Rule {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({
    type: 'enum',
    enum: RuleType,
  })
  type: RuleType

  @Column('text')
  description: string

  @ManyToOne(() => Course, (course) => course.rules, { onDelete: 'CASCADE' })
  course: Course

  @OneToMany(() => Requirement, (requirement) => requirement.rule)
  requirements: Requirement[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
