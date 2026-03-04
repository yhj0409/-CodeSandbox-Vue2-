<template>
  <div class="access-record">
    <el-card shadow="hover" class="filter-card">
      <el-form :inline="true" :model="filters" size="small" label-width="100px">
        <el-form-item label="停车场">
          <el-select v-model="filters.parkingLot" placeholder="全部" clearable style="width: 150px;">
            <el-option label="南停车场" value="南停车场"></el-option>
            <el-option label="北停车场" value="北停车场"></el-option>
            <el-option label="地下B1" value="地下B1"></el-option>
            <el-option label="地面停车场" value="地面停车场"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入场时间">
          <el-date-picker
            v-model="entryTimeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="handleEntryTimeChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="出场时间">
          <el-date-picker
            v-model="exitTimeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="handleExitTimeChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input v-model="filters.plateNumber" placeholder="粤B..." clearable style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="通行类型">
          <el-select v-model="filters.passType" placeholder="全部" clearable style="width: 120px;">
            <el-option label="临时车" value="临时车"></el-option>
            <el-option label="月卡车" value="月卡车"></el-option>
            <el-option label="白名单" value="白名单"></el-option>
            <el-option label="VIP" value="VIP"></el-option>
            <el-option label="异常" value="异常"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" icon="el-icon-search">查询</el-button>
          <el-button @click="resetFilters">重置</el-button>
          <el-button type="success" @click="exportData" icon="el-icon-download">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover" style="margin-top: 20px;">
      <el-table
        :data="displayRecords"
        v-loading="loading"
        stripe
        border
        @sort-change="handleSortChange"
        style="width: 100%"
      >
        <el-table-column prop="plateNumber" label="车牌号" width="150" fixed></el-table-column>
        <el-table-column prop="parkingLot" label="停车场" width="150"></el-table-column>
        <el-table-column prop="entryTime" label="入场时间" width="180" sortable="custom"></el-table-column>
        <el-table-column prop="exitTime" label="出场时间" width="180" sortable="custom">
          <template slot-scope="scope">{{ scope.row.exitTime || '未出场' }}</template>
        </el-table-column>
        <el-table-column prop="passType" label="通行类型" width="120"></el-table-column>
        <el-table-column prop="duration" label="停车时长(分钟)" width="150" sortable="custom"></el-table-column>
        <el-table-column label="入场照片" width="100" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.entryImage" style="width: 40px; height: 40px;" fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="出场照片" width="100" align="center">
          <template slot-scope="scope">
            <el-image v-if="scope.row.exitImage" :src="scope.row.exitImage" style="width: 40px; height: 40px;" fit="cover"></el-image>
            <span v-else>—</span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 20px; text-align: right;"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { exportCSV } from '@/utils/export';

export default {
  name: 'AccessRecord',
  data() {
    return {
      filters: {
        parkingLot: '',
        plateNumber: '',
        startEntryTime: '',
        endEntryTime: '',
        startExitTime: '',
        endExitTime: '',
        passType: ''
      },
      entryTimeRange: [],
      exitTimeRange: [],
      pagination: {
        page: 1,
        pageSize: 10
      },
      sort: { prop: '', order: '' },
      localRecords: [],
      total: 0,
      loading: false
    };
  },
  computed: {
    ...mapState(['records']),
    displayRecords() {
      let list = [...this.records];
      if (this.sort.prop && this.sort.order) {
        list.sort((a, b) => {
          let valA = a[this.sort.prop];
          let valB = b[this.sort.prop];
          if (this.sort.prop === 'entryTime' || this.sort.prop === 'exitTime') {
            valA = new Date(valA || 0).getTime();
            valB = new Date(valB || 0).getTime();
          }
          if (this.sort.order === 'ascending') {
            return valA > valB ? 1 : -1;
          } else {
            return valA < valB ? 1 : -1;
          }
        });
      }
      return list;
    }
  },
  methods: {
    fetchData() {
      this.loading = true;
      const params = {
        page: this.pagination.page,
        pageSize: this.pagination.pageSize,
        ...this.filters
      };
      this.$store.dispatch('fetchRecords', params).finally(() => {
        this.loading = false;
      });
    },
    handleEntryTimeChange(val) {
      if (val) {
        this.filters.startEntryTime = val[0];
        this.filters.endEntryTime = val[1];
      } else {
        this.filters.startEntryTime = '';
        this.filters.endEntryTime = '';
      }
    },
    handleExitTimeChange(val) {
      if (val) {
        this.filters.startExitTime = val[0];
        this.filters.endExitTime = val[1];
      } else {
        this.filters.startExitTime = '';
        this.filters.endExitTime = '';
      }
    },
    handleSearch() {
      this.pagination.page = 1;
      this.fetchData();
    },
    resetFilters() {
      this.filters = {
        parkingLot: '',
        plateNumber: '',
        startEntryTime: '',
        endEntryTime: '',
        startExitTime: '',
        endExitTime: '',
        passType: ''
      };
      this.entryTimeRange = [];
      this.exitTimeRange = [];
      this.handleSearch();
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.pagination.page = 1;
      this.fetchData();
    },
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.fetchData();
    },
    handleSortChange({ prop, order }) {
      this.sort = { prop, order };
    },
    exportData() {
      const params = {
        page: 1,
        pageSize: 10000,
        ...this.filters
      };
      this.$store.dispatch('fetchRecords', params).then(() => {
        const allFiltered = this.$store.state.records;
        const exportList = allFiltered.map(r => ({
          ...r,
          exitTime: r.exitTime || '未出场',
          duration: r.duration ? r.duration + '分钟' : '-'
        }));
        exportCSV(exportList, '出入记录.csv');
      });
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
.access-record {
  background-color: #f5f7fa;
}
.filter-card {
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}
</style>
