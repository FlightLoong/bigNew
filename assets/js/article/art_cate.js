$(function () {

  var layer = layui.layer

  /**
   * 获取文章类别
   */
  getCateList()
  function getCateList () {
    $.ajax({
      url: '/my/article/cates',
      method: 'GET',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }

        // 使用模板引擎渲染页面
        // 数据必须是一个对象
        var tableHtml = template('tpl-table', res)

        $('tbody').html(tableHtml)
      }
    })
  }

  /**
   * 添加文章分类弹框
   */
  var addCateIndex = null
  $('#addCateBtn').on('click', function () {
    // layui 规定
    // 每弹出一个层，都会返回一个 index
    // 作用：场景： 根据 index 确认关闭哪一个弹层
    addCateIndex = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '添加文章分类',
      content: $('#add-dialog').html()
    })
  })

  
  /**
   * 添加文章分类
   */
  $('body').on('submit', '#addCateForm', function (e) {
    e.preventDefault()

    $.ajax({
      url: '/my/article/addcates',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('添加失败')
        }

        layer.msg('添加分类成功')

        // 添加成功，重新加载数据
        getCateList()

        // 根据 index 关闭弹层
        layer.close(addCateIndex)
      }
    })
  })
})