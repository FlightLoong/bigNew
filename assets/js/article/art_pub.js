$(function () {
  var layer = layui.layer
  var form = layui.form

  // 初始化富文本编辑器
  initEditor()

  // 1. 初始化图片裁剪器
  var $image = $('#image')
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  // 3. 初始化裁剪区域
  $image.cropper(options)

  /**
   * 获取文章类别
   */
  getArtCat()
  function getArtCat() {
    $.ajax({
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }

        var selectHtml = template('select-art', res)
        console.log(selectHtml)
        $('#pubArticle [name=cate_id]').html(selectHtml)

        // 需要手动告诉 layui 重新加载页面
        form.render()
      }
    })
  }

  /**
   * 选择需要上传的图片
   */
  $('#selectImage').on('click', function () {
    $('#file').click()
  })

  /**
   *  获取上传后的图片并替换裁剪区域
   */
  $('#file').on('change', function (e) {
    // 获取到图片的信息
    var files = e.target.files

    if (files.length === 0) {
      return layer.msg('图片上传失败')
    }

    // 获取到上传的图片
    var file = e.target.files[0]

    // 将上传的图片转成 URL 格式
    var newImgURL = URL.createObjectURL(file)

    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })


  /**
   * 处理上传需要使用的数据
   */
  var art_state = '已发布'

  $('#saveBtn2').on('click', function () {
    art_state = '草稿'

    publishArticle()
  })

  /**
   * 处理发布文章的请求
   */
  $('#pubArticle').on('submit', function (e) {
    e.preventDefault()

    // 根据 form 表单生成 FormData 对象
    var fd = new FormData($(this)[0])
    // 将 state 字段添加到 FormData 对象中
    fd.append('state', art_state)


    $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
      width: 400,
      height: 280
    })
      .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append('cover_img', blob)

        publishArticle(fd)
      })
  })

  /**
   * 发布文章请求
   */
  function publishArticle (fd) {
    $.ajax({
      url: '/my/article/add',
      method: 'POST',
      data: fd,
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }

        layer.msg('文章发布成功！')
        location.href = '/article/art_list.html'
      }
    })
  }
})