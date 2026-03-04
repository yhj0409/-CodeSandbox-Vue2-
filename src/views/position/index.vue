<template>
  <div class="position">
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <span>岗位列表</span>
        <el-button type="primary" size="small" style="float: right;" @click="addPosition">新增岗位</el-button>
      </div>
      <el-table :data="positionList" stripe border>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="岗位名称"></el-table-column>
        <el-table-column prop="memberCount" label="人员数量"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="editPosition(scope.row)">编辑</el-button>
            <el-button type="text" @click="deletePosition(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button size="small" @click="batchDelete" style="margin-top:15px;">批量删除</el-button>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
      <el-form :model="form">
        <el-form-item label="岗位名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePosition">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Position',
  data() {
    return {
      positionList: [],
      dialogVisible: false,
      dialogTitle: '',
      form: {
        id: null,
        name: ''
      }
    };
  },
  mounted() {
    this.fetchPositions();
  },
  methods: {
    fetchPositions() {
      // mock数据
      this.positionList = [
        { id: 1, name: '工程师', memberCount: 10 },
        { id: 2, name: '经理', memberCount: 3 },
        { id: 3, name: '保安', memberCount: 8 }
      ];
    },
    addPosition() {
      this.dialogTitle = '新增岗位';
      this.form = { id: null, name: '' };
      this.dialogVisible = true;
    },
    editPosition(row) {
      this.dialogTitle = '编辑岗位';
      this.form = { id: row.id, name: row.name };
      this.dialogVisible = true;
    },
    deletePosition(row) {
      this.$confirm('确认删除该岗位？', '提示').then(() => {
        this.$message.success('删除成功');
        this.fetchPositions();
      });
    },
    batchDelete() {
      this.$message.info('批量删除功能');
    },
    savePosition() {
      this.$message.success('保存成功');
      this.dialogVisible = false;
      this.fetchPositions();
    }
  }
};
</script>