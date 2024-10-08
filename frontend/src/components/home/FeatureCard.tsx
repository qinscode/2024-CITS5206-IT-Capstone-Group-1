import { FC } from 'react'

interface FeatureCardProps {
  title: string
  description: string
}

const FeatureCard: FC<FeatureCardProps> = ({ title, description }) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="mb-2 text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  )
}

export default FeatureCard
