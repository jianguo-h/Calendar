/* declare const styles: {
  "calendar": () => string,
  "calendar-mask": () => string,
  "calendar-content": (modifiers?: { 
    "slideUp"?: boolean,
    "slideDown"?: boolean 
  }) => string,
  "calendar-title": () => string,
  "calendar-format": () => string,
  "calendar-list": () => string,
  "selected": () => string,
}
export = styles; */

// 参考 https://github.com/Microsoft/TypeScript/issues/2709
declare function require(name: string): any;