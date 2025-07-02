import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import SchedulingCreate from "@/pages/scheduling/SchedulingCreate";
import BreakArrangement from "@/pages/log-arrangement/BreakArrangement";
import GenericPage from "@/pages/GenericPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <MainLayout>
      <Switch>
        {/* Dashboard */}
        <Route path="/" component={Dashboard} />
        
        {/* Scheduling Management */}
        <Route path="/scheduling/create" component={SchedulingCreate} />
        <Route path="/scheduling/details" component={() => <GenericPage title="排期單明細" />} />
        <Route path="/scheduling/approval" component={() => <GenericPage title="排期單審核流程" />} />
        
        {/* Daily Program Scheduling */}
        <Route path="/daily-program/creation" component={() => <GenericPage title="節目表建立" />} />
        <Route path="/daily-program/adjustment" component={() => <GenericPage title="節目線異動" />} />
        <Route path="/daily-program/master" component={() => <GenericPage title="節目主檔管理" />} />
        <Route path="/daily-program/detail" component={() => <GenericPage title="節目明細檔管理" />} />
        <Route path="/daily-program/broadcast-month" component={() => <GenericPage title="播映月份檔管理" />} />
        <Route path="/daily-program/postponement" component={() => <GenericPage title="延期管理" />} />
        
        {/* Ad Slot Management */}
        <Route path="/ad-slot/channel-seconds" component={() => <GenericPage title="頻道可排播秒數設定" />} />
        <Route path="/ad-slot/channel-master" component={() => <GenericPage title="頻道基本資料管理" />} />
        
        {/* LOG Arrangement */}
        <Route path="/log-arrangement/program-line" component={() => <GenericPage title="節目線編排" />} />
        <Route path="/log-arrangement/break" component={BreakArrangement} />
        <Route path="/log-arrangement/ad-placement" component={() => <GenericPage title="廣告位置編排" />} />
        <Route path="/log-arrangement/id-card" component={() => <GenericPage title="ID 卡編排" />} />
        <Route path="/log-arrangement/promo" component={() => <GenericPage title="Promo 編排" />} />
        <Route path="/log-arrangement/placement-rules" component={() => <GenericPage title="置入規則編排" />} />
        <Route path="/log-arrangement/sandwich-rules" component={() => <GenericPage title="三明治規則編排" />} />
        <Route path="/log-arrangement/conversion" component={() => <GenericPage title="LOG 轉檔作業" />} />
        
        {/* Broadcast Log Management */}
        <Route path="/broadcast-log/schedule-to-broadcast" component={() => <GenericPage title="排期單轉託播單" />} />
        <Route path="/broadcast-log/generation" component={() => <GenericPage title="託播單產生" />} />
        <Route path="/broadcast-log/email-dispatch" component={() => <GenericPage title="郵件發送" />} />
        
        {/* Broadcast Result */}
        <Route path="/broadcast-result" component={() => <GenericPage title="播出結果查詢" />} />
        
        {/* Sales Management */}
        <Route path="/sales/program-packages" component={() => <GenericPage title="節目組合" />} />
        <Route path="/sales/pricing-strategies" component={() => <GenericPage title="價格策略" />} />
        <Route path="/sales/broadcast-rules" component={() => <GenericPage title="刊播規則" />} />
        <Route path="/sales/nielsen-standards" component={() => <GenericPage title="尼爾森標準" />} />
        <Route path="/sales/broadcast-order-list" component={() => <GenericPage title="託播單列表" />} />
        <Route path="/sales/broadcast-order-edit" component={() => <GenericPage title="託播單新增／編輯" />} />
        <Route path="/sales/customer-statistics" component={() => <GenericPage title="客戶統計報表" />} />
        
        {/* TV Ad Management */}
        <Route path="/tv-ad/material-master" component={() => <GenericPage title="材料主檔" />} />
        <Route path="/tv-ad/project-materials" component={() => <GenericPage title="專案材料" />} />
        <Route path="/tv-ad/mtv-promos" component={() => <GenericPage title="MTV 宣傳帶" />} />
        <Route path="/tv-ad/agb-category" component={() => <GenericPage title="AGB 主/子分類檔管理" />} />
        <Route path="/tv-ad/material-extension" component={() => <GenericPage title="材料延申申請" />} />
        <Route path="/tv-ad/ingest-process" component={() => <GenericPage title="進帶流程管理" />} />
        <Route path="/tv-ad/red-book-update" component={() => <GenericPage title="紅本資料自動更新" />} />
        <Route path="/tv-ad/reports" component={() => <GenericPage title="廣告相關報表" />} />
        
        {/* Reports */}
        <Route path="/reports/ad-schedule" component={() => <GenericPage title="廣告排程報表" />} />
        <Route path="/reports/broadcast-result" component={() => <GenericPage title="播出結果報表" />} />
        <Route path="/reports/customer" component={() => <GenericPage title="客戶統計報表" />} />
        <Route path="/reports/system-data" component={() => <GenericPage title="系統基礎資料報表" />} />
        
        {/* Master Data Management */}
        <Route path="/master-data/company" component={() => <GenericPage title="公司資料管理" />} />
        <Route path="/master-data/department" component={() => <GenericPage title="部門資料管理" />} />
        <Route path="/master-data/employee" component={() => <GenericPage title="員工資料管理" />} />
        <Route path="/master-data/customer" component={() => <GenericPage title="客戶資料管理" />} />
        <Route path="/master-data/customer-group" component={() => <GenericPage title="客戶集團管理" />} />
        <Route path="/master-data/agent-group" component={() => <GenericPage title="代理商群組管理" />} />
        <Route path="/master-data/vendor" component={() => <GenericPage title="廠商資料管理" />} />
        <Route path="/master-data/system-settings" component={() => <GenericPage title="區域、國別、銀行等設定" />} />
        <Route path="/master-data/target-audience" component={() => <GenericPage title="目標受眾資料" />} />
        <Route path="/master-data/serial-number" component={() => <GenericPage title="使用單號碼設定" />} />
        <Route path="/master-data/contact" component={() => <GenericPage title="聯絡人資料管理" />} />
        <Route path="/master-data/material-classification" component={() => <GenericPage title="廣告材料分類規則" />} />
        <Route path="/master-data/program-type" component={() => <GenericPage title="節目類型設定" />} />
        <Route path="/master-data/ad-type" component={() => <GenericPage title="廣告類型設定" />} />
        
        {/* Account Management */}
        <Route path="/account/list" component={() => <GenericPage title="帳號列表" />} />
        <Route path="/account/role-permission" component={() => <GenericPage title="角色與權限設定" />} />
        
        {/* System Settings */}
        <Route path="/system/parameters" component={() => <GenericPage title="系統參數設定" />} />
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
