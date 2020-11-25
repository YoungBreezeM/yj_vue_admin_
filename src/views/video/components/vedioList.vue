<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="searchId"
        clearable
        placeholder="请选择视频类型"
        style="width: 10%"
        @clear="getList"
        @change="toSearch(searchId)"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.id"
          :label="item.categoryName"
          :value="item.id"
        />
      </el-select>
      <VideoUpload size="medium" color="#1890ff" style="margin-left: 10px;" class="editor-upload-btn filter-item" @successCBK="imageSuccessCBK"></VideoUpload>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ (listQuery.page-1)*listQuery.limit+scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件名" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.videoName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预览">
        <template slot-scope="{row}">
          <video @click="handleUpdate(row)" width="100" height="50" v-bind:src="host+row.videoUrl"></video>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="大小" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ renderSize(row.size) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" min-width="150px">
        <template slot-scope="{row}">
          <span>
            {{ new Date(row.createdTime).format("yyyy-MM-dd hh:mm:ss") }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-drawer :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="30%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 100%; margin-left:50px;">
        <el-form-item label="视频">
          <video style="width: 70%;height: 200px;" v-bind:src="host+temp.videoUrl" controls="controls"></video>
        </el-form-item>
        <el-form-item label="文件名" prop="videoName">
          <el-input v-model="temp.videoName" style="width: 60%" />
        </el-form-item>
        <el-form-item label="图片分类" prop="categoryId">
          <el-select v-model="temp.videoCategoryId" placeholder="请选择" style="width: 50%">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文件路径" prop="url">
          {{ host+temp.videoUrl }}
          <el-button type="primary" icon="el-icon-document" @click="handleCopy(host+temp.url,$event)">
            复制
          </el-button>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          {{ temp.type }}
        </el-form-item>
        <el-form-item label="大小" prop="size" style="width: 90%">
          {{ renderSize(temp.size) }}
        </el-form-item>
        <el-form-item label="上传时间" prop="uploadTime" style="width: 90%">
          {{ new Date(temp.createdTime).format("yyyy-MM-dd hh:mm:ss") }}
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            确认
          </el-button>
        </el-form-item>
      </el-form>

    </el-drawer>
  </div>
</template>

<script>


import Pagination from '@/components/Pagination'

import { renderSize, formatTime } from '../../../utils/format'
import clip from '@/utils/clipboard'

import { deleteVideo, getVideoCategory, getVideoList, getVideoListByCid, updateVideoList } from '@/api/video'
import VideoUpload from '@/views/video/components/VideoUpload'

export default {
  name: 'VideoList',
  components: { VideoUpload, Pagination },
  data() {
    return {
      renderSize: renderSize,
      fileList: [],
      searchId: null,
      list: null,
      host: process.env.VUE_APP_BASE_API,
      total: 0,
      temp: {
        id: undefined,
        videoName: null,
        videoCategoryId: null,
        videoUrl: null,
        type: null,
        size: null,
        createdTime: null
      },
      tableKey: 0,
      listLoading: true,
      categoryList: [],
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        text: null,
        sort: '+id'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        videoName: [{ required: true, message: '文件名不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    formatTime()
    this.getList()
  },
  methods: {
    handleCopy(text, event) {
      clip(text, event)
    },
    toSearch(id) {
      getVideoListByCid(this.listQuery.page, this.listQuery.limit, id)
        .then(res => {
          console.log(res)
          if (res.code === 0) {
            this.list = res.data.list
            this.total = res.data.total
            this.listLoading = false
          }
        })
      console.log(id)
    },
    getList() {
      this.listLoading = true
      getVideoList(this.listQuery.page, this.listQuery.limit)
        .then(res => {
          console.log(res)
          this.list = res.data.list
          this.total = res.data.total
          this.listLoading = false
        })

      getVideoCategory()
        .then(res => {
          if (res.code === 0) {
            this.categoryList = res.data
          }
        })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateVideoList(tempData)
            .then(res => {
              if (res.code === 0) {
                this.dialogFormVisible = false
                this.getList()
                this.$notify({
                  title: 'Success',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                })
              }
            })
        }
      })
    },
    handleDelete(row, index) {
      console.log(row)
      deleteVideo(row.id)
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: 'Success',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.list.splice(index, 1)
          }
        })
    },
    imageSuccessCBK(arr) {
      this.getList()
      this.$notify({
        title: 'Success',
        message: '添加成功',
        type: 'success',
        duration: 2000
      })
    }
  }
}
</script>

<style lang="scss">
  .gua{
    width: 100%;
  }
</style>
