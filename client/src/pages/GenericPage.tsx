import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Wrench } from "lucide-react";
import { Link } from "wouter";

interface GenericPageProps {
  title: string;
  description?: string;
}

export default function GenericPage({ 
  title, 
  description = "此功能正在開發中，敬請期待。" 
}: GenericPageProps) {
  return (
    <Card className="card-enhanced">
      <CardContent className="p-8 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wrench className="w-12 h-12 text-slate-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-4">{title}</h2>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">{description}</p>
        
        <div className="flex justify-center space-x-4">
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首頁
            </Button>
          </Link>
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            聯絡開發團隊
          </Button>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <p className="text-sm text-blue-700">
            <strong>開發進度：</strong>此功能將在後續版本中提供完整的操作界面和功能。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
