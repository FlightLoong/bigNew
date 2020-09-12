$(function () {
  // 引入 form 模块
  var form = layui.form
  var layer = layui.layer

  /**
   * 对基本资料表单验证
   */
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '用户昵称必须在 1~6 个之间'
      }
    }
  })

  /**
   * 获取用户的基本信息
   */
  initUserInfo()
  function initUserInfo() {
    $.ajax({
      url: '/my/userinfo',
      method: 'GET',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }

        // 如何把数据展示到页面上 ？
        // 注意：如果想赋值成功，后台返回的字段需要和 name 中的字段一一致
        // 就是说后台返回的字段，会显示到对应的 name 位置
        form.val('formUserInfo', res.data)
      }
    })
  }

  /**
   * 重置表单
   */
  $('#resetBtn').on('click', function (e) {
    e.preventDefault()

    initUserInfo()
  })

  /**
   * 更新基本资料
   */
  $('#changeUserInfo').submit(function (e) {
    e.preventDefault()

    $.ajax({
      url: '/my/userinfo',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }

        // 使用 iframe 以后，iframe 显示的页面可以理解为是子页面
        // iframe 标签所在的页面，可以看做事父页面
        // 如果想父页面的方法，可以使用 window.parent.方法名即可
        window.parent.getUserInfo()
      }
    })
  })
})