$(function () {
  /**
   * 登录和注册的切换
   */
  // 点击登录按钮
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 点击注册按钮
  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })


  /**
   * 自定义表单验证规则
   */
  // 获取 form 表单模块
  var form = layui.form
  var layer = layui.layer

  // 定义验证规则
  form.verify({
    password: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // value 就是指使用了这个规则的表单中的属性值
    repassword: function (value) {
      // 内部的规则，实际上就是判断密码以及确认密码输入框内容是否一致
      // 目前已经获取到确认密码输入框内容，就是 value
      // 只需要获取到密码输入框内容即可
      var pwd = $('.reg-box [name=password]').val()

      if (pwd !== value) {
        return '两次密码不一致！'
      }
    }
  })

  /**
   * 注册功能
   */
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()

    var data = {
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val()
    }

    // 好的代码一定是阅读性强的
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message)
      }

      layer.msg('注册成功，请进行登录！')

      // 模拟用户点击操作
      $('#link_login').click()
    })
  })

  /**
   * 登录功能
   */
  $('#form_login').submit(function (e) {
    e.preventDefault()

    $.ajax({
      url: '/api/login',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }

        // 将 token 保存到本地
        localStorage.setItem('token', res.token)
        // 跳转到后台主页
        location.href = '/index.html'
      }
    })
  })
})