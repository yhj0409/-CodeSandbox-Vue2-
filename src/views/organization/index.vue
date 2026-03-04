<template>
  <div class="organization">
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card shadow="hover" class="org-tree-card">
          <div slot="header" class="clearfix">
            <span>组织架构</span>
            <el-button type="text" style="float: right; padding: 3px 0" @click="addRootDept">添加根部门</el-button>
          </div>
          <el-tree
            :data="orgTree"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            draggable
            :allow-drop="allowDrop"
            @node-drop="handleDrop"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button type="text" size="mini" @click="() => append(data)">添加子部门</el-button>
                <el-button type="text" size="mini" @click="() => edit(data)">编辑</el-button>
                <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
                <el-button type="text" size="mini" @click="() => viewMembers(data)">人员</el-button>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card shadow="hover" class="member-card">
          <div slot="header" class="clearfix">
            <span>部门成员 - {{ currentDeptName }}</span>
            <el-button type="text" style="float: right; padding: 3px 0" @click="addMember">添加成员</el-button>
          </div>
          <el-table :data="memberList" stripe border>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="phone" label="手机号"></el-table-column>
            <el-table-column prop="position" label="岗位"></el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button type="text" @click="editMember(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteMember(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" size="small" @click="batchImport" style="margin-top:15px;">批量导入</el-button>
          <el-button size="small" @click="batchExport">批量导出</el-button>
        </el-card>
      </el-col>
    </el-row>

    <!-- 部门编辑对话框 -->
    <el-dialog :title="deptDialogTitle" :visible.sync="deptDialogVisible" width="30%">
      <el-form :model="deptForm">
        <el-form-item label="部门名称">
          <el-input v-model="deptForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级部门" v-if="deptForm.parentId">
          <el-input :value="parentDeptName" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="deptDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDept">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Organization',
  data() {
    return {
      orgTree: [],
      currentDeptId: null,
      currentDeptName: '',
      memberList: [],
      deptDialogVisible: false,
      deptDialogTitle: '',
      deptForm: {
        id: null,
        name: '',
        parentId: null
      },
      parentDeptName: ''
    };
  },
  mounted() {
    this.fetchOrgTree();
  },
  methods: {
    fetchOrgTree() {
      // 模拟组织树数据
      this.orgTree = [
        {
          id: 1,
          label: '上海移动',
          children: [
            { id: 2, label: '技术部' },
            { id: 3, label: '市场部' }
          ]
        }
      ];
    },
    fetchMembers(deptId, deptName) {
      this.currentDeptId = deptId;
      this.currentDeptName = deptName;
      // 模拟成员数据
      this.memberList = [
        { id: 1, name: '张三', phone: '13800138001', position: '工程师' },
        { id: 2, name: '李四', phone: '13800138002', position: '经理' }
      ];
    },
    addRootDept() {
      this.deptDialogTitle = '添加根部门';
      this.deptForm = { id: null, name: '', parentId: null };
      this.parentDeptName = '';
      this.deptDialogVisible = true;
    },
    append(data) {
      this.deptDialogTitle = '添加子部门';
      this.deptForm = { id: null, name: '', parentId: data.id };
      this.parentDeptName = data.label;
      this.deptDialogVisible = true;
    },
    edit(data) {
      this.deptDialogTitle = '编辑部门';
      this.deptForm = { id: data.id, name: data.label, parentId: data.parentId };
      // 查找上级部门名称
      this.parentDeptName = '';
      this.deptDialogVisible = true;
    },
    remove(node, data) {
      this.$confirm('确认删除该部门？', '提示').then(() => {
        // 删除逻辑
        this.$message.success('删除成功');
      });
    },
    viewMembers(data) {
      this.fetchMembers(data.id, data.label);
    },
    addMember() {
      this.$message.info('打开添加成员对话框');
    },
    editMember(row) {
      this.$message.info('编辑成员：' + row.name);
    },
    deleteMember(row) {
      this.$confirm('确认删除该成员？', '提示').then(() => {
        this.$message.success('删除成功');
      });
    },
    batchImport() {
      this.$message.info('批量导入');
    },
    batchExport() {
      this.$message.info('批量导出');
    },
    saveDept() {
      // 保存部门
      this.$message.success('保存成功');
      this.deptDialogVisible = false;
      this.fetchOrgTree();
    },
    allowDrop() {
      return true;
    },
    handleDrop(draggingNode, dropNode, dropType) {
      // 处理拖拽排序
    }
  }
};
</script>

<style scoped>
.organization {
  background-color: #f5f7fa;
}
.org-tree-card, .member-card {
  height: calc(100vh - 160px);
  overflow-y: auto;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>