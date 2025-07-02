import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Play, 
  Save, 
  Send, 
  Plus, 
  Eye, 
  FolderOutput, 
  Wand2, 
  CheckCircle, 
  RotateCcw,
  Edit,
  X,
  AlertTriangle,
  Info,
  Ban
} from "lucide-react";
import { MATERIAL_TYPES } from "@/lib/constants";

interface Material {
  id: number;
  name: string;
  seconds: number;
  materialType: string;
  category?: string;
  notes?: string;
}

interface ProgramSegment {
  id: string;
  name: string;
  duration: number;
  breaks: BreakZone[];
}

interface BreakZone {
  id: number;
  number: number;
  availableSeconds: number;
  usedSeconds: number;
  materials: Material[];
}

interface LogStats {
  programDuration: string;
  adDuration: number;
  promoDuration: number;
  idDuration: number;
}

// Mock data for demonstration
const mockPrograms: ProgramSegment[] = [
  {
    id: "focus-news",
    name: "FOCUS全球新聞",
    duration: 60,
    breaks: [
      {
        id: 1,
        number: 1,
        availableSeconds: 180,
        usedSeconds: 50,
        materials: [
          {
            id: 1,
            name: "統一企業-茶裡王",
            seconds: 30,
            materialType: "C",
            category: "飲料",
          },
          {
            id: 2,
            name: "TVBS Promo",
            seconds: 20,
            materialType: "9",
            category: "自製宣傳",
          },
        ],
      },
      {
        id: 2,
        number: 2,
        availableSeconds: 180,
        usedSeconds: 0,
        materials: [],
      },
      {
        id: 3,
        number: 3,
        availableSeconds: 180,
        usedSeconds: 0,
        materials: [],
      },
    ],
  },
];

const mockAvailableMaterials: Material[] = [
  {
    id: 101,
    name: "麥當勞",
    seconds: 30,
    materialType: "C",
    category: "餐飲",
    notes: "首支100%",
  },
  {
    id: 102,
    name: "HONDA",
    seconds: 15,
    materialType: "C",
    category: "汽車",
    notes: "100%首、二、尾",
  },
  {
    id: 103,
    name: "公益廣告",
    seconds: 30,
    materialType: "G",
    category: "公益",
  },
  {
    id: 104,
    name: "娛樂百分百",
    seconds: 20,
    materialType: "9",
    category: "節目宣傳",
  },
];

