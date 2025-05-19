"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/expand-ui/card"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { useApi } from "@/contexts/api-context"
import { Button } from "@/components/expand-ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/expand-ui/tabs"
import { Progress } from "@/components/expand-ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/expand-ui/table"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/expand-ui/form"
import { Input } from "@/components/expand-ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/expand-ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"

export default function ExpandPage() {
  const { api, isLoading: globalLoading, setLoading: setGlobalLoading, setError } = useApi()
  // const api = useApi()
  const { toast } = useToast()

  const [ipPools, setIpPools] = useState<any[]>([])
  const [selectedService, setSelectedService] = useState<string>("")
  const [usedIPs, setUsedIPs] = useState<any[]>([])

  // Separate loading states
  const [loadingPools, setLoadingPools] = useState(true)
  const [loadingUsedIPs, setLoadingUsedIPs] = useState(false)
  const [availableServices, setAvailableServices] = useState<string[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        setLoadingPools(true)

        // Fetch all IP pools
        const pools = await api.getAllIpPools()
        setIpPools(pools)

        // Extract unique services from pools
        const services = [...new Set(pools.map((pool: any) => pool.service))]
        setAvailableServices(services)

        // If we have services and none is selected, select the first one
        if (services.length > 0 && !selectedService) {
          setSelectedService(services[0])
          fetchUsedIPs(services[0])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoadingPools(false)
      }
    }

    fetchData()
  }, [api, setError, selectedService])

  const fetchUsedIPs = async (service: string) => {
    if (!service) return

    try {
      setLoadingUsedIPs(true)
      const ips = await api.getUsedIp(service)
      setUsedIPs(ips)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setUsedIPs([])
    } finally {
      setLoadingUsedIPs(false)
    }
  }

  const handleServiceChange = (service: string) => {
    setSelectedService(service)
    fetchUsedIPs(service)
  }

  // IP Pool creation form schema
  const createIpPoolSchema = z.object({
    service: z.string().min(1, "Service is required"),
    subnet: z.string().min(1, "Subnet is required"),
  })

  // Form for creating an IP pool
  const ipPoolForm = useForm<z.infer<typeof createIpPoolSchema>>({
    resolver: zodResolver(createIpPoolSchema),
    defaultValues: {
      service: "",
      subnet: "",
    },
  })

  const onSubmitIpPool = async (data: z.infer<typeof createIpPoolSchema>) => {
    try {
      setGlobalLoading(true)
      await api.createIpPool(data)
      toast({
        title: "Success",
        description: "IP pool created successfully",
      })
      ipPoolForm.reset()

      // Refresh IP pools
      const pools = await api.getAllIpPools()
      setIpPools(pools)

      // Update available services
      const services = [...new Set(pools.map((pool: any) => pool.service))]
      setAvailableServices(services)
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setGlobalLoading(false)
    }
  }

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return "bg-red-500"
    if (usage >= 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getUsageTextColor = (usage: number) => {
    if (usage >= 90) return "text-red-500"
    if (usage >= 70) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">IP Management</h2>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">IP Pools Overview</TabsTrigger>
            <TabsTrigger value="usage">IP Usage</TabsTrigger>
            <TabsTrigger value="create">Create IP Pool</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>IP Pools</CardTitle>
                <CardDescription>Overview of all IP pools and their usage</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPools ? (
                  <div className="text-center py-8">Loading...</div>
                ) : ipPools.length === 0 ? (
                  <div className="text-center py-8">No IP pools found</div>
                ) : (
                  <div className="space-y-6">
                    {ipPools.map((pool) => {
                      const usagePercent = (pool.usedIPs / pool.totalIPs) * 100
                      return (
                        <div key={pool.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-lg font-medium">{pool.service}</h3>
                              <p className="text-sm text-muted-foreground">{pool.subnet || pool.cidrBlock}</p>
                            </div>
                            <div className={`text-sm font-medium ${getUsageTextColor(usagePercent)}`}>
                              {pool.usedIPs} / {pool.totalIPs} ({Math.round(usagePercent)}%)
                            </div>
                          </div>
                          <Progress
                            value={usagePercent}
                            className="h-2"
                            indicatorClassName={getUsageColor(usagePercent)}
                          />
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>IP Usage</CardTitle>
                <CardDescription>View used IPs for a specific service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="w-64">
                    <label className="text-sm font-medium">Service</label>
                    <Select value={selectedService} onValueChange={handleServiceChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingPools ? (
                          <SelectItem value="loading" disabled>
                            Loading services...
                          </SelectItem>
                        ) : availableServices.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No services available
                          </SelectItem>
                        ) : (
                          availableServices.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedService && (
                    <div>
                      {loadingUsedIPs ? (
                        <div className="text-center py-8">Loading...</div>
                      ) : usedIPs.length === 0 ? (
                        <div className="text-center py-8">No used IPs found for this service</div>
                      ) : (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>IP Address</TableHead>
                                <TableHead>Server</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {usedIPs.map((ip, index) => (
                                <TableRow key={index}>
                                  <TableCell>{ip.ip}</TableCell>
                                  <TableCell>{ip.server}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create IP Pool</CardTitle>
                <CardDescription>Add a new IP pool for a service</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...ipPoolForm}>
                  <form onSubmit={ipPoolForm.handleSubmit(onSubmitIpPool)} className="space-y-4">
                    <FormField
                      control={ipPoolForm.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Web">Web</SelectItem>
                              <SelectItem value="Database">Database</SelectItem>
                              <SelectItem value="Application">Application</SelectItem>
                              <SelectItem value="Storage">Storage</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={ipPoolForm.control}
                      name="subnet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subnet</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 192.168.1.0/24" {...field} />
                          </FormControl>
                          <FormDescription>Enter the subnet in CIDR notation</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={globalLoading}>
                      {globalLoading ? "Creating..." : "Create IP Pool"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
