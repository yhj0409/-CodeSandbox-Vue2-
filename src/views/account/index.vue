<template>
  <div class="account">
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <span>账号管理</span>
        <el-button type="primary" size="small" style="float: right;" @click="addAccount">新建账号</el-button>
      </div>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="accountList" stripe border>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button type="text" @click="editAccount(scope.row)">编辑</el-button>
            <el-button type="text" @click="resetPassword(scope.row)">重置密码</el-button>
            <el-button type="text" @click="deleteAccount(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.page"
        :page-sizes="[10, 20, 50]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top:15px; text-align:right;">
      </el-pagination>
    </el-card>

    <!-- 账号编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-form :model="form" label-width="80px">
        <el-form-item label="选择人员">
          <el-select v-model="form.userId" placeholder="请选择人员" filterable>
            <el-option label="张三" value="1"></el-option>
            <el-option label="李四" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择角色">
          <el-select v-model="form.roles" multiple placeholder="请选择角色">
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="车场管理员" value="park"></el-option>
            <el-option label="财务" value="finance"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAccount">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Account',
  data() {
    return {
      searchForm: {
        name: '',
        phone: ''
      },
      accountList: [],
      total: 0,
      pagination: {
        page: 1,
        pageSize: 10
      },
      dialogVisible: false,
      dialogTitle: '',
      form: {
        id: null,
        userId: '',
        roles: []
      }
    };
  },
  mounted() {
    this.fetchAccounts();
  },
  methods: {
    fetchAccounts() {
      // mock数据
      this.accountList = [
        { id: 1, name: '张三', phone: '13800138001', role: '管理员' },
        { id: 2, name: '李四', phone: '13800138002', role: '车场管理员' }
      ];
      this.total = this.accountList.length;
    },
    handleSearch() {
      this.pagination.page = 1;
      this.fetchAccounts();
    },
    resetSearch() {
      this.searchForm = { name: '', phone: '' };
      this.handleSearch();
    },
    addAccount() {
      this.dialogTitle = '新建账号';
      this.form = { id: null, userId: '', roles: [] };
      this.dialogVisible = true;
    },
    editAccount(row) {
      this.dialogTitle = '编辑账号';
      this.form = { id: row.id, userId: row.id, roles: ['admin'] }; // 简化
      this.dialogVisible = true;
    },
    resetPassword(row) {
      this.$confirm(`确认重置用户 ${row.name} 的密码？`, '提示').then(() => {
        this.$message.success('密码已重置为随机密码，短信已发送');
      });
    },
    deleteAccount(row) {
      this.$confirm('确认删除该账号？', '提示').then(() => {
        this.$message.success('删除成功');
        this.fetchAccounts();
      });
    },
    saveAccount() {
      this.$message.success('保存成功，短信已发送');
      this.dialogVisible = false;
      this.fetchAccounts();
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.fetchAccounts();
    },
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.fetchAccounts();
    }
  }
};
</script>