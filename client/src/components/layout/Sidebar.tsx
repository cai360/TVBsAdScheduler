import { ChevronDown } from "lucide-react";
import { useNavigationStore } from "@/store/useNavigationStore";
import { MENU_STRUCTURE } from "@/lib/constants";
import { Link, useLocation } from "wouter";

export default function Sidebar() {
  const [location] = useLocation();
  const {
    currentPage,
    expandedGroups,
    expandedSubGroups,
    toggleGroup,
    toggleSubGroup,
    isGroupExpanded,
    isSubGroupExpanded,
    setCurrentPage,
  } = useNavigationStore();

  const handleNavigation = (page: string, path: string, breadcrumb: string[]) => {
    setCurrentPage(page, path, breadcrumb);
  };

  const renderMenuItem = (item: any, level = 0) => {
    const hasChildren = item.children && Object.keys(item.children).length > 0;
    const isActive = currentPage === item.id || location === item.path;
    const isExpanded = level === 0 ? isGroupExpanded(item.id) : isSubGroupExpanded(item.id);

    if (hasChildren) {
      return (
        <li key={item.id} className={level === 0 ? "menu-group" : "sub-menu-group"}>
          <button
            className={`nav-item ${level > 0 ? 'sub-nav-item' : ''} ${isActive ? 'active' : ''}`}
            onClick={() => level === 0 ? toggleGroup(item.id) : toggleSubGroup(item.id)}
          >
            {item.icon && <i className={item.icon}></i>}
            <span>{item.name}</span>
            <ChevronDown 
              className={`ml-auto h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
          <ul className={`${level === 0 ? 'submenu' : 'sub-submenu'} ${isExpanded ? 'show' : ''}`}>
            {Object.values(item.children).map((child: any) => renderMenuItem(child, level + 1))}
          </ul>
        </li>
      );
    }

    return (
      <li key={item.id}>
        <Link
          href={item.path || '#'}
          className={`${level === 0 ? 'nav-item' : level === 1 ? 'sub-nav-item' : 'sub-sub-nav-item'} ${isActive ? 'active' : ''}`}
          onClick={() => handleNavigation(item.id, item.path || '#', [item.name])}
        >
          {item.icon && <i className={item.icon}></i>}
          <span>{item.name}</span>
        </Link>
      </li>
    );
  };

  return (
    <div className="w-80 bg-slate-900 text-white flex flex-col shadow-2xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <div>
            <h1 className="text-lg font-bold">TVBS</h1>
            <p className="text-xs text-slate-400">廣告收入管理系統</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {Object.values(MENU_STRUCTURE).map((item: any) => renderMenuItem(item))}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">王</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">王小明</p>
            <p className="text-xs text-slate-400">業務部</p>
          </div>
          <button className="p-2 hover:bg-slate-800 rounded">
            <i className="fas fa-sign-out-alt text-slate-400"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
