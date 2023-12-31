<template>
  <div class="page-box" v-loading="loading">
    <!-- 搜索选项 -->

    <el-form
      v-if="!!search"
      class="search"
      :model="searchModel"
      :inline="true"
      label-position="left"
      :label-width="search.labelWidth"
      ref="searchForm"
      :style="searchAreaStyle"
    >
      <el-form-item
        v-for="item in search.fields"
        :key="item.name"
        :label="item.label"
        :prop="item.name"
      >
        <slot v-if="item.type === 'custom'" :name="item.slot" />
        <el-select
          v-else-if="item.type === 'select'"
          v-model="searchModel[item.name]"
          :filterable="!!item.filterable"
          :multiple="!!item.multiple"
          clearable
          :placeholder="`请选择${item.label}`"
          :style="{ width: search.inputWidth, ...item.style }"
        >
          <el-option
            v-for="option of item.options"
            :key="option.value"
            :label="option.name"
            :value="option.value"
          ></el-option>
        </el-select>
        <el-radio-group
          v-model="searchModel[item.name]"
          v-else-if="item.type === 'radio'"
          :style="{ width: search.inputWidth, ...item.style }"
        >
          <el-radio
            v-for="option of item.options"
            :key="option.value"
            :label="option.value"
            >{{ option.name }}</el-radio
          >
        </el-radio-group>
        <el-radio-group
          v-model="searchModel[item.name]"
          v-else-if="item.type === 'radio-button'"
          :style="{ width: search.inputWidth, ...item.style }"
        >
          <el-radio-button
            v-for="option of item.options"
            :key="option.value"
            :label="option.value"
            >{{ option.name }}</el-radio-button
          >
        </el-radio-group>
        <el-checkbox-group
          v-model="searchModel[item.name]"
          v-else-if="item.type === 'checkbox'"
          :style="{ width: search.inputWidth, ...item.style }"
        >
          <el-checkbox
            v-for="option of item.options"
            :key="option.value"
            :label="option.value"
            >{{ option.name }}</el-checkbox
          >
        </el-checkbox-group>
        <el-checkbox-group
          v-model="searchModel[item.name]"
          v-else-if="item.type === 'checkbox-button'"
          :style="{ width: search.inputWidth, ...item.style }"
        >
          <el-checkbox-button
            v-for="option of item.options"
            :key="option.value"
            :label="option.value"
            >{{ option.name }}</el-checkbox-button
          >
        </el-checkbox-group>
        <el-date-picker
          v-else-if="item.type === 'date'"
          v-model="searchModel[item.name]"
          type="date"
          format="YYYY-MM-DD"
          clearable
          @change="handleDateChange($event, item, 'YYYY-MM-DD')"
          :placeholder="`请选择${item.label}`"
          :style="{ width: search.inputWidth, ...item.style }"
        ></el-date-picker>
        <el-date-picker
          v-else-if="item.type === 'datetime'"
          v-model="searchModel[item.name]"
          type="datetime"
          clearable
          @change="handleDateChange($event, item, 'YYYY-MM-DD HH:mm:ss')"
          format="YYYY-MM-DD HH:mm:ss"
          :placeholder="`请选择${item.label}`"
          :style="{ width: search.inputWidth, ...item.style }"
        ></el-date-picker>
        <el-date-picker
          v-else-if="item.type === 'daterange'"
          v-model="searchModel[item.name]"
          type="daterange"
          format="YYYY-MM-DD"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          clearable
          @change="handleRangeChange($event, item, 'YYYY-MM-DD')"
          :style="{ width: search.inputWidth, ...item.style }"
        ></el-date-picker>
        <el-date-picker
          v-else-if="item.type === 'datetimerange'"
          v-model="searchModel[item.name]"
          type="datetimerange"
          format="YYYY-MM-DD HH:mm:ss"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          clearable
          @change="handleRangeChange($event, item, 'YYYY-MM-DD HH:mm:ss')"
          :style="{ width: search.inputWidth, ...item.style }"
        ></el-date-picker>
        <el-input-number
          v-else-if="item.type === 'number'"
          v-model="searchModel[item.name]"
          :placeholder="`请输入${item.label}`"
          controls-position="right"
          :min="item.min"
          :max="item.max"
          :style="{ width: search.inputWidth, ...item.style }"
        />
        <el-input
          v-else-if="item.type === 'textarea'"
          type="textarea"
          clearable
          v-model="searchModel[item.name]"
          :placeholder="`请输入${item.label}`"
          :style="{ width: search.inputWidth, ...item.style }"
        ></el-input>
        <el-input
          v-else
          v-model="searchModel[item.name]"
          clearable
          :placeholder="`请输入${item.label}`"
          :style="{ width: search.inputWidth, ...item.style }"
        ></el-input>
      </el-form-item>
      <el-form-item class="search-btn">
        <el-button
          type="primary"
          @click="handleSearch"
        >
          <search class="btn-icon" />查询
        </el-button>
        <el-button
          @click="handleReset"
        >
          <refresh-right class="btn-icon" />重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- title 和 工具栏 -->
    <div class="head" v-if="!hideTitleBar" :style="headAreaStyle">
      <slot name="title">
        <span class="title">{{ title }}</span>
      </slot>
      <div class="toolbar">
        <slot name="toolbar"></slot>
      </div>
    </div>
    <!-- table表格栏 -->
    <div class="table" :style="tableAreaStyle">
      <el-table
        :data="tableData"
        :row-key="rowKey"
        :tree-props="tree.treeProps"
        :lazy="tree.lazy"
        :load="tree.load"
        tooltip-effect="dark"
        stripe
        :border="border"
        @selection-change="handleSelectionChange"
        ref="table"
      >
        <el-table-column
          v-for="item in columns"
          :key="item.label"
          :filter-method="item.filters && filterHandler"
          :show-overflow-tooltip="!item.wrap"
          v-bind="item"
        >
          <template #header="scope" v-if="!!item.labelSlot">
            <slot :name="item.labelSlot" v-bind="scope"></slot>
          </template>
          <template #default="scope" v-if="!!item.tdSlot">
            <slot :name="item.tdSlot" v-bind="scope"></slot>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination
      v-if="paginationConfig.show && total > 0"
      class="pagination"
      :style="paginationAreaStyle"
      @size-change="handleSizeChange"
      v-model:currentPage="pageNum"
      @current-change="handleCurrentChange"
      :page-sizes="paginationConfig.pageSizes"
      v-model:pageSize="pageSize"
      :layout="paginationConfig.layout"
      :total="total"
    />
  </div>
