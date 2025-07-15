import { useState } from "react";
import Header from "@/components/header";
import StudentView from "@/pages/student-view";
import AdminView from "@/pages/admin-view";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"student" | "admin">("student");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("student")}
              className={`py-4 px-6 border-b-2 font-medium transition-colors flex items-center space-x-2 ${
                activeTab === "student"
                  ? "border-college-gold college-navy"
                  : "border-transparent text-gray-600 hover:text-college-navy"
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              <span>Student View</span>
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`py-4 px-6 border-b-2 font-medium transition-colors flex items-center space-x-2 ${
                activeTab === "admin"
                  ? "border-college-gold college-navy"
                  : "border-transparent text-gray-600 hover:text-college-navy"
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <span>Driver Access</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      {activeTab === "student" ? <StudentView /> : <AdminView />}
    </div>
  );
}
