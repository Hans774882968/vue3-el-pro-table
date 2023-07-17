// GlobalComponents for Volar
export declare interface Vue3ProTableProps {
  request: (...args: any[]) => Promise<{ data: object[], total: number }>
  // 表格标题
  title?: string
  // 是否隐藏标题栏
  hideTitleBar?: boolean
  // 搜索表单配置，false表示不显示搜索表单
  search?: boolean | object
  border?: boolean
  // 表头配置
  columns?: object[]
  // 行数据的Key，同elementUI的table组件的row-key
  rowKey?: string
  // 分页配置，false表示不显示分页
  pagination?: boolean | object
  tree?: object
  // The above attributes are all from https://github.com/huzhushan/vue3-pro-table. The following properties are added by me.
  loadTableDataBeforeMount?: boolean
  blockRedundantRequestOnReset?: boolean
  paddingLeft?: string | number
  paddingRight?: string | number
}

declare const CVue3ProTable: import('vue').DefineComponent<Vue3ProTableProps, unknown, unknown, Record<string, never>, Record<string, never>, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, Record<string, never>, string, import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, Readonly<import('vue').ExtractPropTypes<Vue3ProTableProps>>, object, object>;
declare const CHelloWorld: import('vue').DefineComponent<{
  msg: StringConstructor;
}, unknown, unknown, Record<string, never>, Record<string, never>, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, Record<string, never>, string, import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, Readonly<import('vue').ExtractPropTypes<{
  msg: StringConstructor;
}>>, object, object>;

declare module 'vue' {
  export interface GlobalComponents {
    Vue3ProTable: typeof CVue3ProTable
    TestHelloWorld: typeof CHelloWorld
  }
}

export declare const install: (app: import('vue').App<any>) => void;
declare const plugin: { install };
export default plugin;
