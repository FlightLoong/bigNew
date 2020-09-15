$(function () {
  var layer = layui.layer
  var form = layui.form
  // 声明查询参数
  var q = {
    pagenum: 1, // 当前的页码值
    pagesize: 20, // 每页显示的条数，默认 2 条
    cate_id: '', // 文章分类的 id
    state: '' // 文章的状态，已发布和草稿
  }

  /**
   * 获取文章列表
   */
  initTable()
  function initTable() {
    $.ajax({
      url: '/my/article/list',
      method: 'GET',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }

        res.data.forEach(function (item) {
          // dayjs 方法传入需要格式化的时间
          // format 方法中定义的是格式化时间的格式
          item.pub_date = dayjs(item.pub_date).format('YYYY-MM-DD HH:mm:ss')
        })

        var tableHtml = template('tpl-table', res)
        $('tbody').html(tableHtml)
      }
    })
  }

  /**
   * 渲染所有分类
   */
  initCate()
  function initCate () {
    $.ajax({
      url: '/my/article/cates',
      method: 'GET',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }

        var cateHtml = template('tpl-cate', res)
        $('.layui-form [name=cate_id]').html(cateHtml)

        // 插入到父级以后，页面并没有渲染成功，这是 layui 运行机制有关
        // 手动调用 form.render() 方法，让 layui 重新渲染即可
        form.render()
      }
    })
  }

  /**
   * 筛选
   */
  $('#ListSelect').on('submit', function (e) {
    e.preventDefault()

    var newCateId = $('.layui-form [name=cate_id]').val()
    var newState = $('.layui-form [name=state]').val()

    q.cate_id = newCateId
    q.state = newState

    initTable()
  })
})
