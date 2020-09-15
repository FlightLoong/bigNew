$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage

  // 声明查询参数
  var q = {
    pagenum: 1, // 当前的页码值
    pagesize: 2, // 每页显示的条数，默认 2 条
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

        // 调用处理分页的方法
        renderPage(res.total)
      }
    })
  }

  /**
   * 渲染所有分类
   */
  initCate()
  function initCate() {
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


  /**
   * 分页处理函数
   */
  function renderPage(total) {
    laypage.render({
      elem: 'renderpage', // 分页展示的区域
      count: total, // 数据总条数
      limit: q.pagesize, // 每页的条数
      curr: q.pagenum, // 起始页面
      // 页面的展示，是根据配置的顺序来展示的
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 5, 10, 15],
      // 触发 jump 的方式有两种
      // 1、初始化的时候，调用 laypage.render
      // 2、切换页码值的时候，会触发
      jump: function (obj, first) {
        q.pagenum = obj.curr

        // 在 jump 回调函数中，可以取到所有配置项的值
        // 所以可以使用 obj.limit 获取到最新的每页显示条数
        q.pagesize = obj.limit

        if (!first) {
          initTable()
        }
      }
    })
  }

  /**
   * 删除文章
   */
  $('body').on('click', '.delete-btn', function () {
    var artId = $(this).attr('data-id')

    var deleteBtnLen = $('.delete-btn').length

    layer.confirm('是否删除文章?', {icon: 3, title:'提示'}, function(index){
      $.ajax({
        url: `/my/article/delete/${artId}`,
        method: 'GET',
        success: function (res) {
          console.log(res)
          if (res.status !== 0) {
            return layer.msg(res.message)
          }

          layer.msg('文章删除成功！')

          // 根据当前页面删除按钮的个数做判断
          // 如果按钮的个数 > 1，说明当前页文章个数 至少 2 条，不做处理
          // 如果按钮的个数 = 1，说明当前页文章个数 只有 1 条，让页码值 -1 即可
          if (deleteBtnLen === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }

          initTable()

          layer.close(index);
        }
      })
    
    })
  })
})
