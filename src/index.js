import "./less/calendar.less";
import Calendar from "./js/calendar.js";
// 打包时请去掉这段
if(module.hot) {
	module.hot.accept();
}
// end

new Calendar({
	el: "#calendar",
	format: "yyyy-MM-dd"
});