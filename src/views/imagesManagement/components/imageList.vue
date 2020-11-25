<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="searchId"
        clearable
        placeholder="请选择图片类型"
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
      <editorImage size="medium" color="#1890ff" style="margin-left: 10px;" class="editor-upload-btn filter-item" @successCBK="imageSuccessCBK" />
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
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预览">
        <template slot-scope="{row}">
          <el-image
            style="width: 100px; height: 60px"
            :src="host+row.url"
            :preview-src-list="[host+row.url]"
          />
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="大小" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ renderSize(row.magnitude) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" min-width="150px">
        <template slot-scope="{row}">
          <span>
            {{ new Date(row.uploadTime).format("yyyy-MM-dd hh:mm:ss") }}
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
        <el-form-item label="图片">
          <el-image
            style="width: 70%;height: 200px;"
            :src="host+temp.url"
            :preview-src-list="[host+temp.url]"
          />
        </el-form-item>
        <el-form-item label="文件名" prop="name">
          <el-input v-model="temp.name" style="width: 60%" />
        </el-form-item>
        <el-form-item label="图片分类" prop="categoryId">
          <el-select v-model="temp.categoryId" placeholder="请选择" style="width: 50%">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文件路径" prop="url">
          {{ host+temp.url }}
          <el-button type="primary" icon="el-icon-document" @click="handleCopy(host+temp.url,$event)">
            复制
          </el-button>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          {{ temp.type }}
        </el-form-item>
        <el-form-item label="大小" prop="size" style="width: 90%">
          {{ renderSize(temp.magnitude) }}
        </el-form-item>
        <el-form-item label="上传时间" prop="uploadTime" style="width: 90%">
          {{ new Date(temp.uploadTime).format("yyyy-MM-dd hh:mm:ss") }}
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
import waves from '@/directive/waves' // waves directive
import EditorImage from '../../../components/Tinymce/components/EditorImage'
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'

import {
  getBaseGuaListByName
} from '../../../api/baseGua'

import { deleteImages, getImagesList, getImagesListByCid, updateImagesList } from '../../../api/images'
import { renderSize, formatTime } from '../../../utils/format'
import clip from '@/utils/clipboard'
import { getImagesCategory } from '../../../api/imagesCategory'

export default {
  name: 'ImageList',
  components: { Tinymce, Pagination, EditorImage },
  directives: { waves },
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
        name: null,
        categoryId: null,
        url: null,
        type: null,
        magnitude: null,
        uploadTime: null
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
        name: [{ required: true, message: '文件名不能为空', trigger: 'blur' }]
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
      getImagesListByCid(this.listQuery.page, this.listQuery.limit, id)
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
      getImagesList(this.listQuery.page, this.listQuery.limit)
        .then(res => {
          console.log(res)
          this.list = res.data.list
          this.total = res.data.total
          this.listLoading = false
        })

      getImagesCategory()
        .then(res => {
          if (res.code === 0) {
            this.categoryList = res.data
          }
        })
    },
    handleFilter() {
      if (this.listQuery.title !== '') {
        this.listQuery.page = 1
        this.listLoading = true
        getBaseGuaListByName(this.listQuery.page, this.listQuery.limit, this.listQuery.title)
          .then(res => {
            console.log(res)
            this.list = res.data.list
            this.total = res.data.total
            this.listLoading = false
          })
      }
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
          updateImagesList(tempData)
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
      deleteImages(row.id)
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
