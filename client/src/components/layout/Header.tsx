import { Bell } from "lucide-react";
import { useNavigationStore } from "@/store/useNavigationStore";

export default function Header() {
  const { breadcrumb } = useNavigationStore();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {breadcrumb[breadcrumb.length - 1] || '首頁'}
          </h1>
          <nav className="flex items-center space-x-2 text-sm text-slate-600 mt-1">
            <span>{breadcrumb.join(' > ')}</span>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-2 hover:bg-slate-100 rounded-lg">
              <Bell className="w-5 h-5 text-slate-600" />
            </button>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">王小明</p>
            <p className="text-xs text-slate-600">業務部</p>
          </div>
        </div>
      </div>
    </header>
  );
}