</template>

<script>
// modify from https://github.com/huzhushan/vue3-pro-table/tree/master
import { RefreshRight, Search } from '@element-plus/icons-vue';
import {
  computed, defineComponent, onBeforeMount, reactive, toRefs,
} from 'vue';

const formatDate = (date, dateFormat) => {
  let format = dateFormat;
  const obj = {
    'D+': date.getDate(),
    'H+': date.getHours(),
    'M+': date.getMonth() + 1,
    'S+': date.getMilliseconds(),
    'm+': date.getMinutes(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    's+': date.getSeconds(),
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(
      RegExp.$1,
      (`${date.getFullYear()}`).substr(4 - RegExp.$1.length),
    );
  }
  Object.entries(obj).forEach(([k, v]) => {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? v
          : (`00${v}`).substr((`${v}`).length),
      );
    }
  });
  return format;
};
const getSearchModel = (search) => {
  const searchModel = {};
  if (search && search.fields) {
    search.fields.forEach((item) => {
      switch (item.type) {
        case 'checkbox':
        case 'checkbox-button':
          searchModel[item.name] = [];
          break;
        default:
          break;
      }
      if (item.defaultValue !== undefined) {
        searchModel[item.name] = item.defaultValue;
        // 日期范围和时间范围真实变量默认值
        if (
          (item.type === 'daterange' || item.type === 'datetimerange')
          && !!item.trueNames
          && Array.isArray(item.defaultValue)
        ) {
          item.defaultValue.forEach((val, index) => {
            searchModel[item.trueNames[index]] = val;
          });
        }
      }
    });
  }
  return searchModel;
};
export default defineComponent({
  components: { RefreshRight, Search },
  props: {
    blockRedundantRequestOnReset: {
      default: false,
      type: Boolean,
    },
    border: {
      default: false,
      type: Boolean,
    },
    // 表头配置
    columns: {
      default() {
        return [];
      },
      type: Array,
    },
    // 是否隐藏标题栏
    hideTitleBar: {
      default: false,
      type: Boolean,
    },
    loadTableDataBeforeMount: {
      default: false,
      type: Boolean,
    },
    paddingLeft: {
      default: 0,
      type: [String, Number],
    },
    paddingRight: {
      default: 0,
      type: [String, Number],
    },
    // 分页配置，false表示不显示分页
    pagination: {
      default: () => ({}),
      type: [Boolean, Object],
    },
    // 请求数据的方法
    request: {
      type: Function,
    },
    // 行数据的Key，同elementUI的table组件的row-key
    rowKey: {
      default: 'id',
      type: String,
    },
    // 搜索表单配置，false表示不显示搜索表单
    search: {
      default: false,
      type: [Boolean, Object],
    },
    // 表格标题
    title: {
      default: '',
      type: String,
    },
    tree: {
      default: () => ({}),
      type: Object,
    },
  },
  setup(props, { emit }) {
    let getTableData = () => {}; // 解决eslint used before it was defined报错

    const state = reactive({

      // 过滤方法
      filterHandler(value, row, column) {
        const { property } = column;
        return row[property] === value;
      },

      // 当前页变化
      handleCurrentChange() {
        getTableData();
      },

      // 日期范围
      handleDateChange(date, item, format) {
        state.searchModel[item.name] = date ? formatDate(date, format) : '';
      },

      handleRangeChange(date, item, format) {
        const arr = !!date && date.map((d) => formatDate(d, format));
        state.searchModel[item.name] = arr || [];

        if (!item.trueNames) {
          return;
        }

        if (arr) {
          arr.forEach((val, index) => {
            state.searchModel[item.trueNames[index]] = val;
          });
        } else {
          item.trueNames.forEach((key) => {
            delete state.searchModel[key];
          });
        }
      },

      // 重置函数
      handleReset() {
        if (props.blockRedundantRequestOnReset && JSON.stringify(state.searchModel) === '{}') {
          return;
        }
        state.pageNum = 1;
        state.searchModel = getSearchModel(props.search);
        getTableData();
      },

      // 搜索
      handleSearch() {
        state.pageNum = 1;
        getTableData();
      },

      // 全选
      handleSelectionChange(arr) {
        emit('selectionChange', arr);
      },

      // 改变每页size数量
      handleSizeChange() {
        state.pageNum = 1;
        getTableData();
      },

      loading: false,

      pageNum: 1,

      pageSize: (!!props.pagination && props.pagination.pageSize) || 10,

      paginationConfig: {
        show: false,
      },

      // 刷新
      refresh() {
        getTableData();
      },

      searchModel: getSearchModel(props.search),

      tableData: [],

      total: 0,
    });

    // 优化搜索字段，
    // 1、如果搜索配置有transform处理函数，执行transform
    // 2、删除日期范围默认的name字段
    const optimizeFields = (search) => {
      const searchModel = JSON.parse(JSON.stringify(state.searchModel));
      if (search && search.fields) {
        search.fields.forEach((item) => {
          if (!Object.prototype.hasOwnProperty.call(searchModel, item.name)) {
            return;
          }
          if (item.transform) {
            searchModel[item.name] = item.transform(searchModel[item.name]);
          }
          if (
            (item.type === 'daterange' || item.type === 'datetimerange')
            && !!item.trueNames
          ) {
            delete searchModel[item.name];
          }
        });
      }
      return searchModel;
    };

    // 请求列表数据
    getTableData = async () => {
      state.loading = true;
      const searchModel = optimizeFields(props.search);
      const { data, total } = await props.request({
        pageNum: state.pageNum,
        pageSize: state.pageSize,
        ...searchModel,
      });
      state.loading = false;
      state.tableData = data;
      state.total = total;
    };

    onBeforeMount(() => {
      if (props.loadTableDataBeforeMount) {
        getTableData();
      }
    });

    const getPaddingValue = (p) => (typeof p === 'number' ? `${p}px` : p);
    const searchAreaStyle = computed(() => ({
      paddingLeft: getPaddingValue(props.paddingLeft),
      paddingRight: getPaddingValue(props.paddingRight),
    }));
    const headAreaStyle = computed(() => ({
      paddingLeft: getPaddingValue(props.paddingLeft),
      paddingRight: getPaddingValue(props.paddingRight),
    }));
    const tableAreaStyle = computed(() => ({
      paddingLeft: getPaddingValue(props.paddingLeft),
      paddingRight: getPaddingValue(props.paddingRight),
    }));
    const paginationAreaStyle = computed(() => {
      const paddingObject = {
        paddingLeft: getPaddingValue(props.paddingLeft),
        paddingRight: getPaddingValue(props.paddingRight),
      };
      if (props.pagination.style) {
        return {
          ...paddingObject,
          ...props.pagination.style,
        };
      }
      return paddingObject;
    });

    if (typeof props.pagination === 'object') {
      state.paginationConfig = {
        layout: props.pagination.layout || 'total, sizes, prev, pager, next, jumper',
        pageSizes: props.pagination.pageSizes || [10, 20, 30, 40, 50, 100],
        show: true,
        style: paginationAreaStyle.value,
      };
    }

    return {
      ...toRefs(state),
      headAreaStyle,
      paginationAreaStyle,
      searchAreaStyle,
      tableAreaStyle,
    };
  },
});
</script>

<style lang="less" scoped>
.page-box {
  width: 100%;
  box-sizing: border-box;
  .search {
    padding: 20px 20px 0;
    background: #fff;
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      margin-bottom: 20px;
    }
    .search-btn {
      margin-left: auto;

      .btn-icon {
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
    }
    ::v-deep(.el-input-number .el-input__inner) {
      text-align: left;
    }
  }
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 0;
    background: #fff;
    .title {
      font-size: 16px;
    }
  }
  .table {
    padding: 20px;
    background: #fff;
    ::v-deep(th) {
      background: #f6f6f6;
      color: rgba(0, 0, 0, 0.85);
    }
  }
  .pagination {
    padding: 0 20px 20px;
    background: #fff;
    text-align: right;
    :last-child {
      margin-right: 0;
    }
  }
}
</style>
