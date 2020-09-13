$(function () {

  var layer = layui.layer
  var form = layui.form

  /**
   * 获取文章类别
   */
  getCateList()
  function getCateList() {
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

  /**
   * 展示编辑弹框
   */
  // 编辑弹框的 Index 
  var editCateIndex = null
  $('body').on('click', '.btn-edit', function () {
    editCateIndex = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '修改文章分类',
      content: $('#edit-dialog').html()
    })

    var cateId = $(this).attr('data-id')

    $.ajax({
      url: `/my/article/cates/${cateId}`,
      method: 'GET',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        form.val('edit-form', res.data)
      }
    })
  })

  /**
   * 编辑文章分类
   */
  $('body').on('submit', '#editCateForm', function (e) {
    e.preventDefault()

    $.ajax({
      url: '/my/article/updatecate',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }

        // 编辑成功提示
        layer.msg('编辑分类成功')
        // 重新获取数据
        getCateList()
        // 关闭编辑弹框
        layer.close(editCateIndex)
      }
    })
  })

  /**
   * 删除文章分类
   */
  $('body').on('click', '.btn-delete', function () {
    // 获取分类 Id
    var cateId = $(this).attr('data-id')

    // 询问弹框
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {

      $.ajax({
        url: `/my/article/deletecate/${cateId}`,
        method: 'GET',
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message)
          }

          layer.msg('删除分类成功')
          getCateList()
          layer.close(index)

        }
      })
    })
  })
})