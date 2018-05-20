import "../less/calendar.less";
import {
  getType, formatDate, judgeNodeType,
  TEXT_NODE, EMPTY_NODE, createTextNode,
  createEmptyNode, fillZero, formats,
  defaults, curYear, curMonth, curDay,
  setProps, getMonthDays
} from './assist';

class Calendar {
	constructor(opts) {
		if(!(this instanceof Calendar)) {
      return new Calendar(opts);
    }
		this.opts = {
			...defaults,
			...opts
		};
    this.el = document.querySelector(this.opts.el);
    if(!this.el) {
      throw new Error('not find dom through opts el:' + this.opts.el);
    }
    else if(this.el.tagName.toLowerCase() !== 'input') {
      throw new Error('el tag must be input');
    }
    this.startY = 0;
    this.selectedYear = curYear;
    this.selectedMonth = fillZero(curMonth);
    this.selectedDay = fillZero(curDay);
    this.calendarEl = null;       // 当前已挂载的元素节点
		this.init();
	}
	// 初始化
	init() {
		const format = formats.includes(this.opts.format) ? this.opts.format : defaults.format;
		const range = (getType(this.opts.range) === 'number' && this.opts.range >= 3) ? this.opts.range : defaults.range;
    const maskClose = getType(this.opts.maskClose) === 'boolean' ? this.opts.maskClose : defaults.maskClose;
    const confirmText = getType(this.opts.confirmText) === 'string' ? this.opts.confirmText : defaults.confirmText;
    const onConfirm = getType(this.opts.onConfirm) === 'function' ? this.opts.onConfirm : defaults.onConfirm;
    const cancelText = getType(this.opts.cancelText) === 'string' ? this.opts.cancelText : defaults.cancelText;
    const onCancel = getType(this.opts.onCancel) === 'function' ? this.opts.onCancel : defaults.onCancel;
    const readonly = getType(this.opts.readonly) === 'boolean' ? this.opts.readonly : defaults.readonly;
    const [year, month, day] = format.split('-');
    
    // 当为 input 标签时
    if(this.el.tagName.toLowerCase() === 'input') {
      this.el.readonly = readonly;
    }

    this.initValue(format, range);
		const vnode = {
			tag: 'div',
			props: {
				className: 'calendar'
			},
			children: [
				{
          tag: 'div',
          props: {
            className: 'calendar-mask',
            on: {
              click: () => {
                if(maskClose) {
                  this.close();
                }
              }
            }
          },
          children: null
        },
        {
          tag: 'div',
          props: { className: 'calendar-content slideUp' },
          children: [
            { 
              tag: 'div',
              props: { className: 'calendar-title' },
              children: [
                {
                  tag: 'span',
                  props: {
                    className: 'calendar-cancel',
                    on: {
                      click: () => {
                        if(onCancel) {
                          onCancel();
                        }
                        this.close();
                      }
                    }
                  },
                  children: cancelText
                },
                {
                  tag: 'span',
                  props: {
                    className: 'calendar-confirm',
                    on: {
                      click: () => {
                        if(onConfirm) {
                          onConfirm();
                        }
                        this.setValue();
                      }
                    }
                  },
                  children: confirmText
                },
              ]
            },
            { 
              tag: 'div',
              props: { className: 'calendar-format' },
              children: [
                { tag: 'div', props: null, children: '年' },
                month ? { tag: 'div', props: null, children: '月' } : null,
                day ? { tag: 'div', props: null, children: '日' } : null
              ] 
            },
            { 
              tag: 'div',
              props: {
                className: 'calendar-list',
                on: {
                  touchstart: evt => {
                    this.touchstart(evt);
                  },
                  touchmove: evt => {
                    this.touchmove(evt);
                  },
                  touchend: evt => {
                    this.touchend(evt);
                  }
                }
              },
              children: [
                {
                	tag: 'div',
                	props: { className: 'year-list' },
                	children: Array.from({ length: range * 2 + 1 }).map((val, index) => {
                		const year = curYear + range - index;
                		return {
                			tag: 'p',
                			props: { className: year === Number(this.selectedYear) ? 'selected' : '' },
                			children: year
                		}
                	})
                },
                month ? {
                	tag: 'div', props: { className: 'month-list' },
                	children: Array.from({ length: 12 }).map((val, index) => {
                		const month = fillZero(index + 1);
                		return {
                			tag: 'p',
                			props: { className: month === this.selectedMonth ? 'selected' : '' },
                			children: month
                		}
                	})
              	} : null,
                day ? {
                	tag: 'div', props: { className: 'day-list' },
                	children: Array.from({ length: 31 }).map((val, index) => {
                		const day = fillZero(index + 1);
                		return {
                			tag: 'p',
                			props: { className: day === this.selectedDay ? 'selected' : '' },
                			children: day
                		}
                	})
                } : null
              ]
            }
          ]
        }
			]
		};

    this.calendarEl = this.createElement(vnode);
    this.mounted(this.calendarEl);
    this.initTranslate();
	}
  // 初始化列表移动的距离
  initTranslate() {
    // 各种format配置中, 年份为必须项
    const format = this.opts.format;
    const calendarEl = this.calendarEl;
    const yearListDom = calendarEl.querySelector('.year-list');
    const monthListDom = calendarEl.querySelector(".month-list");
    const dayListDom = calendarEl.querySelector(".day-list");
    const firstYearNode = yearListDom.childNodes[0];
    const firstYear = Number(firstYearNode.textContent);
    const singleItemHeight = firstYearNode.offsetHeight;
    const translateYear = -(firstYear - this.selectedYear - 1) * singleItemHeight;
    const translateMonth = -(this.selectedMonth - 2) * singleItemHeight;
    const translateDay = -(this.selectedDay - 2) * singleItemHeight;
    
    setProps(yearListDom, {
      'data-translateY': translateYear,
      style: {
        transition: 'all 0ms',
        transform: 'translateY(' + translateYear + 'px)'
      }
    });
    
    if(format === 'yyyy') return;
    
    setProps(monthListDom, {
      'data-translateY': translateMonth,
      style: {
        transition: 'all 0ms',
        transform: 'translateY(' + translateMonth + 'px)'
      }
    });
    if(format === 'yyyy-MM-dd') {
      setProps(dayListDom, {
        'data-translateY': translateDay,
        style: {
          transition: 'all 0ms',
          transform: 'translateY(' + translateDay + 'px)'
        }
      });
    }
  }
  // 开始触摸事件
  touchstart(evt) {
    evt.preventDefault();
    this.startY = evt.targetTouches[0].pageY;   // 记录刚开始触控的y坐标
  }
  // 触摸滑动事件
  touchmove(evt) {
    evt.preventDefault();
    let target = evt.target || evt.srcElement;
    if(target.tagName.toLowerCase() === 'p') {
      target = target.parentNode;
    }

    const endY = evt.targetTouches[0].pageY;
    const dy = endY - this.startY;
    const translateY = Number(target.getAttribute('data-translateY')) + dy;

    setProps(target, {
      'data-translateY': translateY,
      style: {
        transition: 'all .5s',
        transform: 'translateY(' + translateY + 'px)'
      }
    });
    this.startY = endY;
  }
  // 触摸结束事件
  touchend(evt) {
    evt.preventDefault();
    let target = evt.target || evt.srcElement;
    if(target.tagName.toLowerCase() === 'p') {
      target = target.parentNode;
    }

    let childNodes = target.childNodes;
    let singleItemHeight = childNodes[0].offsetHeight;
    let boundary = (childNodes.length - 2) * singleItemHeight;
    let endY = evt.changedTouches[0].pageY;
    let translateY = Number(target.getAttribute("data-translateY"));
    let offsetNum = Math.round(translateY / singleItemHeight);

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
      childNodes[i].classList.remove("selected");
      childNodes[i].removeAttribute("class");
    }

