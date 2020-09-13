$(function () {
  var layer = layui.layer
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')

  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)


  /**
   * 触发上传
   */
  $('#btnChooseImage').on('click', function () {
    // 模拟用户点击 file
    $('#file').click()
  })

  /**
   * 点击上传图片
   */
  $('#file').on('change', function (e) {
    // 获取到上传的图片信息
    var filelist = e.target.files

    if (filelist.length === 0) {
      return layer.msg('请重新选择图片')
    }

    // 获取到上传的具体图片
    var file = e.target.files[0]
    // 将上传的图片转成 URL 格式
    var newImgURL = URL.createObjectURL(file)
    console.log(newImgURL)
    // 将上传的图片替换掉默认的图片
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })


  /**
   * 将裁剪后的头像上传到服务器
   */
  $('#imagePreview').on('click', function () {
    var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    $.ajax({
      url: '/my/update/avatar',
      method: 'POST',
      data: {
        avatar: dataURL
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('头像更换成功')
        // 调用父页面的方法
        top.window.parent.getUserInfo()
      }
    })
  })
})