export default function BreakArrangement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedChannel, setSelectedChannel] = useState("1");
  const [selectedTimeRange, setSelectedTimeRange] = useState("all");
  const [programs, setPrograms] = useState<ProgramSegment[]>(mockPrograms);
  const [availableMaterials, setAvailableMaterials] = useState<Material[]>(mockAvailableMaterials);
  const [draggedMaterial, setDraggedMaterial] = useState<Material | null>(null);
  const [progress, setProgress] = useState(45);

  // Fetch channels
  const { data: channels = [] } = useQuery({
    queryKey: ["/api/channels"],
  });

  // Fetch materials
  const { data: materials = [] } = useQuery({
    queryKey: ["/api/materials"],
  });

  // Calculate statistics
  const calculateStats = (): LogStats => {
    const totalAdSeconds = programs.reduce((total, program) => 
      total + program.breaks.reduce((breakTotal, breakZone) => 
        breakTotal + breakZone.materials
          .filter(m => m.materialType === 'C')
          .reduce((matTotal, mat) => matTotal + mat.seconds, 0), 0), 0);
    
    const totalPromoSeconds = programs.reduce((total, program) => 
      total + program.breaks.reduce((breakTotal, breakZone) => 
        breakTotal + breakZone.materials
          .filter(m => m.materialType === '9')
          .reduce((matTotal, mat) => matTotal + mat.seconds, 0), 0), 0);
    
    const totalIdSeconds = programs.reduce((total, program) => 
      total + program.breaks.reduce((breakTotal, breakZone) => 
        breakTotal + breakZone.materials
          .filter(m => m.materialType === 'I')
          .reduce((matTotal, mat) => matTotal + mat.seconds, 0), 0), 0);

    return {
      programDuration: "60:00",
      adDuration: totalAdSeconds,
      promoDuration: totalPromoSeconds,
      idDuration: totalIdSeconds,
    };
  };

  const stats = calculateStats();

  // Drag and drop handlers
  const handleDragStart = (material: Material) => {
    setDraggedMaterial(material);
  };

  const handleDragEnd = () => {
    setDraggedMaterial(null);
  };

  const handleDrop = useCallback((breakId: number, programId: string) => {
    if (!draggedMaterial) return;

    setPrograms(prevPrograms => 
      prevPrograms.map(program => {
        if (program.id !== programId) return program;
        
        return {
          ...program,
          breaks: program.breaks.map(breakZone => {
            if (breakZone.id !== breakId) return breakZone;
            
            // Check if there's enough space
            const remainingSeconds = breakZone.availableSeconds - breakZone.usedSeconds;
            if (remainingSeconds < draggedMaterial.seconds) {
              toast({
                title: "空間不足",
                description: `此破口剩餘 ${remainingSeconds} 秒，無法放入 ${draggedMaterial.seconds} 秒的素材`,
                variant: "destructive",
              });
              return breakZone;
            }

            return {
              ...breakZone,
              materials: [...breakZone.materials, draggedMaterial],
              usedSeconds: breakZone.usedSeconds + draggedMaterial.seconds,
            };
          }),
        };
      })
    );

    // Remove from available materials
    setAvailableMaterials(prev => prev.filter(m => m.id !== draggedMaterial.id));
    
    toast({
      title: "素材已加入",
      description: `${draggedMaterial.name} 已加入破口`,
    });
  }, [draggedMaterial, toast]);

  const removeMaterialFromBreak = (materialId: number, breakId: number, programId: string) => {
    let removedMaterial: Material | null = null;

    setPrograms(prevPrograms => 
      prevPrograms.map(program => {
        if (program.id !== programId) return program;
        
        return {
          ...program,
          breaks: program.breaks.map(breakZone => {
            if (breakZone.id !== breakId) return breakZone;
            
            const materialToRemove = breakZone.materials.find(m => m.id === materialId);
            if (materialToRemove) {
              removedMaterial = materialToRemove;
            }

            return {
              ...breakZone,
              materials: breakZone.materials.filter(m => m.id !== materialId),
              usedSeconds: breakZone.usedSeconds - (materialToRemove?.seconds || 0),
            };
          }),
        };
      })
    );

    if (removedMaterial) {
      setAvailableMaterials(prev => [...prev, removedMaterial]);
    }
  };

  const getMaterialTypeIcon = (type: string) => {
    const typeInfo = MATERIAL_TYPES[type as keyof typeof MATERIAL_TYPES];
    return (
      <span className={`w-5 h-5 rounded text-xs text-white flex items-center justify-center ${typeInfo?.color || 'bg-gray-500'}`}>
        {type}
      </span>
    );
  };

  const getRequirementColor = (notes?: string) => {
    if (!notes) return "text-blue-700";
    if (notes.includes("首支100%")) return "text-yellow-700";
    if (notes.includes("100%首、二、尾")) return "text-blue-700";
    return "text-red-700";
  };

  const getRequirementIcon = (notes?: string) => {
    if (!notes) return <Info className="w-3 h-3" />;
    if (notes.includes("首支100%")) return <AlertTriangle className="w-3 h-3" />;
    if (notes.includes("100%首、二、尾")) return <Info className="w-3 h-3" />;
    return <Ban className="w-3 h-3" />;
  };

  return (
    <Card className="card-enhanced">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-slate-900">破口編排 - LOG編排作業</CardTitle>
        <div className="flex space-x-3">
          <Button className="bg-green-600 hover:bg-green-700">
            <Play className="w-4 h-4 mr-2" />
            開始編排
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            儲存LOG
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <Send className="w-4 h-4 mr-2" />
            轉檔送播
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Date and Channel Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="date">編排日期</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="channel">頻道選擇</Label>
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">TVBS新聞台</SelectItem>
                <SelectItem value="2">TVBS歡樂台</SelectItem>
                <SelectItem value="3">TVBS戲劇台</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="timeRange">時段範圍</Label>
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全天 (05:00-05:00)</SelectItem>
                <SelectItem value="morning">上午 (05:00-12:00)</SelectItem>
                <SelectItem value="afternoon">下午 (12:00-18:00)</SelectItem>
                <SelectItem value="prime">黃金 (18:00-24:00)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main LOG Arrangement Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Program Schedule Column */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">節目時間軸</h3>
            <div className="bg-slate-50 rounded-lg p-4 h-96 overflow-y-auto">
              {programs.map((program) => (
                <div key={program.id} className="program-block mb-4 p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-blue-600">08:00</span>
                      <span className="text-sm font-medium text-slate-900">{program.name}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{program.duration}分</span>
                    </div>
                    <span className="text-xs text-slate-500">集數: 1234</span>
                  </div>

                  {/* ID Card */}
                  <div className="id-card mb-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-yellow-800">ID卡 - {program.name}</span>
                      <span className="text-xs text-yellow-600">10秒</span>
                    </div>
                  </div>

                  {/* Program Segments and Breaks */}
                  <div className="space-y-2">
                    {program.breaks.map((breakZone, index) => (
                      <div key={breakZone.id}>
                        {/* Program Segment */}
                        <div className="segment p-2 bg-blue-50 rounded border">
                          <span className="text-xs font-medium text-blue-800">第{index + 1}段節目 (15分)</span>
                        </div>

                        {/* Break Zone */}
                        <div
                          className="break-zone"
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.add('drag-over');
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.classList.remove('drag-over');
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('drag-over');
                            handleDrop(breakZone.id, program.id);
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-red-800">
                              第{breakZone.number}破口 ({breakZone.availableSeconds}秒可用)
                            </span>
                            <Button size="sm" variant="outline" className="text-xs">
                              <Plus className="w-3 h-3 mr-1" />
                              加入廣告
                            </Button>
                          </div>

                          {/* Existing materials in break */}
                          {breakZone.materials.length > 0 ? (
                            <div className="space-y-1">
                              {breakZone.materials.map((material) => (
                                <div key={material.id} className="ad-item flex items-center justify-between p-2 bg-green-100 rounded border">
                                  <div className="flex items-center space-x-2">
                                    {getMaterialTypeIcon(material.materialType)}
                                    <span className="text-xs font-medium">{material.name}</span>
                                    <span className="text-xs text-slate-600">{material.seconds}秒</span>
                                  </div>
                                  <div className="flex space-x-1">
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                      <Edit className="w-3 h-3 text-blue-600" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-6 w-6 p-0"
                                      onClick={() => removeMaterialFromBreak(material.id, breakZone.id, program.id)}
                                    >
                                      <X className="w-3 h-3 text-red-600" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-slate-500">拖放廣告素材到此處</div>
                          )}
                          
                          <div className="mt-2 text-xs text-slate-600">
                            已用: {breakZone.usedSeconds}秒 / 剩餘: {breakZone.availableSeconds - breakZone.usedSeconds}秒
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Materials Column */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">待編排素材</h3>
            <div className="bg-slate-50 rounded-lg p-4 h-96 overflow-y-auto">
              {availableMaterials.map((material) => (
                <div
                  key={material.id}
                  className="draggable-material mb-3 p-3 bg-white rounded-lg border border-slate-200 hover:shadow-md cursor-move"
                  draggable
                  onDragStart={() => handleDragStart(material)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getMaterialTypeIcon(material.materialType)}
                      <span className="text-sm font-medium">{material.name}</span>
                    </div>
                    <span className="text-xs text-slate-600">{material.seconds}秒</span>
                  </div>
                  {material.notes && (
                    <div className="text-xs text-slate-500 mb-2">要求: {material.notes}</div>
                  )}
                  <div className="text-xs text-blue-600">託播單: TB240125</div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics and Controls */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">編排統計</h3>
            <div className="space-y-4">
              {/* Time Statistics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">時間統計</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">節目總長</span>
                    <span className="font-medium">{stats.programDuration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">廣告總秒數</span>
                    <span className="font-medium text-green-600">{stats.adDuration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Promo秒數</span>
                    <span className="font-medium text-purple-600">{stats.promoDuration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">ID卡秒數</span>
                    <span className="font-medium text-yellow-600">{stats.idDuration}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Arrangement Rules */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">編排規則提醒</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-yellow-700">
                    <AlertTriangle className="w-3 h-3" />
                    <span>麥當勞要求首支100%</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-700">
                    <Info className="w-3 h-3" />
                    <span>HONDA可放首、二、尾</span>
                  </div>
                  <div className="flex items-center space-x-2 text-red-700">
                    <Ban className="w-3 h-3" />
                    <span>政論節目限制提醒</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">快速操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button size="sm" className="w-full">
                    <Wand2 className="w-3 h-3 mr-2" />
                    自動編排
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <CheckCircle className="w-3 h-3 mr-2" />
                    檢查規則
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <RotateCcw className="w-3 h-3 mr-2" />
                    重置編排
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-6 p-4 bg-slate-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-slate-600">編排進度:</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-slate-300 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="font-medium text-slate-900">{progress}%</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                預覽LOG
              </Button>
              <Button variant="outline" className="bg-orange-600 hover:bg-orange-700 text-white">
                <FolderOutput className="w-4 h-4 mr-2" />
                轉檔測試
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
