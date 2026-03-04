<template>
  <div class="level">
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <span>职级列表</span>
        <el-button type="primary" size="small" style="float: right;" @click="addLevel">新增职级</el-button>
      </div>
      <el-table :data="levelList" stripe border>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="职级名称"></el-table-column>
        <el-table-column prop="memberCount" label="人员数量"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="editLevel(scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteLevel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button size="small" @click="batchDelete" style="margin-top:15px;">批量删除</el-button>
    </el-card>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
      <el-form :model="form">
        <el-form-item label="职级名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveLevel">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Level',
  data() {
    return {
      levelList: [],
      dialogVisible: false,
      dialogTitle: '',
      form: {
        id: null,
        name: ''
      }
    };
  },
  mounted() {
    this.fetchLevels();
  },
  methods: {
    fetchLevels() {
      this.levelList = [
        { id: 1, name: '初级', memberCount: 15 },
        { id: 2, name: '中级', memberCount: 8 },
        { id: 3, name: '高级', memberCount: 4 }
      ];
    },
    addLevel() {
      this.dialogTitle = '新增职级';
      this.form = { id: null, name: '' };
      this.dialogVisible = true;
    },
    editLevel(row) {
      this.dialogTitle = '编辑职级';
      this.form = { id: row.id, name: row.name };
      this.dialogVisible = true;
    },
    deleteLevel(row) {
      this.$confirm('确认删除该职级？', '提示').then(() => {
        this.$message.success('删除成功');
        this.fetchLevels();
      });
    },
    batchDelete() {
      this.$message.info('批量删除功能');
    },
    saveLevel() {
      this.$message.success('保存成功');
      this.dialogVisible = false;
      this.fetchLevels();
    }
  }
};
</script>