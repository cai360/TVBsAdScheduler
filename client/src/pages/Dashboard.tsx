import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp, Server, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface DashboardStats {
  pendingOrders: number;
  completedLogs: number;
  pendingApproval: number;
  monthlyRevenue: number;
  totalSeconds: number;
  avgCPRP: number;
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 bg-slate-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Today's Schedule Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="card-enhanced">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900">今日排程</CardTitle>
            <Calendar className="h-8 w-8 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">待編排託播單</span>
                <span className="font-bold text-red-600">{stats?.pendingOrders || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">已完成LOG</span>
                <span className="font-bold text-green-600">{stats?.completedLogs || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">待審核排期</span>
                <span className="font-bold text-yellow-600">{stats?.pendingApproval || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900">廣告統計</CardTitle>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">本月廣告收入</span>
                <span className="font-bold text-green-600">
                  ${stats?.monthlyRevenue?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">播出總秒數</span>
                <span className="font-bold text-blue-600">
                  {stats?.totalSeconds?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">平均CPRP</span>
                <span className="font-bold text-purple-600">
                  {stats?.avgCPRP?.toLocaleString() || '0'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900">系統狀態</CardTitle>
            <Server className="h-8 w-8 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">播控系統</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">正常</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">尼爾森數據</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">已更新</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">紅木監控</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">維護中</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">最近活動</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 hover:bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">排期單 #25000123 已建立</p>
                <p className="text-sm text-slate-600">客戶：ABC廣告公司 - 2分鐘前</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 hover:bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">LOG編排已完成</p>
                <p className="text-sm text-slate-600">TVBS新聞台 12/15 - 5分鐘前</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 hover:bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">託播單需要審核</p>
                <p className="text-sm text-slate-600">託播單 #TB240001 - 8分鐘前</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Announcements */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">系統公告</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
              <h4 className="font-medium text-blue-900">系統維護通知</h4>
              <p className="text-sm text-blue-700 mt-1">
                系統將於12/20 02:00-04:00進行例行維護，期間部分功能可能暫停服務。
              </p>
            </div>
            <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
              <h4 className="font-medium text-green-900">新功能上線</h4>
              <p className="text-sm text-green-700 mt-1">
                LOG編排作業新增自動化破口插入功能，提升編排效率。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