    childNodes[-offsetNum + 1] && childNodes[-offsetNum + 1].classList.add("selected");
    const textContent = target.querySelector("p.selected").textContent;
    if(target.className === "year-list") {
      this.selectedYear = textContent;
    }
    else if(target.className === "month-list") {
      this.selectedMonth = textContent;
    }
    else {
      this.selectedDay = textContent;
    }
    
    setProps(target, {
      'data-translateY': translateY,
      style: {
        transform: 'translateY(' + translateY + 'px)'
      }
    });
    this.startY = endY;
    if(this.opts.format === 'yyyy-MM-dd') {
      if(target.className === 'year-list' || target.className === 'month-list') {
        this.diffDayList();
      }
    }
    target.addEventListener('transitionend', () => {
      setProps(target, {
        style: {
          transition: 'all 0ms'
        }
      });
    });
  }
  // 比较两个月的天数差异
  diffDayList() {
    const { selectedYear, selectedMonth, selectedDay } = this;
    let curMonthDays = getMonthDays(selectedYear, selectedMonth);
    let dayListDom = this.calendarEl.querySelector('.day-list');
    let days = dayListDom.childNodes;
    let daysLen = days.length;
    let singleItemHeight = days[0].offsetHeight;
    let translateY = Number(dayListDom.getAttribute('data-translateY'));
    let offsetDay = daysLen - curMonthDays;

    // 比较当前列表的数量与所选月份的天数
    if(daysLen === curMonthDays) return;

    // 若列表的数量 > 月份的天数, 则将多余的列表数目移除
    if(daysLen > curMonthDays) {
      while(offsetDay > 0) {
        days = dayListDom.childNodes;
        daysLen = days.length;
        dayListDom.removeChild(days[daysLen - offsetDay]);
        offsetDay -= 1;
      }
      let offsetNum = selectedDay - curMonthDays;
      if(offsetNum > 0) {
        days[curMonthDays - 1].classList.add('selected');
        translateY += singleItemHeight * offsetNum;
        setProps(dayListDom, {
          'data-translateY': translateY,
          style: {
            transition: 'all 0ms',
            transform: 'translateY(' + translateY + 'px)'
          }
        });
      }
    }
    // 若列表的数量 < 月份的天数, 则添加上相应的的列表数目
    else if(daysLen < curMonthDays) {
      while(offsetDay < 0) {
        days = dayListDom.childNodes;
        daysLen = days.length;
        const vnode = {
          tag: 'p',
          props: null,
          children: curMonthDays + offsetDay + 1
        }
        const p = this.createElement(vnode);
        dayListDom.appendChild(p);
        offsetDay += 1;
      }
    }

    this.selectedDay = Number(dayListDom.querySelector("p.selected").textContent);
  }
  // 生成真实dom
  createElement(vnode) {
    if(getType(vnode) !== 'object') {
      console.error('vnode is not an object', vnode);
      return;
    }

    let el;
    const { tag, props, children } = vnode;
    const childrenType = getType(children);
    const nodeType = judgeNodeType(vnode);
    if(nodeType === TEXT_NODE) {
      el = createTextNode(children);
    }
    else if(nodeType === EMPTY_NODE) {
      el = createEmptyNode(tag, props);
    }
    else {
      el = createEmptyNode(tag, props);
      let childNode;
      if(childrenType === 'array') {
        for(const child of children) {
          if(child) {
            childNode = this.createElement(child);
            el.appendChild(childNode)
          }
        }
      }
      else if(childrenType === 'string' || childrenType === 'number') {
        childNode = createTextNode(children);
        el.appendChild(childNode);
      }
    }
    
    return el;
  }
  // 关闭
  close() {
    if(this.calendarEl) {
      this.calendarEl.parentNode.removeChild(this.calendarEl);
      this.calendarEl = null;
    }
  }
  // 挂载到body上
  mounted(el) {
    document.body.appendChild(el);
  }
  // 赋值
  setValue() {
    let confirmValue = '';
    const { selectedYear, selectedMonth, selectedDay } = this;
    switch(this.opts.format) {
      case 'yyyy':
        confirmValue = selectedYear;
        break;
      case 'yyyy-MM':
        confirmValue = selectedYear + '-' + selectedMonth;
        break;
      default:
        confirmValue = selectedYear + '-' + selectedMonth + '-' + selectedDay;
    }
    document.querySelector(this.opts.el).value = confirmValue;
    this.close();
  }
  // 初始化值
  initValue(format, range) {
    const value = this.el.value;
    let [year, month, day] = value.split('-');
    
    if(value.trim() === '') {
      this.selectedYear = curYear;
      this.selectedMonth = fillZero(curMonth);
      this.selectedDay = fillZero(curDay);
      return;
    }

    if(year > curYear + range || year < curYear - range) {
      year = curYear;
    }
    if(month > 12 || month < 1) {
      month = curMonth;
    }

    const curMonthDays = getMonthDays(year, month);
    if(day < 1 || day > curMonthDays) {
      day = curDay;
    }

    this.selectedYear = year;
    this.selectedMonth = fillZero(month);
    this.selectedDay = fillZero(day);
  }
}

if(typeof window !== 'undefined') {
  window['Calendar'] = Calendar;
}
export default Calendar;