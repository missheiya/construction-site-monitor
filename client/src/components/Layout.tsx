import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  Map, 
  AlertTriangle, 
  Video, 
  FileText, 
  Settings, 
  LogOut, 
  Bell, 
  Menu,
  Maximize2,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const navItems = [
    { icon: LayoutDashboard, label: '总览', path: '/' },
    { icon: Video, label: '视频墙', path: '/video-wall' },
    { icon: Map, label: '电子地图', path: '/map' },
    { icon: AlertTriangle, label: '报警中心', path: '/alerts' },
    { icon: FileText, label: '报表中心', path: '/reports' },
    { icon: Settings, label: '设备管理', path: '/devices' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* 顶部导航栏 (Header) */}
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 z-50 relative">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-primary hover:text-primary hover:bg-primary/10"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary/20 border border-primary flex items-center justify-center">
              <div className="h-4 w-4 bg-primary rotate-45"></div>
            </div>
            <h1 className="text-xl font-bold tracking-wider text-primary font-mono uppercase">
              Site<span className="text-foreground">Monitor</span> <span className="text-xs align-top opacity-70">PRO</span>
            </h1>
          </div>
        </div>

        {/* 核心状态显示区 */}
        <div className="hidden md:flex items-center gap-8">
          <StatusItem label="今日报警" value="12" color="text-destructive" />
          <StatusItem label="在线设备" value="45/48" color="text-primary" />
          <StatusItem label="重大风险" value="0" color="text-foreground" />
        </div>

        {/* 全局功能键 & 用户信息 */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
            <Maximize2 className="h-5 w-5" />
          </Button>
          <div className="relative">
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
              <Bell className="h-5 w-5" />
            </Button>
            <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full animate-pulse"></span>
          </div>
          
          <div className="h-8 w-[1px] bg-border mx-2"></div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-primary">Admin</div>
              <div className="text-xs text-muted-foreground">安全主管</div>
            </div>
            <Button variant="outline" size="icon" className="rounded-full border-primary/50 text-primary hover:bg-primary/10">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* 装饰性扫描线 */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* 左侧边栏 (Sidebar) */}
        <aside 
          className={cn(
            "w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 absolute z-40 h-full md:relative",
            !isSidebarOpen && "-translate-x-full md:translate-x-0 md:w-16"
          )}
        >
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link href={item.path}>
                    <div className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-sm transition-colors group relative overflow-hidden cursor-pointer",
                      location === item.path 
                        ? "bg-primary/10 text-primary border-l-2 border-primary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}>
                      <item.icon className={cn("h-5 w-5 shrink-0", location === item.path && "animate-pulse")} />
                      <span className={cn(
                        "font-medium tracking-wide transition-opacity duration-200 whitespace-nowrap",
                        !isSidebarOpen && "md:opacity-0 md:w-0 md:hidden"
                      )}>
                        {item.label}
                      </span>
                      {location === item.path && (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"></div>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* 工地分区导航 (仅展开时显示) */}
            <div className={cn("mt-8 px-4", !isSidebarOpen && "md:hidden")}>
              <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4 flex items-center">
                <span className="w-2 h-2 bg-primary/50 mr-2 rounded-full"></span>
                监控区域
              </h3>
              <div className="space-y-1 border-l border-border ml-1 pl-3">
                <ZoneItem label="大门区" count={4} active />
                <ZoneItem label="办公生活区" count={8} />
                <ZoneItem label="加工区" count={6} />
                <ZoneItem label="基坑区" count={12} alert />
                <ZoneItem label="主体施工区" count={10} />
                <ZoneItem label="塔吊高空" count={5} />
              </div>
            </div>
          </nav>
          
          {/* 底部系统信息 */}
          <div className={cn("p-4 border-t border-border text-xs text-muted-foreground font-mono", !isSidebarOpen && "md:hidden")}>
            <div className="flex justify-between mb-1">
              <span>SYS: ONLINE</span>
              <span className="text-primary">98%</span>
            </div>
            <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[98%]"></div>
            </div>
            <div className="mt-2 opacity-50">V 2.4.0 BUILD 20251211</div>
          </div>
        </aside>

        {/* 主工作区 (Main Content) */}
        <main className="flex-1 overflow-hidden bg-background relative flex flex-col">
          {/* 顶部装饰角标 */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/30 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/30 pointer-events-none"></div>
          
          <div className="flex-1 overflow-auto p-4 relative z-10">
            {children}
          </div>

          {/* 底部状态栏 (Footer) */}
          <footer className="h-8 bg-card border-t border-border flex items-center justify-between px-4 text-xs font-mono text-muted-foreground z-20">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                NETWORK: STABLE (12ms)
              </span>
              <span>STORAGE: 45TB / 120TB</span>
            </div>
            <div className="flex items-center gap-4">
              <span>REC: <span className="text-destructive">● RECORDING</span></span>
              <span>2025-12-11 14:32:45 UTC+8</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

function StatusItem({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className={cn("text-lg font-mono font-bold leading-none", color)}>{value}</span>
    </div>
  );
}

function ZoneItem({ label, count, active = false, alert = false }: { label: string, count: number, active?: boolean, alert?: boolean }) {
  return (
    <div className={cn(
      "flex items-center justify-between py-1.5 px-2 rounded cursor-pointer hover:bg-white/5 transition-colors text-sm",
      active ? "text-foreground bg-white/5" : "text-muted-foreground",
      alert && "text-destructive"
    )}>
      <span>{label}</span>
      <span className={cn(
        "text-xs font-mono px-1.5 py-0.5 rounded bg-secondary",
        alert ? "bg-destructive/20 text-destructive" : "text-muted-foreground"
      )}>{count}</span>
    </div>
  );
}
