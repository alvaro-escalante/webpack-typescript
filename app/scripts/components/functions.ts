// Helper functions to manipulate DOM, format numbers, debounce, etc

// Select single element
export const select = (el: any) => document.querySelector(el)

// Select Nodelist array of elements
export const selectAll = (els: any) => document.querySelectorAll(els)

// Select elements by id
export const getId = (id: string) => document.getElementById(id)

// Capitalise string
export const caps = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export const each = (array: string | any[], callback: { (e: any): any; call?: any }) => {
  for (let i = 0, j = array.length; i < j; i++) callback.call(i, array[i])
}

export const rect = (el: { getBoundingClientRect: () => any }) => el.getBoundingClientRect()

export const getHeight = (el: {
  getBoundingClientRect: () => { (): any; new (): any; height: any }
}) => el.getBoundingClientRect().height

export const body = document.body

export const html = document.documentElement

export const debounce = (
  callback: { apply: (arg0: any, arg1: IArguments) => void },
  ms: number
) => {
  let timer: NodeJS.Timeout
  return function() {
    const self = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => callback.apply(self, args), ms)
  }
}
// Multi addEventListener, takes multiple parameters ('click load change etc')
export const listen = (
  el: { addEventListener: (arg0: any, arg1: any, arg2: boolean) => any },
  s: string,
  fn: any
) => each(s.split(' '), e => el.addEventListener(e, fn, false))
