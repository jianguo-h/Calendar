// 判断变量的类型
export const getType = val => {
  const string = Object.prototype.toString.call(val);
  const start = string.indexOf(' ') + 1;
  const end = string.length - 1;
  return string.slice(start, end).toLowerCase();
}

export const TEXT_NODE = 'text_node';
export const EMPTY_NODE = 'empty_node';
export const ELEMENT_NODE = 'element_node';

// 判断一个vnode的类型
export const judgeNodeType = vnode => {
  const { tag, children } = vnode;

  if(!tag) {
    return TEXT_NODE;
  }
  else if(tag && !children) {
    return EMPTY_NODE;
  }
  else {
    return ELEMENT_NODE;
  }
}

// 创建一个文本节点
export const createTextNode = val => {
  return document.createTextNode(val);
}

// 创建一个空节点
export const createEmptyNode = (tag, props) => {
  const node = document.createElement(tag);
  if(!props) {
    return node;
  }
  return setProps(node, props);
}

// 设置节点的属性
export const setProps = (node, props) => {
  for(const [key, val] of Object.entries(props)) {
    if(key === 'className') {
      node.setAttribute('class', val);
    }
    else if(key === 'on') {
      for(const [event, cb] of Object.entries(val)) {
        if(getType(cb) === 'function') {
          node['on' + event] = cb;
        }
      }
    }
    else if(key === 'style') {
      for(const [property, value] of Object.entries(val)) {
        node.style[property] = value;
      }
    }
    else {
      node.setAttribute(key, val);
    }
  }
  return node;
}

// 格式化日期
export const formatDate = date => {
  let year, month, day;
  const type = getType(date);
  if(!['date', 'string', 'number'].includes(type)) {
    throw new Error('date type must be Date instance or number or string number');
  }
  if(['string', 'number'].includes(type)) {
    date = Number(date);
    if(Number.isNaN(date)) {
      throw new Error('date value has an error' + date);
    }
    date = new Date(date);
  }
  year = date.getFullYear();
  month = date.getMonth() + 1;
  day = date.getDate();
  month = fillZero(month);
  day = fillZero(day);

  return year + '-' + month + '-' + day;
}

// 对于小于10的数补齐0
export const fillZero = val => {
  const type = getType(val);
  const num = Number(val);
  if(!['string', 'number'].includes(type)) {
    throw new Error('val type must be number or string number');
  }
  return num < 10 ? ('0' + num) : num;
}

export const formats = ['yyyy-MM-dd', 'yyyy-MM', 'yyyy'];
const [curYear, curMonth, curDay] = formatDate(new Date()).split('-').map(val => Number(val));
export { curYear, curMonth, curDay };
export const defaults = {
  el: '#calendar',            // 作用于的元素节点, 同css选择器, eg: #calendar, .calendar, default: '#calendar'
  format: 'yyyy-MM-dd',       // 设置的日期格式, default: 'yyyy-MM-dd', 可选'yyyy-MM', 'yyyy'
  range: 100,                 // 年数的范围, default: 100, 最小为3  
  readonly: true,             // 是否只读(只有当节点为input时有效), default: true
  maskClose: true,            // 点击遮罩层是否能关闭, default: true
  confirmText: '确定',        // 确定按钮的文字, default: '确定'
  onConfirm: null,            // 确定的回调函数, default: null
  cancelText: '取消',         // 取消按钮的文字, default: '取消'
  onCancel: null              // 取消的回调函数, default: null
};