export {}

declare global {

  interface Window {

    electronAPI:{
      scanSystem:()=>Promise<any>
    }

  }

}