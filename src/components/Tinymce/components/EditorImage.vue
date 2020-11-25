<template>
  <div class="upload-container">
    <el-button
      v-if="size===''||size==='mini'"
      :style="{background:color,borderColor:color}"
      icon="el-icon-upload"
      size="mini"
      type="primary"
      @click=" dialog=true"
    >
      上传
    </el-button>
    <el-button
      v-if="size==='medium'"
      :style="{background:color,borderColor:color}"
      icon="el-icon-upload"
      size="medium"
      type="primary"
      @click=" dialog=true"
    >
      上传
    </el-button>
    <el-dialog :append-to-body="true" :visible.sync="dialog">
      <div>提示：只能上传(jpg|jpeg|png|GIF|JPG|PNG)</div>
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        action="http://localhost:8080/admin/images"
        list-type="picture-card"
      >
        <el-button size="small" type="primary">
          点击上传
        </el-button>
      </el-upload>
      <el-button @click="dialog = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        确认
      </el-button>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    },
    size: {
      type: String,
      default: 'mini'
    }
  },
  data() {
    return {
      dialog: false,
      listObj: {},
      fileList: []
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialog = false
    },
    handleSuccess(response, file) {
      console.log(response)
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = process.env.VUE_APP_BASE_API + response.data.url
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    checkImgType(file) {
      // 用文件名name后缀判断文件类型，可用size属性判断文件大小不能超过500k ， 前端直接判断的好处，免去服务器的压力。
      return /\.(jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)
    },
    beforeUpload(file) {
      console.log(file)
      const assetTypeAnImage = this.checkImgType(file)

      if (assetTypeAnImage) {
        const _self = this
        const _URL = window.URL || window.webkitURL
        const fileName = file.uid
        this.listObj[fileName] = {}
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.src = _URL.createObjectURL(file)
          img.onload = function() {
            _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
          }
          resolve(true)
        })
      } else {
        this.$notify({
          title: '提示',
          message: '图片类型不符',
          type: 'warning',
          duration: 2000
        })
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .editor-slide-upload {
    margin-bottom: 20px;

    ::v-deep .el-upload--picture-card {
      width: 100%;
    }
  }
</style>
