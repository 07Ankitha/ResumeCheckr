import Navbar from '../../../components/Navbar';
import { ChartBarIcon, DocumentTextIcon, UserCircleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const metrics = [
  { name: 'Overall Score', value: '92%', icon: ChartBarIcon },
  { name: 'ATS Compatibility', value: '95%', icon: DocumentTextIcon },
  { name: 'Profile Strength', value: '88%', icon: UserCircleIcon },
];

const recommendations = [
  {
    title: 'Add More Technical Skills',
    description: 'Include specific technical skills like React, Node.js, and AWS to improve your profile visibility.',
    status: 'warning',
  },
  {
    title: 'Optimize Keywords',
    description: 'Add industry-specific keywords to improve ATS compatibility.',
    status: 'success',
  },
  {
    title: 'Enhance Summary Section',
    description: 'Make your summary more impactful by adding quantifiable achievements.',
    status: 'warning',
  },
];

const skillGaps = [
  { skill: 'Cloud Computing', match: 60 },
  { skill: 'Machine Learning', match: 45 },
  { skill: 'DevOps', match: 75 },
];

export default function AnalysisReport() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Analysis Report</h1>
          </div>
        </header>

        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Metrics */}
            <div className="mt-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.name}
                    className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
                  >
                    <dt>
                      <div className="absolute rounded-md bg-blue-500 p-3">
                        <metric.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <p className="ml-16 truncate text-sm font-medium text-gray-500">{metric.name}</p>
                    </dt>
                    <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                      <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
                    </dd>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-8">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">Recommendations</h3>
                  <div className="mt-5">
                    <div className="flow-root">
                      <ul role="list" className="-my-5 divide-y divide-gray-200">
                        {recommendations.map((recommendation) => (
                          <li key={recommendation.title} className="py-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0">
                                {recommendation.status === 'success' ? (
                                  <CheckCircleIcon className="h-8 w-8 text-green-500" />
                                ) : (
                                  <XCircleIcon className="h-8 w-8 text-yellow-500" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900">{recommendation.title}</p>
                                <p className="truncate text-sm text-gray-500">{recommendation.description}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skill Gaps */}
            <div className="mt-8">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">Skill Gap Analysis</h3>
                  <div className="mt-5">
                    <div className="space-y-4">
                      {skillGaps.map((skill) => (
                        <div key={skill.skill}>
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-gray-900">{skill.skill}</div>
                            <div className="text-sm text-gray-500">{skill.match}% match</div>
                          </div>
                          <div className="mt-2">
                            <div className="h-2 w-full rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-blue-600"
                                style={{ width: `${skill.match}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="mt-8">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">Action Items</h3>
                  <div className="mt-5">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <CheckCircleIcon className="h-6 w-6 text-green-500" />
                        </div>
                        <p className="ml-3 text-sm text-gray-700">
                          Add cloud computing certifications to your profile
                        </p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <CheckCircleIcon className="h-6 w-6 text-green-500" />
                        </div>
                        <p className="ml-3 text-sm text-gray-700">
                          Include machine learning projects in your portfolio
                        </p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <CheckCircleIcon className="h-6 w-6 text-green-500" />
                        </div>
                        <p className="ml-3 text-sm text-gray-700">
                          Update your summary with quantifiable achievements
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
} 