import React, { useState, useEffect, useCallback } from 'react'
import Layout from '@/components/Layout'
import Footer from '@/components/Footer'
import Sidebar from './Sidebar'

import { toast } from '@/hooks/use-toast'
import RuleSection from '@/components/manage-rules/common/RuleSection'
import AdmissionSelection from '@/components/manage-rules/RuleSection/AdmissionSelection'
import SatisfactoryProgress from '@/components/manage-rules/RuleSection/SatisfactoryProgress'
import ProgressStatus from '@/components/manage-rules/RuleSection/ProgressStatus'
import AwardWithDistinction from '@/components/manage-rules/RuleSection/AwardWithDistinction'
import Deferrals from '@/components/manage-rules/RuleSection/Deferrals'
import ArticulationExitAward from '@/components/manage-rules/RuleSection/ArticulationExitAward'
import CourseStructure from '@/components/manage-rules/RuleSection/CourseStructure'
import SaveButton from '@/components/manage-rules/common/SaveButton'
import { GeneralProps, Rule, RuleType, Requirement } from '@/types'
import { useCourse } from '@/context/CourseContext'
import { ruleService } from '@/services/ruleService'
import { presetRuleService } from '@/services/presetRuleService'
import { BackendRule } from '@/lib/categorizeRules'

interface CategorizedRules {
  englishEligibility: Rule | null
  admissions: Rule | null
  progress: Rule | null
  progressStatus: Rule | null
  distinction: Rule | null
  deferrals: Rule | null
  additional: Rule | null
  skills: Rule | null
  knowledge: Rule | null
  knowledgeApplication: Rule | null
  rankingSelection: Rule | null
  articulationExitAward?: Rule | null
  courseStructure?: Rule | null
}

