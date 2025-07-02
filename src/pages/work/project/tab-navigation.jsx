export default function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="border-b mb-6">
      <div className="flex overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-0 mr-4 py-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === tab ? "text-blue  border-blue" : "text-muted-foreground border-white hover:text-muted-foreground/80 duration-300"
            }`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}