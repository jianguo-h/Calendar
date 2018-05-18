/*<div class="calendar">
  <div class="calendar-mask"></div>
  <div class="calendar-content slideUp">
    <div class="calendar-title">
      <span class="calendar-cancel">取消</span>
      <span class="calendar-confirm">确定</span>
    </div>
    <div class="calendar-format">
      <div>年</div>
      <div>月</div>
      <div>日</div>
    </div>
    <div class="calendar-list">
      <div class="year-list" data-translatey="41" style="transform: translateY(41px); transition: all 0ms;">
        <p class="selected">2018</p>
        <p>2017</p>
        <p>2016</p>
        <p>2015</p>
        <p>2014</p>
      </div>
      <div class="month-list" data-translatey="-123" style="transform: translateY(-123px); transition: all 0ms;">
        <p>01</p>
        <p>02</p>
        <p>03</p>
        <p>04</p>
        <p class="selected">05</p>
        <p>06</p>
        <p>07</p>
        <p>08</p>
      </div>
      <div class="day-list" data-translatey="-574" style="transform: translateY(-574px); transition: all 0ms;">
        <p>01</p>
        <p>02</p>
        <p>03</p>
        <p>04</p><p>05</p><p>06</p><p>07</p><p>08</p><p>09</p><p>10</p><p>11</p><p>12</p><p>13</p><p>14</p><p>15</p><p class="selected">16</p>
      </div>
    </div>
  </div>
</div>*/
import "../less/calendar.less";
import {
  getType, formatDate, judgeNodeType,
  TEXT_NODE, EMPTY_NODE, createTextNode,
  createEmptyNode, fillZero, formats,
  defaults, curYear, curMonth, curDay
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
    const [year, month, day] = format.split('-');
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
                        else {
                          this.close();
                        }
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
                        else {
                          // this.close();
                        }
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
              props: { className: 'calendar-list' },
              children: [
                {
                	tag: 'div',
                	props: { className: 'year-list' },
                	children: Array.from({ length: range }).map((val, index) => {
                		const year = curYear - index;
                		return {
                			tag: 'p',
                			props: { className: year === curYear ? 'selected' : '' },
                			children: year
                		}
                	})
                },
                month ? {
                	tag: 'div', props: { className: 'month-list' },
                	children: Array.from({ length: 12 }).map((val, index) => {
                		const month = index + 1;
                		return {
                			tag: 'p',
                			props: { className: month === curMonth ? 'selected' : '' },
                			children: fillZero(month)
                		}
                	})
              	} : null,
                day ? {
                	tag: 'div', props: { className: 'day-list' },
                	children: Array.from({ length: 31 }).map((val, index) => {
                		const day = index + 1;
                		return {
                			tag: 'p',
                			props: { className: day === curDay ? 'selected' : '' },
                			children: fillZero(day)
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
	}
  // 生成真是dom
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
}

if(typeof window !== 'undefined') {
  window['Calendar'] = Calendar;
}
export default Calendar;