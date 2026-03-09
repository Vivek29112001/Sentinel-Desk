export {}

declare global {

  interface Window {

    electronAPI:{
      scanSystem:()=>Promise<any>
      getOSStatic:()=>Promise<any>
      getOSDynamic:()=>Promise<any>
      getCpuMemoryInfo:()=>Promise<any>
       getDiskUsage:()=>Promise<any>
       networkMonitor:()=>Promise<any>
       antivirusStatus:()=>Promise<any>
    }

  }

}