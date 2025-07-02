import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Save, Check, Calculator, Clock, Target, DollarSign } from "lucide-react";
import { TIME_SLOTS, SPOT_TYPES, TARGET_AUDIENCES } from "@/lib/constants";

const schedulingFormSchema = z.object({
  materialId: z.number().optional(),
  customerId: z.number().min(1, "請選擇客戶"),
  agentId: z.number().optional(),
  salespersonId: z.number().min(1, "請選擇業務員"),
  startDate: z.string().min(1, "請選擇起排日期"),
  endDate: z.string().min(1, "請選擇終止日期"),
  cprpTarget: z.number().optional(),
  sharePercentage: z.number().optional(),
  targetAudience: z.array(z.string()).optional(),
  ptTimeSlots: z.array(z.string()).optional(),
  ptPercentage: z.number().optional(),
  spotNumbers: z.array(z.string()).optional(),
  pibPercentage: z.number().optional(),
  schedulingNotes: z.string().optional(),
});

type SchedulingFormData = z.infer<typeof schedulingFormSchema>;

export default function SchedulingCreate() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [selectedSpotTypes, setSelectedSpotTypes] = useState<string[]>([]);
  const [selectedTargetAudiences, setSelectedTargetAudiences] = useState<string[]>([]);

  const form = useForm<SchedulingFormData>({
    resolver: zodResolver(schedulingFormSchema),
    defaultValues: {
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      targetAudience: [],
      ptTimeSlots: [],
      spotNumbers: [],
    },
  });

  // Fetch customers
  const { data: customers = [] } = useQuery({
    queryKey: ["/api/customers"],
  });

  // Fetch employees
  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"],
  });

  // Fetch materials
  const { data: materials = [] } = useQuery({
    queryKey: ["/api/materials"],
  });

  // Create scheduling order mutation
  const createSchedulingOrderMutation = useMutation({
    mutationFn: async (data: SchedulingFormData) => {
      const response = await apiRequest("POST", "/api/scheduling-orders", {
        ...data,
        targetAudience: JSON.stringify(selectedTargetAudiences),
        ptTimeSlots: JSON.stringify(selectedTimeSlots),
        spotNumbers: JSON.stringify(selectedSpotTypes),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "成功",
        description: "排期單建立成功",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/scheduling-orders"] });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "錯誤",
        description: "建立排期單失敗: " + error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SchedulingFormData) => {
    createSchedulingOrderMutation.mutate(data);
  };

  const customerOptions = customers?.filter((c: any) => c.type === '1.客戶') || [];
  const agentOptions = customers?.filter((c: any) => c.type === '2.代理商') || [];

  return (
    <Card className="card-enhanced">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-slate-900">排期單建立</CardTitle>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => form.reset()}>
            <Save className="w-4 h-4 mr-2" />
            儲存草稿
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={createSchedulingOrderMutation.isPending}
          >
            <Check className="w-4 h-4 mr-2" />
            {createSchedulingOrderMutation.isPending ? "處理中..." : "送出審核"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="materialId">材料名稱</Label>
              <Select onValueChange={(value) => form.setValue('materialId', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇或輸入材料名稱" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((material: any) => (
                    <SelectItem key={material.id} value={material.id.toString()}>
                      {material.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="customerId">客戶 <span className="text-red-500">*</span></Label>
              <Select onValueChange={(value) => form.setValue('customerId', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="請選擇客戶" />
                </SelectTrigger>
                <SelectContent>
                  {customerOptions.map((customer: any) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.customerId && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.customerId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="agentId">代理商</Label>
              <Select onValueChange={(value) => form.setValue('agentId', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="請選擇代理商" />
                </SelectTrigger>
                <SelectContent>
                  {agentOptions.map((agent: any) => (
                    <SelectItem key={agent.id} value={agent.id.toString()}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="salespersonId">業務員 <span className="text-red-500">*</span></Label>
              <Select onValueChange={(value) => form.setValue('salespersonId', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="請選擇業務員" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee: any) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.salespersonId && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.salespersonId.message}</p>
              )}
            </div>
          </div>

          {/* Schedule Period */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="startDate">起排日期 <span className="text-red-500">*</span></Label>
              <Input
                type="date"
                {...form.register('startDate')}
              />
              {form.formState.errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.startDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="endDate">終止日期 <span className="text-red-500">*</span></Label>
              <Input
                type="date"
                {...form.register('endDate')}
              />
              {form.formState.errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Target and Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="cprpTarget">CPRP目標</Label>
              <Input
                type="number"
                placeholder="7000"
                {...form.register('cprpTarget', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="sharePercentage">SHARE %</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="15.5"
                {...form.register('sharePercentage', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label>目標受眾 (TARGET)</Label>
              <div className="space-y-2 max-h-24 overflow-y-auto border rounded p-2">
                {TARGET_AUDIENCES.map((audience) => (
                  <div key={audience.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={audience.value}
                      checked={selectedTargetAudiences.includes(audience.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTargetAudiences([...selectedTargetAudiences, audience.value]);
                        } else {
                          setSelectedTargetAudiences(selectedTargetAudiences.filter(ta => ta !== audience.value));
                        }
                      }}
                    />
                    <Label htmlFor={audience.value} className="text-sm">{audience.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prime Time Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label>PT時段選擇</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {TIME_SLOTS.slice(13, 19).map((slot) => (
                  <div key={slot} className="flex items-center space-x-1">
                    <Checkbox
                      id={`slot-${slot}`}
                      checked={selectedTimeSlots.includes(slot)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTimeSlots([...selectedTimeSlots, slot]);
                        } else {
                          setSelectedTimeSlots(selectedTimeSlots.filter(ts => ts !== slot));
                        }
                      }}
                    />
                    <Label htmlFor={`slot-${slot}`} className="text-sm">{slot}</Label>
                  </div>
                ))}
              </div>
              <Input
                type="number"
                placeholder="PT百分比 %"
                className="mt-2"
                {...form.register('ptPercentage', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label>支數/PIB設定</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-4">
                  {SPOT_TYPES.map((spot) => (
                    <div key={spot.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={spot.value}
                        checked={selectedSpotTypes.includes(spot.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSpotTypes([...selectedSpotTypes, spot.value]);
                          } else {
                            setSelectedSpotTypes(selectedSpotTypes.filter(st => st !== spot.value));
                          }
                        }}
                      />
                      <Label htmlFor={spot.value} className="text-sm">{spot.label}</Label>
                    </div>
                  ))}
                </div>
                <Input
                  type="number"
                  placeholder="PIB百分比 %"
                  {...form.register('pibPercentage', { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="schedulingNotes">排期備註</Label>
            <Textarea
              placeholder="PT40%,W:6/7-6/9+6/20-6/22+6/27-6/29 各$11.5萬(三天+1000)"
              {...form.register('schedulingNotes')}
            />
          </div>
        </form>

        {/* Real-time Statistics */}
        <div className="mt-8 p-4 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            即時統計
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="w-5 h-5 text-blue-600 mr-1" />
                <p className="text-2xl font-bold text-blue-600">$0</p>
              </div>
              <p className="text-sm text-slate-600">金額合計</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-green-600 mr-1" />
                <p className="text-2xl font-bold text-green-600">0%</p>
              </div>
              <p className="text-sm text-slate-600">已用秒數佔比</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-5 h-5 text-yellow-600 mr-1" />
                <p className="text-2xl font-bold text-yellow-600">0</p>
              </div>
              <p className="text-sm text-slate-600">預估GRP</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Calculator className="w-5 h-5 text-purple-600 mr-1" />
                <p className="text-2xl font-bold text-purple-600">0</p>
              </div>
              <p className="text-sm text-slate-600">預估CPRP</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
