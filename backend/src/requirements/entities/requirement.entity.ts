import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { Rule } from '../../rules/entities/rule.entity'
import { NumberingStyle } from './style.enum'

@Entity('requirements')
export class Requirement {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text' })
  content: string

  @Column({
    type: 'enum',
    enum: NumberingStyle,
    default: NumberingStyle.Numeric,
  })
  style: NumberingStyle

  @ManyToOne(() => Requirement, (requirement) => requirement.children, {
    nullable: true,
    onDelete: 'CASCADE', // Add this line to enable cascade delete
  })
  parent: Requirement

  @OneToMany(() => Requirement, (requirement) => requirement.parent, {
    cascade: true, // Add this line to enable cascade operations
  })
  children: Requirement[]

  @ManyToOne(() => Rule, (rule) => rule.requirements)
  rule: Rule

  @Column({
    name: 'is_connector',
    type: 'tinyint',
    width: 1,
    transformer: {
      to: (value: boolean) => (value ? 1 : 0),
      from: (value: number) => value === 1,
    },
  })
  isConnector: boolean

  @Column({ name: 'order_index', default: 0 })
  order_index: number

  @Column({ nullable: true })
  parentId: number
}
