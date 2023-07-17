<template>
  <div>
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <vue3-pro-table
      :padding-left="paddingLeft"
      :padding-right="paddingRight"
      :loadTableDataBeforeMount="true"
      :columns="columns"
      :pagination="pagination"
      :request="request"
      :search="search"
    />
  </div>
</template>

<script lang="ts" setup>
import { getMockData } from './utils';
import { onMounted, ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import Vue3ProTable from './components/Vue3ProTable.vue';

const paddingLeft = ref(0);
const paddingRight = ref(0);
const columns = [
  { label: '字段1', prop: 'field1' },
  { label: '字段2', prop: 'field2' },
  { label: '字段3', prop: 'field3' },
  { label: '字段4', prop: 'field4' },
];
const pagination = {
  pageSizes: [10, 24, 40, 50, 100],
  style: {
    border: '1px solid skyblue',
  },
};
const request = async (params: { pageNum: number, pageSize: number }) => {
  const list = getMockData(params);
  return {
    data: list,
    total: 100,
  };
};
const search = {
  fields: [
    {
      label: 'admin字段1',
      name: 'field1',
      type: 'text',
    },
    {
      label: 'admin字段2',
      name: 'field2',
      type: 'text',
    },
    {
      label: 'admin字段3',
      name: 'field3',
      type: 'text',
    },
    {
      label: 'admin字段4',
      name: 'field4',
      type: 'text',
    },
  ],
};

onMounted(() => {
  // 效果： padding left 和 right 每秒自动加10。若 pagination.style 为对象且未指定padding，则 paddingLeft 和 paddingRight 仍应生效。
  const f = (dep: number) => {
    if (dep >= 10) return;
    setTimeout(() => {
      paddingLeft.value += 10;
      paddingRight.value += 10;
      f(dep + 1);
    }, 1000);
  };
  f(0);
});
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
