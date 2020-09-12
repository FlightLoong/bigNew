$(function () {
  // 导入 form 模块
  var form = layui.form
  var layer = layui.layer

  /**
   * 修改密码区域的验证规则
   */
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 验证新密码和旧密码不能一致
    samePwd: function (value) {
      var oldPwd = $('.layui-form [name=oldPwd]').val()

      if (oldPwd === value) {
        return '新旧密码不能一致'
      }
    },
    // 验证两次输入的密码是否一致
    rePwd: function (value) {
      var newPwd = $('.layui-form [name=newPwd]').val()

      if (newPwd !== value) {
        return '两次密码输入不一致'
      }
    }
  })

  /**
   * 重置密码操作
   */
  $('.layui-form').submit(function (e) {
    e.preventDefault()

    $.ajax({
      url: '/my/updatepwd',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        console.log(res)
        if (res.status !== 0) {
          return layer.msg(res.message)
        }

        layer.msg(res.message)
        $('.layui-form')[0].reset()
        localStorage.removeItem('token')
        // top: 当前窗口的最顶层浏览器窗口
        // 也可以简单理解为父级
        top.window.location.href = '/login.html'
      }
    })
  })
})