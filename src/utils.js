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
        if(type(cb) === 'function') {
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
  month = month < 10 ? ('0' + month) : month;
  day = day < 10 ? ('0' + day) : day;

  return year + '-' + month + '-' + day;
}