export default class Calendar {
	constructor(opts) {
		this.defaults = {
			el: "",								// 作用于的元素节点, 同css选择器, eg: #calendar, .calendar
			format: "yyyy-MM-dd",				// 设置的日期格式, 默认"yyyy-MM-dd", 可选"yyyy-MM", "yyyy"
			range: 100,							// 年数的范围, 默认100, 最小为3	
			readonly: true,						// 是否只读(只有当节点为input时有效)
			cancelCb: null,						// 取消的回调函数, 默认为null
			confirmCb: null						// 确定的回调函数, 默认为null
		}
		// notice: Object.assign()为浅拷贝, 但是这里浅拷贝就够了
		this.opts = Object.assign({}, this.defaults, opts);
		this.init();
	}
	// 初始化
	init() {
		const defaultFormat = "yyyy-MM-dd";
		let { readonly, el } = this.opts;
		const target = document.querySelector(el);
		const formatArr = ["yyyy-MM-dd", "yyyy-MM", "yyyy"];
		let format = typeof this.opts.format === "string" ? this.opts.format : defaultFormat;
		format = formatArr.includes(format) ? format : defaultFormat;

		if(!target) {
			throw new Error(`not find dom through el: ${el}`)
		}
		if(target.tagName.toLowerCase() === "input") {
			readonly = typeof readonly === "boolean" ? readonly : true;
			target.readOnly = readonly;
		}

		// selectedYear选择的年份, selectedMonth选择的月份, selectedDay选择的日期
		// 默认为当前时间
		this.selectedYear = new Date().getFullYear();
		this.selectedMonth = new Date().getMonth() + 1;
		this.selectedDay = new Date().getDate();
		this.calendarDom = document.createElement("div");
		const calendarTitleDom = document.createElement("div");
		const { calendarFormatDom, calendarListDom } = this.createFormat(format);
		const calendarCancelDom = document.createElement("span");
		const calendarConfirmDom = document.createElement("span");

		this.calendarDom.className = "calendar";
		calendarTitleDom.className = "calendar-title";
		calendarCancelDom.className = "calendar-cancel";
		calendarConfirmDom.className = "calendar-confirm";
		calendarCancelDom.textContent = "取消";
		calendarConfirmDom.textContent = "确定";

		calendarTitleDom.appendChild(calendarCancelDom);
		calendarTitleDom.appendChild(calendarConfirmDom);
		this.calendarDom.appendChild(calendarTitleDom);
		this.calendarDom.appendChild(calendarFormatDom);
		this.calendarDom.appendChild(calendarListDom);

		target.addEventListener("touchstart", () => {
			this.appendToBody();
		});
		calendarCancelDom.addEventListener("touchstart", () => {
			this.cancel();
		});
		calendarConfirmDom.addEventListener("touchstart", () => {
			this.confirm();
		});
	}
	// 根据format创建滚动部分的html结构
	createFormat(format) {
		const { selectedYear, selectedMonth } = this;
		const curMonthDays = this.getMonthDays(selectedYear, selectedMonth);
		let range = typeof this.opts.range === "number" ? this.opts.range : 100;
		const calendarFormatDom = document.createElement("div");
		const calendarListDom = document.createElement("div");
		const yearListDom = document.createElement("div");
		const monthListDom = document.createElement("div");
		const dayListDom = document.createElement("div");
		const yearDom = document.createElement("div");
		const monthDom = document.createElement("div");
		const dayDom = document.createElement("div");
		range = range < 3 ? 100 : range;

		yearDom.textContent = "年";
		monthDom.textContent = "月";
		dayDom.textContent = "日";
		yearListDom.className = "year-list";
		monthListDom.className = "month-list";
		dayListDom.className = "day-list";
		calendarFormatDom.className = "calendar-format";
		calendarListDom.className = "calendar-list";

		for(let y = 0; y < range; y++) {
			let year = document.createElement("p");
			year.textContent = selectedYear - y;
			yearListDom.appendChild(year);
		}
		for(let m = 0; m < 12; m++) {
			let month = document.createElement("p");
			month.textContent = (m + 1) < 10 ? `0${m + 1}` : (m + 1);
			monthListDom.appendChild(month);
		}
		for(let d = 0; d < curMonthDays; d++) {
			let day = document.createElement("p");
			day.textContent = (d + 1) < 10 ? `0${d + 1}` : (d + 1);
			dayListDom.appendChild(day);
		}
		
		switch (format) {
			case "yyyy":
				calendarFormatDom.appendChild(yearDom);
				calendarListDom.appendChild(yearListDom);
				break;
			case "yyyy-MM": 
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

		yearListDom.addEventListener("touchstart", (evt) => {
			this.touchstart(evt);
		});
		yearListDom.addEventListener("touchmove", (evt) => {
			this.touchmove(evt);
		});
		yearListDom.addEventListener("touchend", (evt) => {
			this.touchend(evt);
		});
		monthListDom.addEventListener("touchstart", (evt) => {
			this.touchstart(evt);
		});
		monthListDom.addEventListener("touchmove", (evt) => {
			this.touchmove(evt);
		});
		monthListDom.addEventListener("touchend", (evt) => {
			this.touchend(evt);
		});
		dayListDom.addEventListener("touchstart", (evt) => {
			this.touchstart(evt);
		});
		dayListDom.addEventListener("touchmove", (evt) => {
			this.touchmove(evt);
		});
		dayListDom.addEventListener("touchend", (evt) => {
			this.touchend(evt);
		});

		return { 
			calendarFormatDom, 
			calendarListDom 
		};
	}
	// 将html结构添加到body上
	appendToBody() {
		// http://www.runoob.com/jsref/prop-element-classlist.html
		if(this.calendarDom.classList.contains("slideUp")) return;

		this.calendarDom.classList.add("slideUp");
		document.body.appendChild(this.calendarDom);

		// 各种format配置中, 年份为必须项
		const selectedYear = this.selectedYear;
		const yearListDom = this.calendarDom.querySelector(".year-list");
		const firstYear = Number(yearListDom.querySelector("p").textContent);
		const singleItemHeight = yearListDom.querySelector("p").offsetHeight;
		const translateYear = -(firstYear - selectedYear - 1) * singleItemHeight;

		yearListDom.style.transform = `translateY(${translateYear}px)`;
		yearListDom.style.transition = "all 0ms";
		yearListDom.setAttribute("data-translateY", translateYear);
		yearListDom.childNodes[firstYear - selectedYear].classList.add("selected");

		this.setFormatList(singleItemHeight);
	}
	// 动态设置月份列表和天数列表
	// singleItemHeight为单行的高度
	setFormatList(singleItemHeight) {
		const format = this.opts.format;
		const selectedMonth = this.selectedMonth;
		if(format === "yyyy") return;

		const monthListDom = this.calendarDom.querySelector(".month-list");
		const translateMonth = -(selectedMonth - 2) * singleItemHeight;
		monthListDom.style.transform = `translateY(${translateMonth}px)`;
		monthListDom.style.transition = "all 0ms";
		monthListDom.setAttribute("data-translateY", translateMonth);
		monthListDom.childNodes[selectedMonth - 1].classList.add("selected");
		if(format === "yyyy-MM-dd") {
			const selectedDay = this.selectedDay;
			const dayListDom = this.calendarDom.querySelector(".day-list");
			const translateDay = -(selectedDay - 2) * singleItemHeight;

			dayListDom.style.transform = `translateY(${translateDay}px)`;
			dayListDom.style.transition = "all 0ms";
			dayListDom.setAttribute("data-translateY", translateDay);
			dayListDom.childNodes[selectedDay - 1].classList.add("selected");
		}
	}
	touchstart(evt) {
		// http://www.cnblogs.com/zhwl/archive/2013/07/24/3210124.html
		evt.preventDefault();
		this.startY = evt.targetTouches[0].pageY;		// 记录刚开始触控的y坐标
	}
	touchmove(evt) {
		evt.preventDefault();
		let target = evt.target || evt.srcElement;
		if(target.tagName.toLowerCase() === "p") {
			target = target.parentNode;
		}

		const endY = evt.targetTouches[0].pageY;
		const dy = endY - this.startY;
		let translateY = Number(target.getAttribute("data-translateY"));
		translateY += dy;
		target.setAttribute("data-translateY", translateY);
		target.style.transition = "all .5s";
		target.style.transform = `translateY(${translateY}px)`;
		this.startY = endY;
	}
	touchend(evt) {
		evt.preventDefault();
		let target = evt.target || evt.srcElement;
		if(target.tagName.toLowerCase() === "p") {
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
		const textContent = Number(target.querySelector("p.selected").textContent);
		if(target.className === "year-list") {
			this.selectedYear = textContent;
		}
		else if(target.className === "month-list") {
			this.selectedMonth = textContent;
		}
		else {
			this.selectedDay = textContent;
		}

		target.setAttribute("data-translateY", translateY);
		target.style.transform = `translateY(${translateY}px)`;
		this.startY = endY;
		if(this.opts.format === "yyyy-MM-dd") {
			if(target.className === "year-list" || target.className === "month-list") {
				this.resetDayList();
			}
		}
		target.addEventListener("transitionend", () => {
			target.style.transition = "all 0ms";
		});
		target.addEventListener("webkitTransitionEnd", () => {
			target.style.transition = "all 0ms";
		});
	}
	// 重新生成天数列表
	resetDayList() {
		let { selectedYear, selectedMonth, selectedDay } = this;
		let curMonthDays = this.getMonthDays(selectedYear, selectedMonth);
		let dayListDom = this.calendarDom.querySelector(".day-list");
		let days = dayListDom.childNodes;
		let daysLen = days.length;
		let singleItemHeight = days[0].offsetHeight;
		let translateY = Number(dayListDom.getAttribute("data-translateY"));
		let offsetDay = daysLen - curMonthDays;

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
			let offsetNum = selectedDay - curMonthDays;
			if(offsetNum > 0) {
				days[curMonthDays - 1].classList.add("selected");
				translateY += singleItemHeight * offsetNum;
				dayListDom.setAttribute("data-translateY", translateY);
				dayListDom.style.transform = `translateY(${translateY}px)`;
				dayListDom.style.transition = "all 0ms";
			}
		}
		// 若列表的数量 < 月份的天数, 则添加上相应的的列表数目
		else if(daysLen < curMonthDays) {
			while(offsetDay < 0) {
				days = dayListDom.childNodes;
				daysLen = days.length;
				let pDom = document.createElement("p");
				pDom.textContent = curMonthDays + offsetDay + 1;
				dayListDom.appendChild(pDom);
				offsetDay += 1;
			}
		}

		this.selectedDay = Number(dayListDom.querySelector("p.selected").textContent);
	}
	// 取消事件
	cancel() {
		const cancelCb = this.opts.cancelCb;

		if(typeof cancelCb === "function") {
			cancelCb();
		}
		this.slideDown();
	}
	// 确认事件
	confirm() {
		const { format, confirmCb, el } = this.opts;
		const target = document.querySelector(el);
		let { selectedYear, selectedMonth, selectedDay } = this;
		selectedMonth = selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth;
		selectedDay = selectedDay < 10 ? `0${selectedDay}` : selectedDay;
		let confirmValue = "";

		if(typeof confirmCb === "function") {
			confirmCb();
		}

		switch (format) {
			case "yyyy":
				confirmValue = selectedYear;
				break;
			case "yyyy-MM":
				confirmValue = `${selectedYear} - ${selectedMonth}`;
				break;
			default:
				confirmValue = `${selectedYear} - ${selectedMonth} - ${selectedDay}`;
		}

		if(target.tagName.toLowerCase() === "input") {
			target.value = confirmValue;
		}
		else {
			target.textContent = confirmValue;
		}

		this.slideDown();
	}
	// 向下滑动
	slideDown() {
		let classList = this.calendarDom.classList;

		// 移除 calendar
		let removeCalendar = () => {
			this.calendarDom.className = "calendar";
			this.calendarDom.parentNode.removeChild(this.calendarDom);
			this.calendarDom.removeEventListener("animationend", removeCalendar);
			this.calendarDom.removeEventListener("webkitAnimationEnd", removeCalendar);
		};

		if(classList.contains("slideUp")) {
			classList.remove("slideUp");
			classList.add("slideDown");

			this.calendarDom.addEventListener("animationend", removeCalendar);
			this.calendarDom.addEventListener("webkitAnimationEnd", removeCalendar);
		};
	}
	// 获得月份的天数
	getMonthDays(year, month) {
		let days = 31;
		// 判断是否为闰年
		let isLeapYear = year => {
			if((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
				return true;
			}
			return false;
		}
		switch (month) {
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