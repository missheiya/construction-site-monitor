import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  FileText, Download, Filter, Calendar as CalendarIcon, MapPin, AlertTriangle, 
  Users, TrendingDown, TrendingUp, ChevronDown, Search, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { 
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, 
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis 
} from 'recharts';

// --- 模拟数据 ---

// 周数据
const WEEK_DATA = {
  trend: [
    { date: '12-05', count: 15, prevCount: 18, critical: 3 },
    { date: '12-06', count: 12, prevCount: 14, critical: 2 },
    { date: '12-07', count: 18, prevCount: 20, critical: 5 },
    { date: '12-08', count: 8, prevCount: 10, critical: 1 },
    { date: '12-09', count: 10, prevCount: 12, critical: 2 },
    { date: '12-10', count: 6, prevCount: 8, critical: 0 },
    { date: '12-11', count: 9, prevCount: 11, critical: 2 },
  ],
  distribution: [
    { name: '未戴安全帽', value: 45, color: '#ef4444' },
    { name: '未穿反光衣', value: 30, color: '#f59e0b' },
    { name: '区域入侵', value: 15, color: '#3b82f6' },
    { name: '明火烟雾', value: 10, color: '#8b5cf6' },
  ],
  ranking: [
    { name: '基坑作业区', count: 28 },
    { name: '材料加工区', count: 22 },
    { name: '塔吊高空区', count: 18 },
    { name: '生活办公区', count: 12 },
    { name: '主体施工区', count: 8 },
  ],
  kpi: {
    total: 42,
    rate: 98.5,
    topType: '未戴安全帽',
    topArea: '基坑作业区',
    topAreaCount: 28
  }
};

// 月数据
const MONTH_DATA = {
  trend: [
    { date: '11-15', count: 45, prevCount: 40, critical: 12 },
    { date: '11-20', count: 38, prevCount: 42, critical: 8 },
    { date: '11-25', count: 52, prevCount: 48, critical: 15 },
    { date: '11-30', count: 28, prevCount: 30, critical: 5 },
    { date: '12-05', count: 35, prevCount: 32, critical: 9 },
    { date: '12-10', count: 22, prevCount: 25, critical: 4 },
  ],
  distribution: [
    { name: '未戴安全帽', value: 120, color: '#ef4444' },
    { name: '未穿反光衣', value: 85, color: '#f59e0b' },
    { name: '区域入侵', value: 45, color: '#3b82f6' },
    { name: '明火烟雾', value: 25, color: '#8b5cf6' },
  ],
  ranking: [
    { name: '基坑作业区', count: 85 },
    { name: '主体施工区', count: 62 },
    { name: '材料加工区', count: 58 },
    { name: '塔吊高空区', count: 45 },
    { name: '生活办公区', count: 32 },
  ],
  kpi: {
    total: 186,
    rate: 99.2,
    topType: '未戴安全帽',
    topArea: '基坑作业区',
    topAreaCount: 85
  }
};

// 明细表格数据 (通用)
const DETAIL_DATA = [
  { id: 'RPT-001', time: '2025-12-11 14:23', area: '基坑东侧', type: '未戴安全帽', person: '张三 (钢筋工)', team: '钢筋工三组', level: 'high', status: '已处置' },
  { id: 'RPT-002', time: '2025-12-11 13:45', area: '材料堆放区', type: '区域入侵', person: '未知人员', team: '外来人员', level: 'medium', status: '处理中' },
  { id: 'RPT-003', time: '2025-12-11 11:20', area: '塔吊1号', type: '未穿反光衣', person: '李四 (信号工)', team: '塔吊班组', level: 'high', status: '已处置' },
  { id: 'RPT-004', time: '2025-12-11 09:30', area: '加工区', type: '明火烟雾', person: '系统检测', team: '木工二组', level: 'high', status: '已处置' },
  { id: 'RPT-005', time: '2025-12-11 08:15', area: '主体施工区', type: '临边防护缺失', person: '王五 (安全员)', team: '安全巡查组', level: 'medium', status: '待确认' },
  { id: 'RPT-006', time: '2025-12-10 16:40', area: '生活区入口', type: '未戴安全帽', person: '赵六 (杂工)', team: '杂工班', level: 'medium', status: '已处置' },
  { id: 'RPT-007', time: '2025-12-10 14:10', area: '基坑西侧', type: '违规吸烟', person: '孙七 (钢筋工)', team: '钢筋工三组', level: 'medium', status: '已处置' },
];

