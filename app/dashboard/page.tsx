import Navbar from '../../components/Navbar';
import { ArrowUpTrayIcon, DocumentTextIcon, ChartBarIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const stats = [
  { name: 'Profile Strength', value: '85%', icon: ChartBarIcon },
  { name: 'Resume Score', value: '92%', icon: DocumentTextIcon },
  { name: 'Skills Match', value: '78%', icon: UserCircleIcon },
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Dashboard</h1>
          </div>
        </header>

        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Stats */}
            <div className="mt-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.name}
                    className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
                  >
                    <dt>
                      <div className="absolute rounded-md bg-blue-500 p-3">
                        <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
                    </dt>
                    <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    </dd>
                  </div>
                ))}
              </div>
            </div>

            {/* Main content */}
            <div className="mt-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Resume Upload */}
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">Upload Resume</h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                      <p>Upload your resume in PDF or DOCX format for analysis.</p>
                    </div>
                    <div className="mt-5">
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="resume-upload"
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ArrowUpTrayIcon className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PDF or DOCX (MAX. 5MB)</p>
                          </div>
                          <input id="resume-upload" type="file" className="hidden" accept=".pdf,.docx" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LinkedIn Connection */}
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">Connect LinkedIn</h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                      <p>Connect your LinkedIn profile for comprehensive analysis.</p>
                    </div>
                    <div className="mt-5">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        Connect LinkedIn Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Analysis */}
            <div className="mt-8">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Analysis</h3>
                  <div className="mt-5">
                    <div className="flow-root">
                      <ul role="list" className="-my-5 divide-y divide-gray-200">
                        <li className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-900">Software Engineer Resume</p>
                              <p className="truncate text-sm text-gray-500">Last analyzed 2 days ago</p>
                            </div>
                            <div>
                              <button
                                type="button"
                                className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              >
                                View Report
                              </button>
                            </div>
                          </div>
                        </li>
                        <li className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <UserCircleIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-900">LinkedIn Profile Analysis</p>
                              <p className="truncate text-sm text-gray-500">Last analyzed 1 week ago</p>
                            </div>
                            <div>
                              <button
                                type="button"
                                className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              >
                                View Report
                              </button>
                            </div>
                          </div>
                        </li>
                      </ul>
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