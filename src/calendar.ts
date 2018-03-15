// require less
require('./calendar.less');
// interface define
interface Defaults {
  el: string;
  format: string;
  range: number;
  readonly: boolean;
  onCancel: any;
  onConfirm: any;
}
// class define
class Calendar {
  private opts: Defaults;
  private defaults: Defaults = {
    el: '#calendar',                    // 作用于的元素节点, 同css选择器, eg: #calendar, .calendar
    format: 'yyyy-MM-dd',               // 设置的日期格式, 默认'yyyy-MM-dd', 可选'yyyy-MM', 'yyyy'
    range: 100,                         // 年数的范围, 默认100, 最小为3
    readonly: true,                     // 是否只读(只有当节点为input时有效)
    onCancel: null,                     // 取消的回调函数, 默认为null
    onConfirm: null                     // 确定的回调函数, 默认为null
  };
  selectedYear: number = new Date().getFullYear();          // 选择的年份
  selectedMonth: number = new Date().getMonth() + 1;        // 选择的月份
  selectedDay: number = new Date().getDate();               // 选择的日期
  calendarDom: HTMLElement = document.createElement('div');
  calendarContentDom: HTMLElement = document.createElement('div');
  startY: number;
  // 构造函数
  constructor(opts?: object) {
    this.opts = Object.assign({}, this.defaults, opts);
    this.init();
  }
  // 初始化
  init(): void {
    const formatArr: string[] = ['yyyy-MM-dd', 'yyyy-MM', 'yyyy'];
    const { readonly, el } : { readonly: boolean, el: string } = this.opts;
    const format: string = formatArr.includes(this.opts.format) ? this.opts.format : this.defaults.format;
    const target: HTMLElement = document.querySelector(el);

    if(!target) {
      throw new Error('not find dom through el:' + el);
    }
    if(target.tagName.toLowerCase() === 'input') {
      // target.readOnly = readonly;
      target.setAttribute('readonly', readonly.toString());
    }

    const calendarMaskDom: HTMLElement = document.createElement('div');
    const calendarTitleDom: HTMLElement = document.createElement('div');
    const { calendarFormatDom, calendarListDom }: { calendarFormatDom: HTMLElement, calendarListDom: HTMLElement } = this.createFormat(format);
    const calendarCancelDom: HTMLElement = document.createElement('span');
    const calendarConfirmDom: HTMLElement = document.createElement('span');

    this.calendarDom.className = 'calendar';
    calendarMaskDom.className = 'calendar-mask';
    this.calendarContentDom.className = 'calendar-content';
    calendarTitleDom.className = 'calendar-title';
    calendarCancelDom.className = 'calendar-cancel';
    calendarConfirmDom.className = 'calendar-confirm';
    calendarCancelDom.textContent = '取消';
    calendarConfirmDom.textContent = '确定';

    calendarTitleDom.appendChild(calendarCancelDom);
    calendarTitleDom.appendChild(calendarConfirmDom);
    this.calendarContentDom.appendChild(calendarTitleDom);
    this.calendarContentDom.appendChild(calendarFormatDom);
    this.calendarContentDom.appendChild(calendarListDom);
    this.calendarDom.appendChild(calendarMaskDom);
    this.calendarDom.appendChild(this.calendarContentDom);

    target.addEventListener('touchstart', () => {
      this.appendToBody();
    });
    calendarCancelDom.addEventListener('touchstart', () => {
      this.cancel();
    });
    calendarConfirmDom.addEventListener('touchstart', () => {
      this.confirm();
    });
  }
  // 根据日期格式 format 创建滚动部分的html结构
  createFormat(format: string): any {
    const selectedYear: number = this.selectedYear;
    const selectedMonth: number = this.selectedMonth;
    const curMonthDays: number = this.getMonthDays(selectedYear, selectedMonth);
    const range: number = (this.opts.range >= 3 && this.opts.range <= 100) ? parseInt(this.opts.range.toString()) : 100;
    const calendarFormatDom: HTMLElement = document.createElement('div');
    const calendarListDom: HTMLElement = document.createElement('div');
    const yearListDom: HTMLElement = document.createElement('div');
    const monthListDom: HTMLElement = document.createElement('div');
    const dayListDom: HTMLElement = document.createElement('div');
    const yearDom: HTMLElement = document.createElement('div');
    const monthDom: HTMLElement = document.createElement('div');
    const dayDom: HTMLElement = document.createElement('div');

    yearDom.textContent = '年';
    monthDom.textContent = '月';
    dayDom.textContent = '日';
    yearListDom.className = 'year-list';
    monthListDom.className = 'month-list';
    dayListDom.className = 'day-list';
    calendarFormatDom.className = 'calendar-format';
    calendarListDom.className = 'calendar-list';

    for(let y: number = 0; y < range; y++) {
      const year: HTMLElement = document.createElement('p');
      year.textContent = (Number(selectedYear) - y).toString();
      yearListDom.appendChild(year);
    }
    for(let m: number = 0; m < 12; m++) {
      const month: HTMLElement = document.createElement('p');
      month.textContent = ((m + 1) < 10 ? ('0' + (m + 1)) : (m + 1)).toString();
      monthListDom.appendChild(month);
    }
    for(let d: number = 0; d < curMonthDays; d++) {
      const day: HTMLElement = document.createElement('p');
      day.textContent = ((d + 1) < 10 ? ('0' + (d + 1)) : (d + 1)).toString();
      dayListDom.appendChild(day);
    }

    switch(format) {
      case 'yyyy':
        calendarFormatDom.appendChild(yearDom);
        calendarListDom.appendChild(yearListDom);
        break;
      case 'yyyy-MM':
        calendarFormatDom.appendChild(yearDom);
        calendarFormatDom.appendChild(monthDom);
        calendarListDom.appendChild(yearListDom);
        calendarListDom.appendChild(monthListDom);
        break;
      default:
        calendarFormatDom.appendChild(yearDom);
        calendarFormatDom.appendChild(monthDom);
        calendarFormatDom.appendChild(dayDom);
        calendarListDom.appendChild(yearListDom);
        calendarListDom.appendChild(monthListDom);
        calendarListDom.appendChild(dayListDom);
    }

    yearListDom.addEventListener('touchstart', (evt) => {
      this.touchstart(evt);
    });
    yearListDom.addEventListener('touchmove', (evt) => {
      this.touchmove(evt);
    });
    yearListDom.addEventListener('touchend', (evt) => {
      this.touchend(evt);
    });
    monthListDom.addEventListener('touchstart', (evt) => {
      this.touchstart(evt);
    });
    monthListDom.addEventListener('touchmove', (evt) => {
      this.touchmove(evt);
    });
    monthListDom.addEventListener('touchend', (evt) => {
      this.touchend(evt);
    });
    dayListDom.addEventListener('touchstart', (evt) => {
      this.touchstart(evt);
    });
    dayListDom.addEventListener('touchmove', (evt) => {
      this.touchmove(evt);
    });
    dayListDom.addEventListener('touchend', (evt) => {
      this.touchend(evt);
    });

    return {
      calendarFormatDom,
      calendarListDom
    };
  }
  // 将html结构添加到body上
  appendToBody(): void {
    if(this.calendarContentDom.classList.contains('slideUp')) return;

    this.calendarContentDom.classList.add('slideUp');
    document.body.appendChild(this.calendarDom);

    // 各种format配置中, 年份为必须项
    const selectedYear: number = this.selectedYear;
    const yearListDom: any = this.calendarDom.querySelector('.year-list');
    const firstYear: number = Number(yearListDom.querySelector('p').textContent);
    const singleItemHeight: number = yearListDom.querySelector('p').offsetHeight;
    const translateYear: number = -(firstYear - selectedYear - 1) * singleItemHeight;

    yearListDom.style.transform = 'translateY(' + translateYear + 'px)';
    yearListDom.style.transition = 'all 0ms';
    yearListDom.setAttribute('data-translateY', translateYear.toString());
    yearListDom.childNodes[firstYear - selectedYear].classList.add('selected');

    this.setFormatList(singleItemHeight);
  }
  // 动态设置月份列表和天数列表, singleItemHeight为单行的高度
  setFormatList(singleItemHeight: number): void {
    const format: string = this.opts.format;
    const selectedMonth: number = this.selectedMonth;
    if(format === 'yyyy') return;

    const monthListDom: any = this.calendarDom.querySelector('.month-list');
    const translateMonth: number = -(selectedMonth - 2) * singleItemHeight;
    monthListDom.style.transform = 'translateY(' + translateMonth + 'px)';
    monthListDom.style.transition = 'all 0ms';
    monthListDom.setAttribute('data-translateY', translateMonth.toString());
    monthListDom.childNodes[selectedMonth - 1].classList.add('selected');
    if(format === 'yyyy-MM-dd') {
      const selectedDay: number = this.selectedDay;
      const dayListDom: any = this.calendarDom.querySelector('.day-list');
      const translateDay: number = -(selectedDay - 2) * singleItemHeight;

      dayListDom.style.transform = 'translateY(' + translateDay + 'px)';
      dayListDom.style.transition = 'all 0ms';
      dayListDom.setAttribute('data-translateY', translateDay.toString());
      dayListDom.childNodes[selectedDay - 1].classList.add('selected');
    }
  }
  // touchstart event
  touchstart(evt: any): void {
    // http://www.cnblogs.com/zhwl/archive/2013/07/24/3210124.html
    evt.preventDefault();
    this.startY = evt.targetTouches[0].pageY;    // 记录刚开始触控的y坐标
  }
  // touchmove event
  touchmove(evt: any): void {
    evt.preventDefault();
    let target: any = evt.target || evt.srcElement;
    if(target.tagName.toLowerCase() === 'p') {
      target = target.parentNode;
    }

    const endY: number = evt.targetTouches[0].pageY;
    const dy: number = endY - this.startY;
    let translateY: number = Number(target.getAttribute('data-translateY'));
    translateY += dy;
    target.setAttribute('data-translateY', translateY);
    target.style.transition = 'all .5s';
    target.style.transform = 'translateY(' + translateY + 'px)';
    this.startY = endY;
  }
  // touchend event
  touchend(evt: any): void {
    evt.preventDefault();
    let target: any = evt.target || evt.srcElement;
    if(target.tagName.toLowerCase() === 'p') {
      target = target.parentNode;
    }

    const childNodes: any = target.childNodes;
    const singleItemHeight: number = childNodes[0].offsetHeight;
    const boundary: number = (childNodes.length - 2) * singleItemHeight;
    const endY: number = evt.changedTouches[0].pageY;
    let translateY: number = Number(target.getAttribute('data-translateY'));
    let offsetNum: number = Math.round(translateY / singleItemHeight);

    translateY = offsetNum * singleItemHeight;
    // 下边界
    if(translateY < -boundary) {
      translateY = -boundary;
      offsetNum = -(childNodes.length - 2);
    }
    // 上边界
    else if(translateY >= singleItemHeight) {
      translateY = singleItemHeight;
      offsetNum = 1;
    }

    for(let i = 0; i < childNodes.length; i++) {
      childNodes[i].classList.remove('selected');
      childNodes[i].removeAttribute('class');
    }

    childNodes[-offsetNum + 1] && childNodes[-offsetNum + 1].classList.add('selected');
    const textContent: number = Number(target.querySelector('p.selected').textContent);
    if(target.className === 'year-list') {
      this.selectedYear = textContent;
    }
    else if(target.className === 'month-list') {
      this.selectedMonth = textContent;
    }
    else {
      this.selectedDay = textContent;
    }

    target.setAttribute('data-translateY', translateY);
    target.style.transform = 'translateY(' + translateY + 'px)';
    this.startY = endY;
    if(this.opts.format === 'yyyy-MM-dd') {
      if(target.className === 'year-list' || target.className === 'month-list') {
        this.resetDayList();
      }
    }
    target.addEventListener('transitionend', () => {
      target.style.transition = 'all 0ms';
    });
    target.addEventListener('webkitTransitionEnd', () => {
      target.style.transition = 'all 0ms';
    });
  }
  // 重新生成天数列表
  resetDayList(): void {
    const { selectedYear, selectedMonth, selectedDay } = this;
    const curMonthDays: number = this.getMonthDays(selectedYear, selectedMonth);
    const dayListDom: HTMLElement = this.calendarDom.querySelector('.day-list');
    let days: any = dayListDom.childNodes;
    let daysLen: number = days.length;
    const singleItemHeight: number = days[0].offsetHeight;
    let translateY: number = Number(dayListDom.getAttribute('data-translateY'));
    let offsetDay: number = daysLen - curMonthDays;

    // 比较当前列表的数量与所选月份的天数
    if(daysLen === curMonthDays) {
      return;
    }
    // 若列表的数量 > 月份的天数, 则将多余的列表数目移除
    else if(daysLen > curMonthDays) {
      while(offsetDay > 0) {
        days = dayListDom.childNodes;
        daysLen = days.length;
        days[daysLen - offsetDay].parentNode.removeChild(days[daysLen - offsetDay]);
        offsetDay -= 1;
      }
      const offsetNum: number = selectedDay - curMonthDays;
      if(offsetNum > 0) {
        days[curMonthDays - 1].classList.add('selected');
        translateY += singleItemHeight * offsetNum;
        dayListDom.setAttribute('data-translateY', translateY.toString());
        dayListDom.style.transform = 'translateY(' + translateY + 'px)';
        dayListDom.style.transition = 'all 0ms';
      }
    }
    // 若列表的数量 < 月份的天数, 则添加上相应的的列表数目
    else if(daysLen < curMonthDays) {
      while(offsetDay < 0) {
        days = dayListDom.childNodes;
        daysLen = days.length;
        const pDom: HTMLElement = document.createElement('p');
        pDom.textContent = (curMonthDays + offsetDay + 1).toString();
        dayListDom.appendChild(pDom);
        offsetDay += 1;
      }
    }

    this.selectedDay = Number(dayListDom.querySelector('p.selected').textContent);
  }
  // 取消事件
  cancel(): void {
    const onCancel: any = this.opts.onCancel;

    if(typeof onCancel === 'function') {
      onCancel();
    }
    this.slideDown();
  }
  // 确认事件
  confirm(): void {
    const { format, onConfirm, el }: { format: string, onConfirm: any, el: string } = this.opts;
    const target: any = document.querySelector(el);
    const selectedYear: number = this.selectedYear;
    let selectedMonth: any = this.selectedMonth;
    let selectedDay: any = this.selectedDay;
    selectedMonth = selectedMonth < 10 ? '0' + selectedMonth : selectedMonth;
    selectedDay = selectedDay < 10 ? '0' + selectedDay : selectedDay;
    let confirmValue: number | string = '';

    if(typeof onConfirm === 'function') {
      onConfirm();
    }

    switch(format) {
      case 'yyyy':
        confirmValue = selectedYear;
        break;
      case 'yyyy-MM':
        confirmValue = selectedYear + '-' + selectedMonth;
        break;
      default:
        confirmValue = selectedYear + '-' + selectedMonth + '-' + selectedDay;
    }

    if(target.tagName.toLowerCase() === 'input') {
      target.value = confirmValue;
    }
    else {
      target.textContent = confirmValue;
    }

    this.slideDown();
  }
  // 向下滑动
  slideDown(): void {
    const classList: DOMTokenList = this.calendarContentDom.classList;

    // 移除 calendar
    const removeCalendar: () => void = (): void => {
      this.calendarContentDom.className = 'calendar-content';
      this.calendarDom.parentNode.removeChild(this.calendarDom);
      this.calendarContentDom.removeEventListener('animationend', removeCalendar);
      this.calendarContentDom.removeEventListener('webkitAnimationEnd', removeCalendar);
    };

    if(classList.contains('slideUp')) {
      classList.remove('slideUp');
      classList.add('slideDown');

      this.calendarContentDom.addEventListener('animationend', removeCalendar);
      this.calendarContentDom.addEventListener('webkitAnimationEnd', removeCalendar);
    }
  }
  // 获得月份的天数
  getMonthDays(year: number, month: number): number {
    let days: number = 31;
    // 判断是否为闰年
    const isLeapYear: (year: number) => boolean = (year: number): boolean => {
      if((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        return true;
      }
      return false;
    };
    switch(month) {
      case 2:
        days = isLeapYear(year) ? 29 : 28;
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        days = 30;
        break;
    }
    return days;
  }
}

if(typeof window !== 'undefined') {
  window['Calendar'] = Calendar;
}
export default Calendar;