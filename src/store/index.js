import Vue from 'vue';
import Vuex from 'vuex';
import { getStatistics, getAccessRecords } from '@/api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    statistics: {},
    records: [],
    totalRecords: 0,
    loading: false
  },
  mutations: {
    SET_STATISTICS(state, payload) {
      state.statistics = payload;
    },
    SET_RECORDS(state, { list, total }) {
      state.records = list;
      state.totalRecords = total;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    }
  },
  actions: {
    async fetchStatistics({ commit }) {
      commit('SET_LOADING', true);
      try {
        const res = await getStatistics();
        commit('SET_STATISTICS', res.data);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async fetchRecords({ commit }, params = {}) {
      commit('SET_LOADING', true);
      try {
        const res = await getAccessRecords(params);
        commit('SET_RECORDS', { list: res.data.list, total: res.data.total });
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
});
