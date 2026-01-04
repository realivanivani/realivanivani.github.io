import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, Globe, Building2, ExternalLink } from 'lucide-react';

const BIToolsComparison = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const marketShareData = [
    { tool: 'Power BI', share: 36, year: '2024' },
    { tool: 'Tableau', share: 20, year: '2024' },
    { tool: 'Looker', share: 6, year: '2024' },
    { tool: 'Grafana', share: 8, year: '2024' },
    { tool: 'Superset', share: 3, year: '2024' }
  ];

  const regionalData = [
    { region: 'North America', powerBI: 38, tableau: 25, looker: 7 },
    { region: 'Europe', powerBI: 35, tableau: 18, looker: 5 },
    { region: 'Asia-Pacific', powerBI: 32, tableau: 15, looker: 8 },
    { region: 'LATAM', powerBI: 28, tableau: 12, looker: 4 }
  ];

  const industryData = [
    { industry: 'Finance/BFSI', adoption: 65 },
    { industry: 'Healthcare', adoption: 46 },
    { industry: 'Retail', adoption: 52 },
    { industry: 'Manufacturing', adoption: 58 },
    { industry: 'IT/Telecom', adoption: 72 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const tools = {
    powerbi: {
      name: 'Microsoft Power BI',
      type: 'Commercial',
      price: '$10-20/user/month',
      marketShare: '36%',
      pros: [
        'Deep Microsoft ecosystem integration (Office 365, Azure, Teams)',
        'Cost-effective pricing, especially for existing Microsoft customers',
        'Excellent for operational reporting and real-time analytics',
        'User-friendly interface with low learning curve',
        'Strong AI features with Copilot integration',
        'Extensive community and learning resources'
      ],
      cons: [
        'Less advanced visualization options compared to Tableau',
        'Performance issues with very large datasets',
        'Limited customization for complex visualizations',
        'Premium features require additional licensing',
        'Some users report slower refresh times'
      ],
      bestFor: 'Organizations already using Microsoft products, SMBs needing cost-effective BI, teams requiring rapid deployment',
      resources: [
        { name: 'Pragmatic Works YouTube Channel', url: 'https://www.youtube.com/@PragmaticWorks', type: 'Video' },
        { name: 'SQLBI - DAX Training', url: 'https://www.sqlbi.com/', type: 'Course' },
        { name: 'Guy in a Cube', url: 'https://www.youtube.com/@GuyInACube', type: 'Video' },
        { name: 'Curbal YouTube Channel', url: 'https://www.youtube.com/@CurbalEN', type: 'Video' },
        { name: 'Microsoft Learn Power BI Path', url: 'https://learn.microsoft.com/en-us/power-bi/', type: 'Official' },
        { name: 'Power BI Full Course - Edureka', url: 'https://www.youtube.com/watch?v=3u7MQz1EyPY', type: 'Video' }
      ]
    },
    tableau: {
      name: 'Tableau',
      type: 'Commercial',
      price: '$70/user/month (Creator)',
      marketShare: '20%',
      pros: [
        'Industry-leading visualization capabilities',
        'Excellent for complex, custom visualizations',
        'Strong data storytelling features',
        'Mature product with extensive feature set',
        'Large and active community',
        'Excellent for external presentations and client-facing dashboards'
      ],
      cons: [
        'Expensive licensing, especially for large teams',
        'Steeper learning curve than Power BI',
        'Slower adoption of new features compared to competitors',
        'Can be resource-intensive',
        'Requires viewer licenses for dashboard consumers'
      ],
      bestFor: 'Data visualization specialists, organizations needing complex analytics, companies with budget for premium tools',
      resources: [
        { name: 'Tableau Official Training Videos', url: 'https://www.tableau.com/learn/training', type: 'Official' },
        { name: 'Tableau Tim YouTube Channel', url: 'https://www.youtube.com/@TableauTim', type: 'Video' },
        { name: 'Andy Kriebel - VizWiz', url: 'https://www.youtube.com/@vizwiz', type: 'Video' },
        { name: 'sqlbelle YouTube Channel', url: 'https://www.youtube.com/@sqlbelle', type: 'Video' },
        { name: 'Tableau Public Gallery', url: 'https://public.tableau.com/app/discover', type: 'Community' },
        { name: 'Coursera - Data Visualization with Tableau', url: 'https://www.coursera.org/specializations/data-visualization', type: 'Course' }
      ]
    },
    looker: {
      name: 'Looker (Google Cloud)',
      type: 'Commercial',
      price: 'Custom pricing',
      marketShare: '6%',
      pros: [
        'Cloud-native architecture for scalability',
        'Strong data modeling with LookML',
        'Excellent integration with Google Cloud Platform',
        'Real-time data connectivity',
        'Strong data governance framework',
        'Developer-friendly with API access'
      ],
      cons: [
        'Requires LookML knowledge (steep learning curve)',
        'Can be expensive for small-medium businesses',
        'Limited visualization variety compared to Tableau',
        'Requires more technical expertise',
        'Smaller community compared to Power BI/Tableau'
      ],
      bestFor: 'Google Cloud users, tech-forward companies, organizations needing strong data governance',
      resources: [
        { name: 'Google Cloud Skills Boost - Looker', url: 'https://www.cloudskillsboost.google/paths/28', type: 'Official' },
        { name: 'Coursera - Analyzing Data in Looker', url: 'https://www.coursera.org/learn/analyzing-and-visualizing-data-in-looker', type: 'Course' },
        { name: 'Looker Studio Masterclass', url: 'https://lookerstudiomasterclass.com/', type: 'Course' },
        { name: 'Looker Documentation', url: 'https://cloud.google.com/looker/docs', type: 'Official' },
        { name: 'Looker Community', url: 'https://community.looker.com/', type: 'Community' }
      ]
    },
    grafana: {
      name: 'Grafana',
      type: 'Open Source',
      price: 'Free (OSS) / Enterprise pricing available',
      marketShare: '8% (monitoring segment)',
      pros: [
        'Completely free and open source',
        'Excellent for real-time monitoring and observability',
        'Strong time-series data visualization',
        'Extensive plugin ecosystem',
        'Perfect for DevOps and IT infrastructure monitoring',
        'Flexible deployment options'
      ],
      cons: [
        'Not designed for traditional BI/business analytics',
        'Limited support for non-time-series data',
        'Requires technical expertise to set up',
        'No built-in SQL query builder',
        'Less suitable for ad-hoc business reporting'
      ],
      bestFor: 'DevOps teams, IT monitoring, IoT applications, real-time metrics tracking, system performance monitoring',
      resources: [
        { name: 'Grafana Official Tutorials', url: 'https://grafana.com/tutorials/', type: 'Official' },
        { name: 'Grafana Labs Workshops', url: 'https://grafana.com/workshops/', type: 'Workshop' },
        { name: 'Udemy - Grafana Tutorial', url: 'https://www.udemy.com/course/grafana-tutorial/', type: 'Course' },
        { name: 'Grafana Beginners Course', url: 'https://www.udemy.com/course/grafana-latest/', type: 'Course' },
        { name: 'Grafana Documentation', url: 'https://grafana.com/docs/', type: 'Official' }
      ]
    },
    superset: {
      name: 'Apache Superset',
      type: 'Open Source',
      price: 'Free (OSS)',
      marketShare: '3% (growing rapidly)',
      pros: [
        'Completely free and open source',
        'Rich visualization options (50+ chart types)',
        'SQL Lab for ad-hoc queries',
        'Lightweight and easy to deploy',
        'Active Apache community',
        'Can handle large datasets'
      ],
      cons: [
        'Requires SQL knowledge',
        'Steeper learning curve for non-technical users',
        'Limited NoSQL database support',
        'Less polished UI than commercial tools',
        'Requires technical resources for maintenance',
        'Basic user management features'
      ],
      bestFor: 'Startups, companies with engineering resources, data teams comfortable with SQL, cost-conscious organizations',
      resources: [
        { name: 'Apache Superset Official Docs', url: 'https://superset.apache.org/docs/intro', type: 'Official' },
        { name: 'Udemy - Apache Superset for Data Engineers', url: 'https://www.udemy.com/course/apache-superset-for-data-engineers-hands-on/', type: 'Course' },
        { name: 'Start Data Engineering Tutorial', url: 'https://www.startdataengineering.com/post/apache-superset-tutorial/', type: 'Tutorial' },
        { name: 'Data Engineer Academy Tutorial', url: 'https://dataengineeracademy.com/blog/apache-superset-tutorial/', type: 'Tutorial' },
        { name: 'Superset GitHub Repository', url: 'https://github.com/apache/superset', type: 'Community' }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            BI Tools Deep Dive: 2024-2025 Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive comparison of Power BI, Tableau, Looker, Grafana, and Apache Superset covering market trends, 
            regional adoption, industry usage, and practical recommendations
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {['overview', 'market', 'regional', 'industry', 'tools', 'recommendations'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeSection === section
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <TrendingUp className="mr-3 text-blue-600" />
              Executive Summary
            </h2>
            
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 mb-4">
                The business intelligence market has evolved significantly, with cloud-based solutions dominating adoption. 
                The global BI market is projected to reach <strong>$63.20 billion by 2032</strong>, growing at a CAGR of 8.9%. 
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">Key Market Trends</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Power BI leads</strong> with 36% market share (2024)</li>
                    <li>• Cloud BI adoption at 69.8% and growing</li>
                    <li>• AI-powered analytics becoming standard</li>
                    <li>• North America holds 37.5% of global market</li>
                    <li>• BFSI sector shows highest adoption (65%)</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-green-900 mb-3">The Open Source Wave</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Grafana: 60% growth in community adoption</li>
                    <li>• Superset: Favored by tech companies (Airbnb, Netflix)</li>
                    <li>• Cost savings driving open source adoption</li>
                    <li>• Technical teams prefer flexibility</li>
                    <li>• Growing enterprise support options</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Why This Matters Now</h3>
              <p className="text-gray-700 mb-4">
                Organizations are under pressure to become more data-driven. Studies show that data-driven organizations are 
                <strong> 23x more likely to acquire customers</strong>, <strong>6x more likely to retain them</strong>, 
                and <strong>19x more likely to be profitable</strong>. However, only 26% of organizations globally have 
                adopted BI tools, leaving massive growth potential.
              </p>

              <p className="text-gray-700">
                The choice between commercial and open source tools often comes down to: organizational maturity, 
                technical resources available, budget constraints, existing tech stack, and specific use cases 
                (operational BI vs. monitoring vs. ad-hoc analytics).
              </p>
            </div>
          </div>
        )}

        {/* Market Share Section */}
        {activeSection === 'market' && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <DollarSign className="mr-3 text-green-600" />
              Market Share Analysis
            </h2>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Overall Market Distribution (2024)</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={marketShareData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ tool, share }) => `${tool}: ${share}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="share"
                  >
                    {marketShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Commercial Leaders</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold">Power BI - 36%</p>
                    <p className="text-sm text-gray-700">Growing rapidly, especially in enterprises using Microsoft stack</p>
                  </div>
                  <div>
                    <p className="font-semibold">Tableau - 20%</p>
                    <p className="text-sm text-gray-700">Maintaining strong position in visualization-heavy organizations</p>
                  </div>
                  <div>
                    <p className="font-semibold">Looker - 6%</p>
                    <p className="text-sm text-gray-700">Growing among Google Cloud and tech-forward companies</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-green-900 mb-3">Open Source Players</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold">Grafana - 8%</p>
                    <p className="text-sm text-gray-700">Dominant in monitoring/observability space, 250+ integrations</p>
                  </div>
                  <div>
                    <p className="font-semibold">Superset - 3%</p>
                    <p className="text-sm text-gray-700">Rapid growth, 60% YoY community adoption increase</p>
                  </div>
                  <div>
                    <p className="font-semibold">Others (Metabase, Redash)</p>
                    <p className="text-sm text-gray-700">Niche players with specific use cases</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
              <h4 className="font-bold text-lg mb-2">Key Market Dynamics</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Power BI overtook Tableau around 2019-2020, driven by aggressive pricing and Microsoft integration</li>
                <li>• Tableau's share declining but maintaining loyalty in visualization-centric organizations</li>
                <li>• Open source tools gaining 15-20% annually, especially in tech sector</li>
                <li>• Cloud deployment preference driving adoption (75% by 2024)</li>
                <li>• Job market: Power BI demand growing 3x faster than Tableau</li>
              </ul>
            </div>
          </div>
        )}

        {/* Regional Adoption */}
        {activeSection === 'regional' && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <Globe className="mr-3 text-purple-600" />
              Regional Adoption Patterns
            </h2>

            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={regionalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis label={{ value: 'Adoption %', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="powerBI" fill="#0088FE" name="Power BI" />
                <Bar dataKey="tableau" fill="#00C49F" name="Tableau" />
                <Bar dataKey="looker" fill="#FFBB28" name="Looker" />
              </BarChart>
            </ResponsiveContainer>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">North America</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Dominates with 37.5%</strong> of global BI market</li>
                  <li>• Tableau strongest here: 63% of customers in US</li>
                  <li>• Power BI gaining in mid-west and south-east regions</li>
                  <li>• High cloud adoption driving both tools</li>
                  <li>• Mature market with established practices</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Europe</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• More fragmented tool landscape</li>
                  <li>• GDPR driving demand for data governance</li>
                  <li>• Germany leads in manufacturing BI adoption</li>
                  <li>• Strong preference for on-premise in some sectors</li>
                  <li>• Growing open source adoption</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Asia-Pacific</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Fastest growing region</strong> (highest CAGR)</li>
                  <li>• Leapfrogging to cloud-native solutions</li>
                  <li>• China and India driving growth</li>
                  <li>• Mixed adoption: Power BI in enterprises, open source in startups</li>
                  <li>• Government digitization initiatives boosting demand</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Latin America & MEA</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Emerging markets with growing adoption</li>
                  <li>• Power BI gaining due to Microsoft presence</li>
                  <li>• Brazil and Mexico leading in LATAM</li>
                  <li>• Price sensitivity favoring cost-effective solutions</li>
                  <li>• Open source gaining traction</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-indigo-50 p-6 rounded-lg">
              <h4 className="font-bold text-lg mb-3">Regional Tool Preferences</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="font-semibold text-indigo-900">West Coast US</p>
                  <p className="text-sm text-gray-700">Tableau, Looker (tech companies)</p>
                </div>
                <div>
                  <p className="font-semibold text-indigo-900">Mid-West/South-East US</p>
                  <p className="text-sm text-gray-700">Power BI (corporate enterprises)</p>
                </div>
                <div>
                  <p className="font-semibold text-indigo-900">European Manufacturing</p>
                  <p className="text-sm text-gray-700">Mixed (Tableau, Power BI, SAP)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Industry Section */}
        {activeSection === 'industry' && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <Building2 className="mr-3 text-indigo-600" />
              Industry-Specific Adoption
            </h2>

            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={industryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" label={{ value: 'Adoption %', position: 'insideBottom', offset: -5 }} />
                <YAxis dataKey="industry" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="adoption" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Banking & Financial Services (65% adoption)</h3>
                <p className="text-gray-700 mb-3"><strong>Top Tools:</strong> Power BI, Tableau, specialized BI platforms</p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Fraud detection and risk management</li>
                  <li>• Customer analytics and retention</li>
                  <li>• Regulatory compliance reporting</li>
                  <li>• Real-time transaction monitoring</li>
                  <li>• Power BI preferred for Microsoft stack integration</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-green-900 mb-3">Healthcare (46% adoption)</h3>
                <p className="text-gray-700 mb-3"><strong>Top Tools:</strong> Power BI, Tableau, specialized healthcare BI</p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Patient data analysis and outcomes tracking</li>
                  <li>• Operational efficiency (readmissions, wait times)</li>
                  <li>• Financial performance and billing analytics</li>
                  <li>• HIPAA compliance requirements</li>
                  <li>• Emphasis on data security and governance</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-purple-900 mb-3">Retail & E-commerce (52% adoption)</h3>
                <p className="text-gray-700 mb-3"><strong>Top Tools:</strong> Looker, Power BI, Superset</p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Customer behavior and segmentation</li>
                  <li>• Inventory optimization and supply chain</li>
                  <li>• Sales performance and forecasting</li>
                  <li>• Marketing campaign effectiveness</li>
                  <li>• Real-time dashboards for operations</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-orange-900 mb-3">Manufacturing (58% adoption)</h3>
                <p className="text-gray-700 mb-3"><strong>Top Tools:</strong> Grafana, Power BI, Tableau</p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Production monitoring and quality control</li>
                  <li>• Supply chain optimization</li>
                  <li>• Equipment performance and maintenance</li>
                  <li>• Industry 4.0 and IoT data integration</li>
                  <li>• Grafana popular for real-time monitoring</li>
                </ul>
              </div>

              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-indigo-900 mb-3">IT & Telecommunications (72% adoption)</h3>
                <p className="text-gray-700 mb-3"><strong>Top Tools:</strong> Grafana, Looker, Superset</p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Network performance and uptime monitoring</li>
                  <li>• Customer analytics and churn prediction</li>
                  <li>• Service quality metrics</li>
                  <li>• Infrastructure observability</li>
                  <li>• High adoption of open source tools</li>
                </ul>
              </div>

              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-red-900 mb-3">Tech Startups & SaaS</h3>
                <p className="text-gray-700 mb-3"><strong>Top Tools:</strong> Looker, Superset, Metabase, Grafana</p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Product analytics and user behavior</li>
                  <li>• Growth metrics and KPIs</li>
                  <li>• Operational dashboards</li>
                  <li>• Cost-conscious: prefer open source</li>
                  <li>• Cloud-native architecture preferred</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tools Comparison */}
        {activeSection === 'tools' && (
          <div className="space-y-6">
            {Object.entries(tools).map(([key, tool]) => (
              <div key={key} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold">{tool.name}</h2>
                  <div className="flex gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      tool.type === 'Commercial' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {tool.type}
                    </span>
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
                      {tool.marketShare} Market Share
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-green-700 mb-3">✓ Pros</h3>
                    <ul className="space-y-2">
                      {tool.pros.map((pro, idx) => (
                        <li key={idx} className="text-gray-700 flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-red-700 mb-3">✗ Cons</h3>
                    <ul className="space-y-2">
                      {tool.cons.map((con, idx) => (
                        <li key={idx} className="text-gray-700 flex items-start">
                          <span className="text-red-600 mr-2">•</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-bold mb-3">💡 Best For</h3>
                  <p className="text-gray-800">{tool.bestFor}</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">💰 Pricing</h3>
                    <span className="text-2xl font-bold text-blue-600">{tool.price}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <ExternalLink className="mr-2" />
                    Top Learning Resources
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {tool.resources.map((resource, idx) => (
                      <a
                        key={idx}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                      >
                        <span className="font-semibold text-gray-800">{resource.name}</span>
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                          {resource.type}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        {activeSection === 'recommendations' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6">🎯 Decision Framework & Recommendations</h2>

            <div className="space-y-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Choose Power BI If...</h3>
                <ul className="space-y-3 text-gray-800">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 text-xl">✓</span>
                    <span>You're already in the Microsoft ecosystem (Office 365, Azure, Teams, SharePoint)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 text-xl">✓</span>
                    <span>Budget is a primary concern ($10-20/user vs $70 for Tableau)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 text-xl">✓</span>
                    <span>You need rapid deployment and low learning curve</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 text-xl">✓</span>
                    <span>Focus is on operational reporting and real-time dashboards</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 text-xl">✓</span>
                    <span>You want AI-powered features (Copilot) integrated</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-green-900 mb-4">Choose Tableau If...</h3>
                <ul className="space-y-3 text-gray-800">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 text-xl">✓</span>
                    <span>Advanced, complex visualizations are your primary need</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 text-xl">✓</span>
                    <span>Data storytelling and presentation quality are critical</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 text-xl">✓</span>
                    <span>You have budget for premium tools and specialized talent</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 text-xl">✓</span>
                    <span>Your team consists of dedicated data analysts/visualization experts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 text-xl">✓</span>
                    <span>Creating client-facing or executive dashboards is common</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-purple-900 mb-4">Choose Looker If...</h3>
                <ul className="space-y-3 text-gray-800">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 text-xl">✓</span>
                    <span>You're heavily invested in Google Cloud Platform</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 text-xl">✓</span>
                    <span>Data governance and consistent metrics are paramount</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 text-xl">✓</span>
                    <span>Your team can handle LookML (or you're willing to invest in training)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 text-xl">✓</span>
                    <span>You need a cloud-native, scalable solution</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 text-xl">✓</span>
                    <span>Embedded analytics in applications is a requirement</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-orange-900 mb-4">Choose Grafana If...</h3>
                <ul className="space-y-3 text-gray-800">
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 text-xl">✓</span>
                    <span>Your primary need is infrastructure/application monitoring</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 text-xl">✓</span>
                    <span>You work with time-series data and metrics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 text-xl">✓</span>
                    <span>Real-time observability is critical (DevOps/SRE teams)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 text-xl">✓</span>
                    <span>You want a free, open source solution with enterprise options</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 text-xl">✓</span>
                    <span>IoT, manufacturing, or IT operations monitoring</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-red-900 mb-4">Choose Superset If...</h3>
                <ul className="space-y-3 text-gray-800">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 text-xl">✓</span>
                    <span>Budget is extremely limited but needs are sophisticated</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 text-xl">✓</span>
                    <span>Your team is comfortable with SQL and can handle setup/maintenance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 text-xl">✓</span>
                    <span>You're a startup or tech company with engineering resources</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 text-xl">✓</span>
                    <span>You want full control and customization capabilities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 text-xl">✓</span>
                    <span>You're comfortable with the Apache community support model</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-8 rounded-lg mt-8">
                <h3 className="text-2xl font-bold text-indigo-900 mb-4">💡 Pro Tips</h3>
                <div className="space-y-4 text-gray-800">
                  <p className="font-semibold">1. Consider Total Cost of Ownership (TCO)</p>
                  <p className="ml-4">Don't just look at license costs. Factor in: implementation time, training, maintenance, analyst time, and scaling costs.</p>
                  
                  <p className="font-semibold">2. Start with a Pilot</p>
                  <p className="ml-4">Test 2-3 tools with a real use case in your organization before committing. Most vendors offer free trials.</p>
                  
                  <p className="font-semibold">3. Match Tool to Use Case</p>
                  <p className="ml-4">Different tools excel at different things. You might need multiple tools: Grafana for monitoring + Power BI for business reporting.</p>
                  
                  <p className="font-semibold">4. Consider Your Team's Skills</p>
                  <p className="ml-4">A technically skilled team might prefer Looker/Superset. Business analysts might prefer Power BI/Tableau's drag-and-drop interfaces.</p>
                  
                  <p className="font-semibold">5. Think Long-term</p>
                  <p className="ml-4">Consider where your organization is heading: cloud migration? AI adoption? Data democratization? Choose tools that align with your roadmap.</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
                <h4 className="font-bold text-lg mb-3">⚠️ Common Mistakes to Avoid</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Choosing based solely on price without considering TCO</li>
                  <li>• Not involving end-users in the selection process</li>
                  <li>• Underestimating training and change management needs</li>
                  <li>• Ignoring data quality issues (garbage in = garbage out)</li>
                  <li>• Overlooking integration with existing systems</li>
                  <li>• Not planning for scalability from day one</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600 bg-white rounded-lg p-6">
          <p className="text-sm">
            Last updated: January 2025 | Data sources: Gartner, Forrester, TrustRadius, market research reports
          </p>
          <p className="text-xs mt-2">
            Market share and adoption figures are approximate and vary by source and methodology
          </p>
        </div>
      </div>
    </div>
  );
};

export default BIToolsComparison;
