import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import InteractiveTable  from '@/components/InteractiveTable'; 
// import { StatCard } from '@/components/stat-card';

export default function LoginStat() {
  return (
    <div className="flex h-[calc(100vh-65px)] overflow-hidden">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Login Statistic</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          {/* <div className="flex-1 overflow-auto p-4">
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                <StatCard title="Registed Days" value="150" />
                <StatCard title="Current Streak" value="3" />
                <StatCard title="Total Logins" value="100" />
              </div>
              <div className="flex-1 rounded-xl bg-primary-foreground p-4"></div>
            </div>
          </div> */}
        </SidebarInset>
        <InteractiveTable />
        
        
      </SidebarProvider>

      
      
    </div>
  );
}
