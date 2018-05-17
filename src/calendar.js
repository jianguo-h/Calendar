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
import "./calendar.less";
import { formatDate } from './utils';

const formats = ['yyyy-MM-dd', 'yyyy-MM', 'yyyy'];
const curDate = formatDate(new Date());
const [curYear, curMonth, curDay] = curDate.split('-');
class Calendar {
	constructor(opts) {
		if(!(this instanceof Calendar)) {
      return new Calendar(opts);
    }
		const defaults = {
			el: '#calendar',						// 作用于的元素节点, 同css选择器, eg: #calendar, .calendar, default: '#calendar'
			format: 'yyyy-MM-dd',				// 设置的日期格式, default: 'yyyy-MM-dd', 可选'yyyy-MM', 'yyyy'
			range: 100,									// 年数的范围, default: 100, 最小为3	
			readonly: true,							// 是否只读(只有当节点为input时有效), default: true
      maskClose: true,            // 点击遮罩层是否能关闭, default: true
			onConfirm: null,						// 取消的回调函数, default: null
			onCancel: null							// 确定的回调函数, default: null
		};
		this.opts = {
			...defaults,
			...opts
		};
		this.init();
	}
	// 初始化
	init() {
		const format = formats.includes(this.opts.format) ? this.opts.format : 'yyyy-MM-dd';
    const [year, month, day] = format.split('-');
		const vnode = {
			tag: 'div',
			props: {
				className: 'calendar'
			},
			children: [
				{ tag: 'div', props: { className: 'calendar-mask' }, children: null },
        {
          tag: 'div',
          props: { className: 'calendar-content slideUp' },
          children: [
            { 
              tag: 'div',
              props: { className: 'calendar-title' },
              children: [
                { tag: 'span', props: { className: 'calendar-cancel' }, children: '取消' },
                { tag: 'span', props: { className: 'calendar-confirm' }, children: '确定' },
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
                { tag: 'div', props: { className: 'year-list' }, children: [] },
                month ? { tag: 'div', props: { className: 'month-list' }, children: [] } : null,
                day ? { tag: 'div', props: { className: 'day-list' }, children: [] } : null
              ]
            }
          ]
        }
			]
		};
	}
}

if(typeof window !== 'undefined') {
  window['Calendar'] = Calendar;
}
export default Calendar;