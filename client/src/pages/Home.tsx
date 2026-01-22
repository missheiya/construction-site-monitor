import React from 'react';
import { cn } from '@/lib/utils';
import { Activity, Shield, Users, AlertTriangle, HardHat, Truck, Eye, Zap, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// 模拟违规趋势数据
const VIOLATION_DATA = [
  { day: 'Mon', count: 12 },
  { day: 'Tue', count: 8 },
  { day: 'Wed', count: 15 },
  { day: 'Thu', count: 5 },
  { day: 'Fri', count: 9 },
  { day: 'Sat', count: 4 },
  { day: 'Sun', count: 7 },
];

export default function Home() {
  return (
    <div className="grid grid-cols-12 gap-4 h-full overflow-y-auto pb-4">
      {/* 左侧：关键指标 */}
      <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 顶部统计卡片 */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            title="安全运行天数" 
            value="128" 
            unit="天" 
            icon={Shield} 
            trend="+1" 
            trendUp 
            color="text-primary"
          />
          <StatCard 
            title="今日进场人数" 
            value="342" 
            unit="人" 
            icon={Users} 
            trend="+12" 
            trendUp 
            color="text-blue-400"
          />
          <StatCard 
            title="未处理隐患" 
            value="3" 
            unit="项" 
            icon={AlertTriangle} 
            trend="-2" 
            trendUp={false} 
            color="text-destructive"
          />
          <StatCard 
            title="大型设备在线" 
            value="12/12" 
            unit="台" 
            icon={Truck} 
            trend="100%" 
            trendUp 
            color="text-yellow-400"
          />
        </div>

        {/* 实时监控预览 (跳转入口) */}
        <div className="col-span-1 md:col-span-2 h-[400px] bg-card border border-border tactical-panel relative overflow-hidden group">
          <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
            <Link href="/video-wall">
              <Button size="lg" className="gap-2 text-lg">
                <Activity className="h-5 w-5" />
                进入监控大厅
              </Button>
            </Link>
          </div>
          
          <div className="absolute top-4 left-4 z-0 bg-black/60 px-2 py-1 rounded text-xs font-mono text-primary border border-primary/30">
            LIVE PREVIEW
          </div>

          <div className="grid grid-cols-3 grid-rows-2 h-full w-full">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-border/20 bg-black relative flex items-center justify-center">
                <div className="text-muted-foreground/20 font-mono text-sm">CAM-{String(i+1).padStart(2, '0')}</div>
                {/* 模拟噪点动画 */}
                <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==')] animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* 情况感知模块 (替换环境监测) */}
        <div className="col-span-1 bg-card border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              情况感知
            </h3>
            <span className="text-xs text-muted-foreground">实时作业状态分析</span>
          </div>
          <div className="space-y-4">
            <SituationItem label="基坑作业区" status="active" desc="人员密集施工中" count={45} />
            <SituationItem label="塔吊高空区" status="normal" desc="设备正常运转" count={3} />
            <SituationItem label="材料加工区" status="idle" desc="暂无作业活动" count={0} />
            <SituationItem label="生活办公区" status="normal" desc="人员流动正常" count={12} />
          </div>
        </div>

        {/* 违规趋势 (折线图) */}
        <div className="col-span-1 bg-card border border-border p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              本周违规趋势
            </h3>
          </div>
          <div className="flex-1 min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VIOLATION_DATA}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  tick={{fontSize: 10, fill: 'var(--muted-foreground)'}} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{fontSize: 10, fill: 'var(--muted-foreground)'}} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{backgroundColor: 'var(--card)', borderColor: 'var(--border)', fontSize: '12px'}}
                  itemStyle={{color: 'var(--primary)'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="var(--primary)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 右侧：实时动态 */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
        {/* 实时报警流 (过滤非视频类报警) */}
        <div className="bg-card border border-border flex-1 flex flex-col tactical-panel">
          <div className="p-3 border-b border-border flex justify-between items-center bg-destructive/5">
            <h3 className="font-bold text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              最新报警
            </h3>
            <Link href="/alerts">
              <Button variant="link" size="sm" className="h-auto p-0 text-xs text-muted-foreground">查看全部</Button>
            </Link>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <div className="absolute inset-0 overflow-y-auto p-2 space-y-2">
              <AlertItem time="14:23:45" title="未佩戴安全帽" location="基坑东侧" level="high" />
              <AlertItem time="14:15:20" title="区域入侵检测" location="材料堆放区" level="medium" />
              <AlertItem time="13:45:00" title="车辆违停" location="大门入口" level="low" />
              <AlertItem time="11:20:33" title="未佩戴反光衣" location="塔吊1号" level="high" />
              <AlertItem time="10:15:12" title="临边防护缺失" location="主体施工区" level="high" />
              <AlertItem time="09:30:45" title="烟火识别" location="加工区" level="high" />
            </div>
          </div>
        </div>

        {/* 人员分布 */}
        <div className="bg-card border border-border h-[300px] flex flex-col">
          <div className="p-3 border-b border-border">
            <h3 className="font-bold flex items-center gap-2">
              <HardHat className="h-4 w-4 text-primary" />
              工种分布
            </h3>
          </div>
          <div className="flex-1 p-4 space-y-3">
            <WorkerStat label="钢筋工" count={45} total={120} color="bg-blue-500" />
            <WorkerStat label="木工" count={32} total={120} color="bg-yellow-500" />
            <WorkerStat label="混凝土工" count={28} total={120} color="bg-gray-500" />
            <WorkerStat label="架子工" count={15} total={120} color="bg-orange-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, unit, icon: Icon, trend, trendUp, color }: any) {
  return (
    <Card className="bg-card border-border shadow-none">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className={cn("text-2xl font-bold font-mono", color)}>{value}</span>
              <span className="text-xs text-muted-foreground">{unit}</span>
            </div>
          </div>
          <div className={cn("p-2 rounded-full bg-background/50", color)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-center text-xs">
          <span className={cn("font-mono", trendUp ? "text-green-500" : "text-red-500")}>
            {trend}
          </span>
          <span className="text-muted-foreground ml-1">较昨日</span>
        </div>
      </CardContent>
    </Card>
  );
}

function SituationItem({ label, status, desc, count }: any) {
  const statusConfig = {
    active: { color: "text-primary", bg: "bg-primary/10", icon: Zap },
    normal: { color: "text-blue-400", bg: "bg-blue-400/10", icon: Clock },
    idle: { color: "text-muted-foreground", bg: "bg-muted", icon: Clock }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-full", config.bg)}>
          <Icon className={cn("h-4 w-4", config.color)} />
        </div>
        <div>
          <div className="font-bold text-sm">{label}</div>
          <div className="text-xs text-muted-foreground">{desc}</div>
        </div>
      </div>
      <div className="text-right">
        <div className={cn("font-mono font-bold", config.color)}>{count > 0 ? `${count}人` : '-'}</div>
        <Badge variant="outline" className={cn("text-[10px] h-4 px-1 border-0 bg-transparent", config.color)}>
          {status.toUpperCase()}
        </Badge>
      </div>
    </div>
  );
}

function AlertItem({ time, title, location, level }: any) {
  const colors = {
    high: "border-l-destructive bg-destructive/5",
    medium: "border-l-yellow-500 bg-yellow-500/5",
    low: "border-l-blue-500 bg-blue-500/5"
  };

  return (
    <div className={cn("p-2 border-l-2 text-sm flex justify-between items-center hover:bg-white/5 cursor-pointer transition-colors", colors[level as keyof typeof colors])}>
      <div>
        <div className="font-bold">{title}</div>
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span>{time}</span>
          <span>•</span>
          <span>{location}</span>
        </div>
      </div>
      <Badge variant="outline" className="text-[10px] h-5 px-1">
        {level === 'high' ? '高危' : level === 'medium' ? '警告' : '提示'}
      </Badge>
    </div>
  );
}

function WorkerStat({ label, count, total, color }: any) {
  const percent = (count / total) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span className="font-mono">{count}人</span>
      </div>
      <div className="h-1.5 bg-background rounded-full overflow-hidden">
        <div className={cn("h-full", color)} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}
