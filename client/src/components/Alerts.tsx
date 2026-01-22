import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, XCircle, Clock, MapPin, Filter, Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  location: string;
  time: string;
  status: 'pending' | 'processing' | 'resolved';
  image?: string;
}

const MOCK_ALERTS: Alert[] = [
  { id: 'ALT-20251211-001', type: 'critical', title: '未佩戴安全帽', location: '基坑东侧', time: '14:23:45', status: 'pending' },
  { id: 'ALT-20251211-002', type: 'warning', title: '区域入侵检测', location: '材料堆放区', time: '14:15:20', status: 'processing' },
  { id: 'ALT-20251211-003', type: 'critical', title: '明火烟雾检测', location: '加工区', time: '13:50:12', status: 'resolved' },
  { id: 'ALT-20251211-004', type: 'info', title: '车辆违停', location: '大门入口', time: '13:45:00', status: 'resolved' },
  { id: 'ALT-20251211-006', type: 'critical', title: '未佩戴反光衣', location: '塔吊1号', time: '11:20:33', status: 'resolved' },
  { id: 'ALT-20251211-007', type: 'critical', title: '临边防护缺失', location: '主体施工区', time: '10:15:12', status: 'resolved' },
];

export default function Alerts() {
  const [selectedAlert, setSelectedAlert] = React.useState<Alert | null>(MOCK_ALERTS[0]);
  const [filterStatus, setFilterStatus] = React.useState<string>('all');

  const filteredAlerts = React.useMemo(() => {
    if (filterStatus === 'all') return MOCK_ALERTS;
    if (filterStatus === 'pending') return MOCK_ALERTS.filter(a => a.status === 'pending' || a.status === 'processing');
    if (filterStatus === 'resolved') return MOCK_ALERTS.filter(a => a.status === 'resolved');
    return MOCK_ALERTS;
  }, [filterStatus]);

  return (
    <div className="h-full flex gap-4">
      {/* 左侧：报警列表 */}
      <div className="w-1/3 min-w-[350px] flex flex-col bg-card border border-border tactical-panel">
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-mono flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              实时报警中心
            </h2>
            <Badge variant="destructive" className="animate-pulse">
              {MOCK_ALERTS.filter(a => a.status === 'pending').length} 待处理
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="搜索报警记录..." className="pl-8 bg-background/50 border-border" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setFilterStatus}>
            <TabsList className="w-full grid grid-cols-3 bg-background/50">
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="pending" className="text-destructive">待处理</TabsTrigger>
              <TabsTrigger value="resolved">已解决</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={cn(
                    "p-4 border-b border-border cursor-pointer hover:bg-white/5 transition-colors flex gap-3 relative overflow-hidden",
                    selectedAlert?.id === alert.id && "bg-white/5 border-l-2 border-l-primary"
                  )}
                  onClick={() => setSelectedAlert(alert)}
                >
                  {/* 状态指示条 */}
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1",
                    alert.type === 'critical' ? "bg-destructive" :
                    alert.type === 'warning' ? "bg-yellow-500" : "bg-blue-500"
                  )}></div>

                  <div className="mt-1">
                    {alert.type === 'critical' ? <AlertTriangle className="h-5 w-5 text-destructive" /> :
                     alert.type === 'warning' ? <AlertTriangle className="h-5 w-5 text-yellow-500" /> :
                     <CheckCircle className="h-5 w-5 text-blue-500" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold truncate">{alert.title}</span>
                      <span className="text-xs font-mono text-muted-foreground">{alert.time}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {alert.location}
                      </span>
                      <Badge variant="outline" className={cn(
                        "text-[10px] h-5 px-1.5",
                        alert.status === 'pending' ? "border-destructive text-destructive" :
                        alert.status === 'processing' ? "border-yellow-500 text-yellow-500" :
                        "border-green-500 text-green-500"
                      )}>
                        {alert.status === 'pending' ? '待处理' :
                         alert.status === 'processing' ? '处理中' : '已归档'}
                      </Badge>
                    </div>
                  </div>
                  
                  {selectedAlert?.id === alert.id && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-primary">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p>暂无相关报警记录</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* 右侧：报警详情 */}
      <div className="flex-1 bg-card border border-border tactical-panel flex flex-col">
        {selectedAlert ? (
          <>
            <div className="p-4 border-b border-border flex justify-between items-center bg-white/5">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="text-primary font-mono">#{selectedAlert.id}</span>
                  {selectedAlert.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {selectedAlert.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {selectedAlert.location}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="destructive" className="gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  立即处置
                </Button>
                <Button variant="outline" className="gap-2">
                  <XCircle className="h-4 w-4" />
                  标记误报
                </Button>
              </div>
            </div>

            <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
              {/* 报警快照 */}
              <div className="aspect-video bg-black relative border border-border group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
                    <AlertTriangle className="h-16 w-16" />
                    <span className="font-mono text-xl tracking-widest">ALARM SNAPSHOT</span>
                  </div>
                </div>
                
                {/* 底部时间戳 */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs font-mono text-white flex justify-between">
                  <span>CAM-03: {selectedAlert.location}</span>
                  <span>{selectedAlert.time}</span>
                </div>
              </div>

              {/* 处置流程 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-border bg-background/50">
                  <h4 className="font-bold mb-2 text-sm uppercase text-muted-foreground">事件详情</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-border/50 pb-1">
                      <span className="text-muted-foreground">报警类型</span>
                      <span>AI视觉分析</span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-1">
                      <span className="text-muted-foreground">风险等级</span>
                      <span className={selectedAlert.type === 'critical' ? 'text-destructive' : 'text-yellow-500'}>
                        {selectedAlert.type === 'critical' ? '高风险 (Critical)' : '中风险 (Warning)'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-1">
                      <span className="text-muted-foreground">关联设备</span>
                      <span className="font-mono text-primary cursor-pointer hover:underline">CAM-03</span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-1">
                      <span className="text-muted-foreground">责任人</span>
                      <span>李四 (安全员)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-border bg-background/50">
                  <h4 className="font-bold mb-2 text-sm uppercase text-muted-foreground">处置记录</h4>
                  <div className="space-y-4 relative pl-4 border-l border-border ml-2">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary"></div>
                      <div className="text-xs text-muted-foreground mb-0.5">{selectedAlert.time}</div>
                      <div className="text-sm">系统自动触发报警</div>
                    </div>
                    {selectedAlert.status !== 'pending' && (
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                        <div className="text-xs text-muted-foreground mb-0.5">14:25:00</div>
                        <div className="text-sm">控制中心下发通知</div>
                      </div>
                    )}
                    {selectedAlert.status === 'resolved' && (
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        <div className="text-xs text-muted-foreground mb-0.5">14:30:00</div>
                        <div className="text-sm">现场整改完毕，报警解除</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>请选择一条报警记录查看详情</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
