<template>
  <div class="app-container">
    <div class="filter-container">

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
      <el-table-column label="openId" min-width="150px">
        <template slot-scope="{row}">
          {{ row.openId }}
        </template>
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="{row}">
          {{ row.nickName }}
        </template>
      </el-table-column>
      <el-table-column label="头像" min-width="60px">
        <template slot-scope="{row}">
          <el-image
            style="width: 60px; height: 60px"
            :src="row.avatarUrl"
            :preview-src-list="[row.avatarUrl]"
          />
        </template>
      </el-table-column>
      <el-table-column label="积分" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">
             {{ row.integral}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="手机" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">
             {{ row.phone}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="150px">
        <template slot-scope="{row}">
          <el-button v-if="!row.status" type="danger" @click="handleUpdate(row)">禁用中</el-button>
          <el-button v-if="row.status" type="success" @click="handleUpdate(row)">启用中</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!=='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>

    <el-drawer :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="30%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px"
               style="width: 100%; margin-left:50px;">
        <el-form-item label="头像">
          <el-image
            style="width: 60px; height: 60px"
            :src="temp.avatarUrl"
            :preview-src-list="[temp.avatarUrl]"
          />
        </el-form-item>
        <el-form-item label="用户名" prop="nickName">
          {{temp.nickName}}
        </el-form-item>
        <el-form-item label="openId" prop="openId">
          {{temp.openId}}
        </el-form-item>
        <el-form-item label="积分" prop="integral">
          <el-input v-model="temp.integral"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="temp.phone"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="phone">
          <el-radio-group v-model="temp.status">
            <el-radio-button label="true">启用</el-radio-button>
            <el-radio-button label="false">禁用</el-radio-button>
          </el-radio-group>
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

    <el-dialog
      title="确认删除"
      :visible.sync="dialog"
      width="35%">
      <p>您确定删除<b style="color:red;font-size: 20px;">{{deleteContent}}</b>的信息吗?</p>
      <p>删除后用户相关信息将消失,确认请输入管理员账户密码进行删除！</p>
      <el-form ref="adminForm" :rules="adminRules" :model="adminInfo" label-position="left" label-width="70px"
               style="width: 80%; margin-left:20px;">

        <el-form-item label="账号" prop="username">
          <el-input v-model="adminInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="adminInfo.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteOneClient" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

  import Pagination from '@/components/Pagination/index'
  import { addVideoCategory, deleteVideoCategory, getVideoCategoryList, updateVideoCategoryList } from '@/api/video'
  import { addClient, deleteClient, getClientList, updateClientList } from '@/api/client'

  export default {
    name: 'client',
    components: { Pagination },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        dialog: false,
        adminInfo:{
          username:null,
          password:null
        },
        adminRules:{
          username: [{ required: true, message: '管理员账号不能为空', trigger: 'blur' }],
          password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
        },
        deleteContent: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          text: null,
          sort: '+id'
        },
        showReviewer: false,
        temp: {
          id: undefined,
          openId: null,
          phone: null,
          integral: null,
          status: null,
          nickName: null,
          avatarUrl: null

        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        dialogPvVisible: false,
        rules: {
          categoryName: [{ required: true, message: '类名不能为空', trigger: 'blur' }]
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
        getClientList(this.listQuery.page, this.listQuery.limit)
          .then(res => {
            console.log(res)
            this.list = res.data.list
            this.total = res.data.total
            this.listLoading = false
          })
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作Success',
          type: 'success'
        })
        row.status = status
      },
      handleCreate() {
        this.temp = {
          id: undefined,
          openId: null,
          phone: null,
          integral: null,
          status: null,
          nickName: null,
          avatarUrl: null
        };
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
            addClient(this.temp)
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
        console.log(this.temp)
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
            console.log(tempData)
            updateClientList(tempData)
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
      handleDelete(row) {
        this.dialog = true
        this.deleteContent = row.nickName
        this.temp.id = row.id;

      },
      deleteOneClient(){
        this.$refs['adminForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.adminInfo)
            console.log(tempData)
            deleteClient(this.temp.id,tempData)
              .then(res => {
                if (res.code === 0) {
                  this.$notify({
                    title: 'Success',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.getList();
                  this.dialog = false;
                }
              })

          }
        })
      }

    }
  }
</script>

<style lang="scss">
  .gua {
    width: 100%;
  }

  .gua-drawer {
    width: 20%;
    margin: auto;
  }
</style>
