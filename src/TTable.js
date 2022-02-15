/**
 * columns: 配置 el-table-column
 *    例：[{ type: 'index', prop: 'name', label: '姓名' }]
 *    每一项都会作为 prop 传递给 el-table-column
 *    如果想某一列使用 slot，配置如下：[{ slotName: 'operate' }]，和直接在 el-table-column 中使用 scopeSlot 是一样的
 * 
 * 其它不是 props 的 attrs 会通过 $attrs 传递给 el-table
 * 
 * el-table 的方法都已经透传出去，可以使用 $refs 来调用
 * 所有的事件监听也会通过 $listeners 传递给 el-table
 * 
 * 使用示例：
 *    const columns = [
 *      { type: 'index', label: '序号', width： ’50px' },
 *      { prop: 'name', label: '姓名' },
 *      { prop: 'age', label: '年龄' },
 *      { slotName: 'operate', fixed: 'right' }
 *    ];
 *    
 *    <t-table :data="tableData" :columns="columns" height="500px">
 *      <template v-slot:operate="{ row }">
 *        <el-button @click="xxx">修改</el-button>
 *      </template>
 *    </t-table>
 */

 const elTableMethods = ['clearSelection', 'toggleRowSelection', 'toggleAllSelection', 'toggleRowExpansion', 'setCurrentRow', 'clearSort', 'clearFilter', 'doLayout', 'sort'];

 export default {
   name: 'TTable',
   props: {
     // 表格的数据
     data: {
       type: Array,
       required: true
     },
 
     // 配置的列
     columns: {
       type: Array,
       default: () => []
     }
   },
   render(h) {
     const children = [];
     this.columns.forEach(props => {
       const data = { props };
       const { slotName, headerSlotName } = props;
 
       if (slotName) {
         data.scopedSlots = { 
           default: this.$scopedSlots[slotName],
           header: this.$scopedSlots[headerSlotName]
         };
       }
 
       children.push(h('ElTableColumn', data));
     });
 
     // table append slot
     if (this.$scopedSlots.append) {
       const appendVnodes = this.$scopedSlots.append();
       appendVnodes.forEach(vnode => {
   
         // 命名插槽会被归类的条件：context 为当前组件，data.slot != null
         // data 即为 h 函数第二个参数
         vnode.context = this._self;
         vnode.data = { slot: 'append' };
       });
       children.push(...appendVnodes);
     }
     
     children.push(this.$scopedSlots.default ? this.$scopedSlots.default() : []);
 
     return h(
       'ElTable', 
       { 
         props: { ...this.$attrs, data: this.data },
         on: { ...this.$listeners },
         ref: 'table'
       }, 
       children
     );
   },
   mounted() {
     elTableMethods.map(methodName => (this[methodName] = this.$refs.table[methodName]));
   }
 };