export default function Reports() {
  const [period, setPeriod] = useState('week');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(),
    to: new Date(),
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showComparison, setShowComparison] = useState(true);

  // 根据选择的周期获取对应数据
  const currentData = period === 'month' ? MONTH_DATA : WEEK_DATA;

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    if (value === 'custom') {
      setIsCalendarOpen(true);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto pb-4">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between bg-card border border-border p-4 rounded-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-sm">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">报表中心</h1>
            <p className="text-xs text-muted-foreground">安全绩效分析与违规追溯</p>
          </div>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          一键导出报表
        </Button>
      </div>

      {/* 筛选栏 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card border border-border p-4 rounded-sm">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground ml-1">统计周期</label>
          <div className="flex gap-2">
            <Select value={period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="选择周期" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">本周</SelectItem>
                <SelectItem value="month">本月</SelectItem>
                <SelectItem value="custom">自定义</SelectItem>
              </SelectContent>
            </Select>
            
            {/* 自定义日期选择器弹出层 */}
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn(
                    "w-[40px] px-0", 
                    period !== 'custom' && "hidden"
                  )}
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range: any) => setDateRange(range)}
                  initialFocus
                  locale={zhCN}
                />
              </PopoverContent>
            </Popover>
          </div>
          {period === 'custom' && dateRange?.from && (
            <div className="text-[10px] text-primary mt-1">
              {format(dateRange.from, 'yyyy-MM-dd')} 至 {dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : '...'}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground ml-1">监控区域</label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="选择区域" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部区域</SelectItem>
              <SelectItem value="pit">基坑区</SelectItem>
              <SelectItem value="process">加工区</SelectItem>
              <SelectItem value="crane">塔吊高空</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground ml-1">违规类型</label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="选择类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="helmet">未戴安全帽</SelectItem>
              <SelectItem value="fire">明火烟雾</SelectItem>
              <SelectItem value="intrusion">越界入侵</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground ml-1">所属班组</label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="选择班组" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部班组</SelectItem>
              <SelectItem value="steel">钢筋工</SelectItem>
              <SelectItem value="wood">木工</SelectItem>
              <SelectItem value="scaffold">架子工</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 核心指标卡 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="本期违规总数" 
          value={currentData.kpi.total.toString()} 
          unit="次" 
          trend={period === 'month' ? "+15%" : "-12%"} 
          trendUp={period === 'month'} 
          icon={AlertTriangle}
          color="text-destructive"
        />
        <KPICard 
          title="报警处置率" 
          value={currentData.kpi.rate.toString()} 
          unit="%" 
          trend="+2.1%" 
          trendUp={true} 
          icon={TrendingUp}
          color="text-green-500"
        />
        <KPICard 
          title="最高频违规" 
          value={currentData.kpi.topType} 
          unit="" 
          subtext={`占比 ${period === 'month' ? '65%' : '45%'}`}
          icon={Users}
          color="text-yellow-500"
        />
        <KPICard 
          title="重点关注区域" 
          value={currentData.kpi.topArea} 
          unit="" 
          subtext={`违规 ${currentData.kpi.topAreaCount} 次`}
          icon={MapPin}
          color="text-orange-500"
        />
      </div>

      {/* 可视化图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[350px]">
        {/* 趋势图 */}
        <Card className="col-span-1 lg:col-span-2 bg-card border-border shadow-none">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              {period === 'month' ? '近30日违规数量趋势' : '近7日违规数量趋势'}
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">显示同比</span>
              <Button 
                variant="outline" 
                size="sm" 
                className={cn("h-5 w-9 p-0 rounded-full", showComparison ? "bg-primary text-primary-foreground" : "bg-muted")}
                onClick={() => setShowComparison(!showComparison)}
              >
                <span className={cn("block h-3 w-3 rounded-full bg-white shadow-sm transition-transform", showComparison ? "translate-x-4" : "translate-x-1")} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData.trend}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--muted-foreground)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--muted-foreground)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{fontSize: 12, fill: 'var(--muted-foreground)'}} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{fontSize: 12, fill: 'var(--muted-foreground)'}} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{backgroundColor: 'var(--card)', borderColor: 'var(--border)', fontSize: '12px'}}
                  itemStyle={{color: 'var(--primary)'}}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area 
                  name="本期违规"
                  type="monotone" 
                  dataKey="count" 
                  stroke="var(--primary)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
                {showComparison && (
                  <Area 
                    name="上期同期"
                    type="monotone" 
                    dataKey="prevCount" 
                    stroke="var(--muted-foreground)" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fillOpacity={1} 
                    fill="url(#colorPrev)" 
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 分布图 */}
        <Card className="col-span-1 bg-card border-border shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              各类违规占比
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentData.distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {currentData.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{backgroundColor: 'var(--card)', borderColor: 'var(--border)', fontSize: '12px'}}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  iconType="circle"
                  formatter={(value, entry: any) => (
                    <span className="text-xs text-muted-foreground ml-1">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 排行图 */}
        <Card className="col-span-1 bg-card border-border shadow-none h-[400px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              区域违规排行 (Top 5)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[330px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={currentData.ranking} margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={80}
                  tick={{fontSize: 12, fill: 'var(--muted-foreground)'}} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{fill: 'var(--muted)/20'}}
                  contentStyle={{backgroundColor: 'var(--card)', borderColor: 'var(--border)', fontSize: '12px'}}
                />
                <Bar dataKey="count" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={20}>
                  {currentData.ranking.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--destructive)' : 'var(--primary)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 违规明细表 */}
        <Card className="col-span-1 lg:col-span-2 bg-card border-border shadow-none h-[400px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              违规明细记录
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-auto h-[330px]">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>时间</TableHead>
                  <TableHead>区域</TableHead>
                  <TableHead>违规类型</TableHead>
                  <TableHead>责任人/班组</TableHead>
                  <TableHead>风险等级</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DETAIL_DATA.map((row) => (
                  <TableRow key={row.id} className="hover:bg-white/5 border-border">
                    <TableCell className="font-mono text-xs text-muted-foreground">{row.id}</TableCell>
                    <TableCell className="text-xs">{row.time}</TableCell>
                    <TableCell className="text-xs">{row.area}</TableCell>
                    <TableCell className="text-xs font-medium">{row.type}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <div>{row.person}</div>
                      <div className="text-[10px] opacity-70">{row.team}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "text-[10px] h-5 px-1.5 border-0",
                        row.level === 'high' ? "bg-destructive/20 text-destructive" : "bg-yellow-500/20 text-yellow-500"
                      )}>
                        {row.level === 'high' ? '高危' : '一般'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "text-xs flex items-center gap-1",
                        row.status === '已处置' ? "text-green-500" : 
                        row.status === '处理中' ? "text-yellow-500" : "text-muted-foreground"
                      )}>
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          row.status === '已处置' ? "bg-green-500" : 
                          row.status === '处理中' ? "bg-yellow-500" : "bg-muted-foreground"
                        )}></span>
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPICard({ title, value, unit, trend, trendUp, subtext, icon: Icon, color }: any) {
  return (
    <Card className="bg-card border-border shadow-none">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className={cn("text-2xl font-bold tracking-tight", color)}>{value}</span>
              <span className="text-xs text-muted-foreground">{unit}</span>
            </div>
            {(trend || subtext) && (
              <div className="flex items-center gap-2 mt-2">
                {trend && (
                  <Badge variant="secondary" className={cn(
                    "text-[10px] h-5 px-1 font-normal",
                    trendUp ? "text-green-500 bg-green-500/10" : "text-destructive bg-destructive/10"
                  )}>
                    {trendUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {trend}
                  </Badge>
                )}
                {subtext && <span className="text-[10px] text-muted-foreground">{subtext}</span>}
              </div>
            )}
          </div>
          <div className={cn("p-2 rounded-full bg-background/50", color)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
