<template>
  <div class="app-container">
    <div class="filter-container">
      卦：
      <el-select v-model="listQuery.gua" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in guaList" :key="item.id" :label="item.guaName" :value="item.id" />
      </el-select>
      类别：
      <el-select v-model="listQuery.category" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in categoryList" :key="item.id" :label="item.categoryName" :value="item.id" />
      </el-select>
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
      <el-table-column label="类名" min-width="150px">
        <template slot-scope="{row}">
          <span v-for="item in categoryList" class="link-type" @click="handleUpdate(row)">
            {{ item.id===row.categoryId?item.categoryName:"" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="卦名" min-width="150px">
        <template slot-scope="{row}">
          <span v-for="item in guaList" class="link-type" @click="handleUpdate(row)">
            {{ item.id===row.baseGuaId?item.guaName:"" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="爻名" min-width="150px">
        <template slot-scope="{row}">
          <span v-for="item in yaoList" class="link-type" @click="handleUpdate(row)">
            {{ item.id===row.yaoId?item.yaoName:"" }}
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
        <el-form-item label="本卦" prop="baseGuaId">
          <el-select v-model="temp.baseGuaId" placeholder="请选择" style="width: 20%" @change="selectBaseGua(temp.baseGuaId)">
            <el-option
              v-for="item in guaList"
              :key="item.id"
              :label="item.guaName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="爻" prop="yaoId">
          <el-select v-model="temp.yaoId" placeholder="请选择" style="width: 20%">
            <el-option
              v-for="item in yaoList"
              :key="item.id"
              :label="item.yaoName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类名" prop="categoryId">
          <el-select v-model="temp.categoryId" placeholder="请选择" style="width: 20%">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="解词" style="width: 90%">
          <div>
            <tinymce v-if="dialogFormVisible" v-model="temp.predictionText" :height="500" />
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
import { fetchPv } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'
import { addBaseGua, deleteBaseGua, getBaseGua, getBaseGuaList, updateBaseGuaList } from '../../../api/baseGua'
import { getGuaList } from '../../../api/gua'
import { addYao, deleteYao, getYaoList, getYaoListByBaseGuaId, getYaoListPage, updateYaoList } from '../../../api/yao'
import {
  addPrediction,
  deletePrediction,
  getPredictionPage,
  getPredictionPageCidAndGid,
  updatePrediction
} from '../../../api/prediction'
import { getPredictionCategoryList } from '../../../api/predictionCategory'

export default {
  name: 'Prediction',
  components: { Tinymce, Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      guaList: [],
      yaoList: [],
      categoryList: [],
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        gua: undefined,
        category: undefined,
        text: null,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID 升序', key: '+id' }, { label: 'ID 降序', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        yaoId: null,
        categoryId: null,
        baseGuaId: null,
        predictionText: null
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
        baseGuaId: [{ required: true, message: '卦名不为空', trigger: 'blur' }],
        yaoId: [{ required: true, message: '爻名不为空', trigger: 'blur' }],
        categoryId: [{ required: true, message: '类名不为空', trigger: 'blur' }]
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
      getPredictionPage(this.listQuery.page, this.listQuery.limit)
        .then(res => {
          console.log(res)
          this.list = res.data.list
          this.total = res.data.total
          this.listLoading = false
        })
      getBaseGua()
        .then(res => {
          if (res.code === 0) {
            console.log(res)
            this.guaList = res.data
          }
        })
      getYaoList()
        .then(res => {
          if (res.code === 0) {
            this.yaoList = res.data
          }
        })

      getPredictionCategoryList()
        .then(res => {
          if (res.code === 0) {
            this.categoryList = res.data
          }
        })
    },
    handleFilter() {
      if (this.listQuery.category !== undefined && this.listQuery.gua !== undefined) {
        this.listLoading = true
        getPredictionPageCidAndGid(this.listQuery.page, this.listQuery.limit, this.listQuery.gua, this.listQuery.category)
          .then(res => {
            console.log(res)
            this.list = res.data.list
            this.total = res.data.total
            this.listLoading = false
          })
      }
    },
    selectBaseGua(id) {
      getYaoListByBaseGuaId(id)
        .then(res => {
          if (res.code === 0) {
            this.yaoList = res.data
          }
        })
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
          console.log(this.temp)
          addPrediction(this.temp)
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
      this.selectBaseGua(this.temp.baseGuaId)
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
          updatePrediction(tempData)
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
      deletePrediction(row.id)
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
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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
