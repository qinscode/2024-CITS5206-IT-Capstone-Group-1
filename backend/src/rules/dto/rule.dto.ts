import { RuleType } from '../entities/rule.enum'

export class CreateRuleDto {
  name: string
  type: RuleType
  description: string
  requirements?: {
    content: string
    style: string
    is_connector: boolean
    order_index?: number // 将 order_index 设为可选
  }[]
}

export class UpdateRuleDto {
  name?: string
  type?: RuleType
  description?: string
  requirements?: {
    content: string
    style: string
    is_connector: boolean
    order_index?: number
  }[]
}

export class RequirementHierarchyDto {
  id: number
  content: string
  style: string
  is_connector: boolean // Changed from is_connector to is_connector
  order_index?: number
  children: RequirementHierarchyDto[]
}

export class RuleWithHierarchyDto extends CreateRuleDto {
  id: number
  created_at: Date
  updated_at: Date
  requirements: RequirementHierarchyDto[]
}