const ManageRules: React.FC = () => {
  const { course } = useCourse()
  const courseCode = course?.code
  const version = course?.version
  const courseName = course?.name
  const courseType = course?.type
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [formData, setFormData] = useState<GeneralProps['data']>({
    englishRequirements: [],
    admissionRequirements: [],
    rankingSelection: [],
    satisfactoryProgress: [],
    progressStatus: [],
    awardWithDistinction: [],
    deferralAllowed: false,
    additionalRules: [],
    deferrals: [],
    knowledgeApplication: [],
    skills: [],
    knowledge: [],
    articulationExitAward: [],
    courseStructure: [],
  })

  const [categorizedRules, setCategorizedRules] = useState<CategorizedRules>({
    englishEligibility: null,
    admissions: null,
    progress: null,
    progressStatus: null,
    distinction: null,
    deferrals: null,
    additional: null,
    skills: null,
    knowledgeApplication: null,
    knowledge: null,
    rankingSelection: null,
    articulationExitAward: null,
    courseStructure: null,
  })

  const [showRankingRequirements, setShowRankingRequirements] = useState(false)
  const [allPresetRules, setAllPresetRules] = useState<BackendRule[]>([])

  useEffect(() => {
    fetchPresetRules()
  }, [])

  useEffect(() => {
    if (course?.id) {
      fetchAndCategorizeRules(course.id)
    }
  }, [course])

  type ObjType = { [key: string]: any }

  function renamePresetRequirements(arr: ObjType[]) {
    return arr.map((obj) => {
      if ('presetRequirements' in obj) {
        obj.Requirements = obj.presetRequirements
        delete obj.presetRequirements
      }
      return obj
    })
  }

  const fetchPresetRules = async () => {
    try {
      const raw_rules = await presetRuleService.getAllRules(courseType)
      const rules = renamePresetRequirements(raw_rules) as BackendRule[]
      console.log('rules', rules)
      setAllPresetRules(rules)
    } catch (error) {
      console.error('Error fetching rules:', error)
    }
  }

  const fetchAndCategorizeRules = async (courseId: number) => {
    try {
      const rules = await ruleService.getAllRules(courseId)
      console.log('DEBUG: rules', rules)
      const categorized = categorizeRules(rules)
      setCategorizedRules(categorized)
      updateFormDataFromRules(categorized)
    } catch (error) {
      console.error('Error fetching rules:', error)
    }
  }

  const categorizeRules = (rules: Rule[]): CategorizedRules => {
    const categorized: CategorizedRules = {
      englishEligibility: null,
      admissions: null,
      progress: null,
      progressStatus: null,
      distinction: null,
      deferrals: null,
      additional: null,
      skills: null,
      knowledgeApplication: null,
      knowledge: null,
      rankingSelection: null,
      articulationExitAward: null,
      courseStructure: null,
    }

    rules.forEach((rule) => {
      switch (rule.type) {
        case RuleType.ENGLISH_ELIGIBILITY:
          categorized.englishEligibility = rule
          break
        case RuleType.ADMISSIONS:
          categorized.admissions = rule
          break
        case RuleType.SATISFACTORY_PROGRESS:
          categorized.progress = rule
          break
        case RuleType.PROGRESS_STATUS:
          categorized.progressStatus = rule
          break
        case RuleType.AWARD_WITH_DISTINCTION:
          categorized.distinction = rule
          break
        case RuleType.DEFERRALS:
          categorized.deferrals = rule
          break
        case RuleType.RANKING_AND_SELECTION:
          categorized.rankingSelection = rule
          break
        case RuleType.ARTICULATION_EXIT_AWARD:
          categorized.articulationExitAward = rule
          break
        case RuleType.COURSE_STRUCTURE:
          categorized.courseStructure = rule
          break
      }
    })
    console.log('DEBUG: categorized', categorized)

    return categorized
  }

  const updateFormDataFromRules = (categorized: CategorizedRules) => {
    setFormData((prevData) => ({
      ...prevData,
      englishRequirements: categorized.englishEligibility?.requirements || [],
      admissionRequirements: categorized.admissions?.requirements || [],
      rankingSelection: categorized.rankingSelection?.requirements || [],
      satisfactoryProgress: categorized.progress?.requirements || [],
      progressStatus: categorized.progressStatus?.requirements || [],
      awardWithDistinction: categorized.distinction?.requirements || [],
      deferrals: categorized.deferrals?.requirements || [],
      articulationExitAward: categorized.articulationExitAward?.requirements || [],
      courseStructure: categorized.courseStructure?.requirements || [],
    }))
  }

  const updateFormData = useCallback((data: Partial<GeneralProps['data']>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }))
    setHasUnsavedChanges(true)
  }, [])

  const handleSave = async () => {
    if (!hasUnsavedChanges) return

    try {
      const rulesToUpdate = [
        { rule: categorizedRules.englishEligibility, data: formData.englishRequirements },
        { rule: categorizedRules.admissions, data: formData.admissionRequirements },
        { rule: categorizedRules.progress, data: formData.satisfactoryProgress },
        { rule: categorizedRules.distinction, data: formData.awardWithDistinction },
        { rule: categorizedRules.deferrals, data: formData.deferrals },
        { rule: categorizedRules.articulationExitAward, data: formData.articulationExitAward },
        { rule: categorizedRules.courseStructure, data: formData.courseStructure },
        { rule: categorizedRules.progressStatus, data: formData.progressStatus },
        { rule: categorizedRules.rankingSelection, data: formData.rankingSelection },
      ]

      for (const { rule, data } of rulesToUpdate) {
        if (rule && data) {
          await ruleService.updateRequirementByRuleId(course!.id, rule.id, data as Requirement[])
          console.log('QQQQQQ', course!.id, rule.id, data as Requirement[])
        }
      }

      console.log('DEBUG: rulesToUpdate', rulesToUpdate)

      setHasUnsavedChanges(false)
      toast({ title: 'Rules saved', description: 'All rules have been successfully saved.' })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save rules. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const sidebarItems = [
    { id: 'admission', title: 'Admission and selection' },
    { id: 'articulation', title: 'Articulation and Exit Award' },
    { id: 'course-structure', title: 'Course Structure' },
    { id: 'satisfactory-progress', title: 'Satisfactory Progress' },
    { id: 'progress-status', title: 'Progress Status' },
    { id: 'award-distinction', title: 'Award with distinction' },
    { id: 'deferrals', title: 'Deferrals' },
  ]

  return (
    <Layout>
      <div className="mx-auto max-w-7xl flex-1 p-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Manage Rules - {courseCode}: {courseName} (Version: {version})
          </h1>
        </div>
        <div className="flex">
          <Sidebar items={sidebarItems} />
          <div className="ml-6 flex-1">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-6">
                <RuleSection title="Admission and selection" id="admission">
                  <AdmissionSelection
                    data={{
                      englishRequirements: formData.englishRequirements || [],
                      admissionRequirements: formData.admissionRequirements || [],
                      rankingSelection: formData.rankingSelection || [],
                    }}
                    updateData={updateFormData}
                    showRankingRequirements={showRankingRequirements}
                    setShowRankingRequirements={setShowRankingRequirements}
                    initialPresetRules={allPresetRules}
                  />
                </RuleSection>

                <RuleSection title="Articulation and Exit Award" id="articulation">
                  <ArticulationExitAward
                    data={formData}
                    updateData={updateFormData}
                    initialPresetRules={allPresetRules}
                  />
                </RuleSection>

                <RuleSection title="Course Structure" id="course-structure">
                  <CourseStructure
                    data={formData}
                    updateData={updateFormData}
                    initialPresetRules={allPresetRules}
                  />
                </RuleSection>

                <RuleSection title="Satisfactory Progress" id="satisfactory-progress">
                  <SatisfactoryProgress
                    data={{ satisfactoryProgress: formData.satisfactoryProgress || [] }}
                    updateData={updateFormData}
                    initialPresetRules={allPresetRules}
                  />
                </RuleSection>

                <RuleSection title="Progress Status" id="progress-status">
                  <ProgressStatus
                    data={formData}
                    updateData={updateFormData}
                    initialPresetRules={allPresetRules}
                  />
                </RuleSection>

                <RuleSection title="Award with distinction" id="award-distinction">
                  <AwardWithDistinction
                    data={{ awardWithDistinction: formData.awardWithDistinction || [] }}
                    updateData={updateFormData}
                    initialPresetRules={allPresetRules}
                  />
                </RuleSection>

                <RuleSection title="Deferrals" id="deferrals">
                  <Deferrals
                    anchorId="deferrals"
                    data={{
                      deferrals: formData.deferrals || [],
                      deferralAllowed: formData.deferralAllowed || false,
                    }}
                    updateData={updateFormData}
                    initialPresetRules={allPresetRules}
                  />
                </RuleSection>
              </div>

              <SaveButton handleSaveButton={handleSave} disabled={!hasUnsavedChanges} />
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  )
}

export default ManageRules
