<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;" clearable class="filter-item" @clear="getList" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ (listQuery.page-1)*listQuery.limit+scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卦名" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.guaName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上卦" min-width="150px">
        <template slot-scope="{row}">
          <span v-for="item in guaList" class="link-type" @click="handleUpdate(row)">
            {{ item.id===row.top?item.guaName:"" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="下卦" min-width="150px">
        <template slot-scope="{row}">
          <span v-for="item in guaList" class="link-type" @click="handleUpdate(row)">
            {{ item.id===row.bottom?item.guaName:"" }}
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

    <el-drawer :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="90%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 100%; margin-left:50px;">
        <el-form-item label="卦名" prop="guaName">
          <el-input v-model="temp.guaName" style="width: 90%" />
        </el-form-item>
        <el-form-item label="上卦" prop="top">
          <el-select v-model="temp.top" placeholder="请选择" style="width: 20%">
            <el-option
              v-for="item in guaList"
              :key="item.id"
              :label="item.guaName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="下卦" prop="bottom">
          <el-select v-model="temp.bottom" placeholder="请选择" style="width: 20%">
            <el-option
              v-for="item in guaList"
              :key="item.id"
              :label="item.guaName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="卦词" style="width: 90%">
          <div>
            <tinymce v-if="dialogFormVisible" v-model="temp.guaText" :height="500" />
          </div>
        </el-form-item>
      </el-form>
      <div class="gua-drawer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'
import {
  addBaseGua,
  deleteBaseGua,
  getBaseGuaList,
  getBaseGuaListByName,
  updateBaseGuaList
} from '../../../api/baseGua'
import { getGuaList } from '../../../api/gua'

export default {
  name: 'GuaTable',
  components: { Tinymce, Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      guaList: [],
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        text: null,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        guaName: null,
        guaText: null,
        top: null,
        bottom: null
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
        guaName: [{ required: true, message: '卦名不为空', trigger: 'blur' }],
        top: [{ required: true, message: '上卦不为空', trigger: 'blur' }],
        bottom: [{ required: true, message: '下卦不为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getBaseGuaList(this.listQuery.page, this.listQuery.limit)
        .then(res => {
          console.log(res)
          this.list = res.data.list
          this.total = res.data.total
          this.listLoading = false
        })
      getGuaList()
        .then(res => {
          if (res.code === 0) {
            console.log(res)
            this.guaList = res.data
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
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addBaseGua(this.temp)
            .then(res => {
              if (res.code === 0) {
                this.getList()
                this.dialogFormVisible = false
                this.$notify({
                  title: 'Success',
                  message: '添加成功',
                  type: 'success',
                  duration: 2000
                })
              }
            })
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
          updateBaseGuaList(tempData)
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
      deleteBaseGua(row.id)
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: 'Success',
              message: 'Delete Successfully',
              type: 'success',
              duration: 2000
            })
            this.list.splice(index, 1)
          }
        })
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style lang="scss">
  .gua{
    width: 100%;
  }
  .gua-drawer{
    width: 20%;
    margin: auto;
  }
</style>
