// 这个方法用于在 发送 ajax 之前进行配置相关的属性
// 当发送 $.ajax 等等方法的时候，都会先触发这个方法

// option 是指 $.ajax 请求所有的参数配置
$.ajaxPrefilter(function (option) {
  option.url = 'http://ajax.frontend.itheima.net' + option.url
})