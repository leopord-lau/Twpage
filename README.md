# Twpage

二次封装 ElementUI 组件, 以下组件支持 Vue@2.6+ 版本

## TTable

该组件对 ElementUI Table 组件进行了二次封装，使用声明配置的方式定义表格的列，减少模板的书写

### props

| prop    | 类型            | 是否必传  | 描述                       |
| ------- | ------------- | ----- | ------------------------ |
| data    | Array | **是** | ElTable 的 data           |
| columns | Array | 否     | 配置表格列，类似与写 ElTableColumn |

**未被声明的 attrs 会作为 props 传给 ElTable 组件，所以理论上是支持任何 ElTable 的 props，ElTable 的 props 参考 ElementUI 文档**

### columns

TTable 组件 props，使用改属性配置表格的列,

| key            | 类型     | 是否必须 | 描述                          |
| -------------- | ------ | ---- | --------------------------- |
| slotName       | String | 否    | 声明某一列使用 slot 的方式声明          |
| headerSlotName | String | 否    | 声明某一列的 header 使用 slot 的方式声明 |

**除了上述两个 key，其余的 key 会作为 props 传递给 ElTableColumn 组件，所以理论上支持所有 ElTableColumn 支持的 props，参见 ElementUI 文档**

### slots

#### 默认插槽

除了在 `columns` 中定义某一列之外，也可以在 `ElTable` 的默认插槽中定义 `ElTableColumn`，所有的默认插槽中的内容会被插入到 `ElTable` 的 children 的**尾部**，及声明的默认插槽内容在最后几列

#### append

支持 `ElTable` 的 `append` 插槽

### Events

支持所有 `ElTable` 组件的事件，`$listeners` 透传给 `ElTable`

### Methods

透出了所有 `ElTable` 的方法

### 示例

#### 普通展示

```jsx
<template>
  <d-table
    v-loading="tableLoading"
    :data="tableData"
    :columns="tableColumns"
    height="300px"
  />
</template>
<script>
  export default {
    data() {
      return {
      	tableData: [],
        tableColumns: [
          { type: 'index', label: '序号' },
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' }
        ],
        tableLoading: false
      }
    }
  }
</script>
```

#### 带插槽

```jsx
<template>
  <d-table
    v-loading="tableLoading"
    :data="tableData"
    :columns="tableColumns"
    height="300px"
  >
    <!--
	  下面两个插槽相当于以下写法
	  <el-table-column label="操作">
		<template v-slot:header="{ column, $index }">
          <span>操作不了</span>
        </template>
		
		<template v-slot="{ row }">
          <el-button @click="handleDelete(row)">删除</el-button>
        </template>
	  </el-table-column>
	-->
    <template v-slot:operateHeader="{ column, $index }">
      <span>操作不了</span>
    </template>
    
  	<template v-slot:operate="{ row }">
   	  <el-button @click="handleDelete(row)">删除</el-button>
    </template>
  </d-table>
</template>
<script>
  export default {
    data() {
      return {
        tableData: [],
        tableColumns: [
          { type: 'index', label: '序号' },
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' },
          // 定义默认作用于插槽和 header 插槽
          { slotName: 'operate', headerSlotName: 'operateHeader', label: '操作' }
        ]
      }
    }
  }
</script>
```

#### 原生 ElTable props

```jsx
<template>
  <d-table
    height="300px"
    :data="tableData"
    :columns="tableColumns"
    border
  >
    <template v-slot:expand="{ row }">
      <span>可以展开的列</span>
    </template>
  </d-table>
</template>
<script>
  export default {
    data() {
      return {
        tableData: [],
        tableColumns: [
          { type: 'selection' },
          { type: 'expand', slotName: 'expand' },
          { type: 'index', label: '序号' }
        ]
      }
    }
  }
</script>
```



## TPage

该组件是对 `ElPagination` 的二次封装，该组件和 `ElPagination` 一样可以是 **[受控和非受控的](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/)**

### props

| prop       | 类型                            | 是否必传                  | 描述                                 |
| ---------- | ----------------------------- | --------------------- | ---------------------------------- |
| align      | 'left' \| 'center' \| 'right' | 否，默认 'left'           | 分页内容如和展示， text-align               |
| resetIndex | Boolean                       | 否，默认 false            | 是否重置页码为1，需要使用 .sync 修饰符            |
| sizeKey    | String                        | 否，默认 'pageSize'       | page-change 事件触发时，size 相关项的 key 值  |
| currentKey | String                        | 否，默认 'currentPage'    | page-change 事件触发时，index 相关项的 key 值 |
| pageSizes  | Array                 | 否，默认 [10, 20, 30, 40] | ElPagination 的 pageSizes prop      |

> resetIndex：标识组件是否需要重置页码为 1，一般用于搜索的时候，组件会尝试重置该 prop，所以需要使用 .sync 修饰符修饰该 prop，重置页码后触发 current-change、page-change 事件

**除了上述 props，该组件直接把所有 atts 传递给 ElPagination，所以理论上支持所有 ElPagination 组件的 props，参考 ElementUI 文档**

### slots

支持 `ElPagination` 的默认插槽，使用方法与 `ElPagination` 插槽一致

### events

| 事件名            | 参数                                       | 描述                                       |
| -------------- | ---------------------------------------- | ---------------------------------------- |
| page-change    | { [sizeKey]: pageSIze, [currentKey]: currentPage } | 合并了 size-change、current-change 事件，详细描述见下方 |
| size-change    | 每页条数                                     | pageSize 改变时触发                           |
| current-change | 当前页                                      | currentPage 改变时触发                        |
| prev-click     | 当前页                                      | 点击上一页改变页码时触发                             |
| next-click     | 当前页                                      | 点击下一页改变页码时触发                             |

> page-change：合并了 size-change、current-change 的参数，做了防抖处理，在同时触发 size-change、current-change 的情况下该事件只会触发一次，建议使用该事件来获取分页信息，**该事件会在组件创建时触发一次**

### 示例

#### 受控

```jsx
<template>
  <d-page 
  	:current-page="pageIndex"
    :page-size="pageSize"
    align="center"
    current-key="pageIndex"
    @page-change="handlePageChange"
  />
</template>
<script>
  export default {
    data() {
      return {
        pageIndex: 1,
        pageSize: 20
      }
    },
    methods: {
      handlePageChange(pageInfo) {
        // 这里是 currentKey 的值
        this.pageIndex = pageInfo.pageIndex;
        this.pageSize = pageInfo.pageSize;
      }
    }
  }
</script>
```

#### 非受控

```jsx
<template>
  <d-page 
    align="center"
    current-key="pageIndex"
    :reset-index.sync="shouldResetIndex"
    @page-change="handlePageChange"
  />
  
  <el-button @click="resetIndex">重置页码</el-button>
</template>
<script>
  export default {
    data() {
      return {
        pageInfo: null,
        shouldResetIndex: false
      }
    },
    methods: {
      handlePageChange(pageInfo) {
        this.pageInfo = pageInfo;
      },
      resetIndex() {
        this.shouldResetIndex = true;
      }
    }
  }
</script>
```



## TableWithPage

**该组件是 `TTable`、`TPage` 的组合体**，具体文档参考上面各自组件，下面只列举与上面两个组件文档不同的地方

**由于组件只能有一个根节点，所以两个组件被一个 section 包裹，需要改变样式请自行给组件添加 class、style(会被设置到组件的根元素)**

### props

| prop       | 类型            | 是否必传       | 描述                                       |
| ---------- | ------------- | ---------- | ---------------------------------------- |
| data       | Array | **是**      | TTable 的 data                            |
| loading    | Boolean       | 否，默认 false | 展示表格组件的 loading                          |
| resetToTop | Boolean       | 否，默认 false | 是否在 currentPage 改变时重置表格内容的滚动条到顶部         |
| pageProps  | Object        | 否，默认 {}    | 除了 resetIndex 所有 TPage 的 props 通过该 prop 传入 |
| hasDelete  | Boolean       | 否，默认 false | 标识表格是否有删除一行，详细见下方                        |
| resetIndex | Boolean       | 否，默认 false | TPage 的 resetIndex prop                  |

> hasDelete：标识是否删除了表格的一行数据，置为 true 时，会根据当前表格的数据计算出新的分页信息，然后通过 current-change、page-change 事件通知父组件\

**所有 $attrs 会被传递给 TTable 组件，即所有非 props 属性都会被传递给 TTable 组件**

### slots

#### 表格插槽

默认插槽、在 `columns` 中声明的插槽、`append` 插槽都会传递给 `TTable` 组件

### 分页插槽

具名插槽 **`pagination`**，会传递给 `TPage` 组件

### events

`$listeners` 会被整个传给 `TTable` 组件

`size-change`、`page-change`，`prev-click`，`next-click` 会被传给 `TPage`

**由于 `ElTable` 也有 `current-change` 事件，所以 `TPage` 的 `current-change` 事件改为监听 `page-current-change`**

### methods

支持所有 `ElTable` 的方法

### 示例

#### 简单示例(带请求)

```jsx
<template>
  <el-button type="primary" @click="handleSearch">搜索</el-button>
  <!--
 	第一个 style 是设置组件根元素的样式
	第二个 height 属性是 指定 Table 组件的 height prop
  -->
  <table-with-page
    style="height: 100%;"
    height="94%"
  	:data="tableData"
    :columns="tableColumns"
    :loading="tableLoading"
    :page-props="pageProps"
    @page-change="handlePageInfoChange"
  >
    <template v-slot:operate="{ row }">
      <el-button type="text" @click="handleDelete(row)">删除</el-button>
    </template>
  </table-with-page>
</template>
<script>
  export default {
    data() {
      return {
        tableData: [],
        tableColumns: [
          { type: 'index', label: '序号' },
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' },
          { slotName: 'operate', label: '操作' }
        ],
        tableLoading: false,
        total: 0,
        hasDelete: false,
        shouldResetIndex: false
      }
    },
    computed: {
      pageProps() {
        const { total } = this;
        return {
          total,
          align: 'center'
        };
      }
    },
    watch: {
      // 分页信息改变时，自动搜索
      pageInfo(newVal) {
        if (!newVal) {
          return;
        }
        
        this.handleSearch();
      }
    },
    methods: {
      async handleDelete(row) {
        try {
          await SomeService.delete(row.id);
          // 会触发一次 page-change 事件，继而自动获取数据
          this.hasDelete = true;
        } catch (e) {
          console.error(e);
        }
      }
      handleSearch(e) {
        if (e) {
          // 会触发一次 page-change 事件，继而自动获取数据，所以这里直接返回就可以
          this.shouldResetIndex = true;
          return;
        }
        
        const params = this.getParams();
        this.search(params);
      },
      getParams() {
        return { ...this.pageInfo };
      },
      async search(params) {
        this.tableLoading = true;
        
        try {
          const { total, records } = await SomeService.search(params);
          this.total = total;
          this.tableData = records;
        } catch(e) {
          console.error(e);
        }
        
        this.tableLoading = false;
      },
      handlePageInfoChange(pageInfo) {
        this.pageInfo = pageInfo;
      }
    }
  }
</script>
```

## ResetScrollTop

该组件用于在需要的时候重置目标元素的 scrollTop，多用于分页换页时

### props

| prop        | 类型                 | 是否必传       | 描述                                       |
| ----------- | ------------------ | ---------- | ---------------------------------------- |
| shouldReset | Boolean            | 否，默认 false | 用于标识目标元素是否应该被重置 scrollTop，需要使用 **`.sync`** 修饰符 |
| selector    | String \| Function | 是          | 告诉组件如何去查询需要更改的元素，下方详细描述                  |

### slots

默认插槽

### methods

reset：重置目标元素的 scrollTop

### 注意

1. 内部使用 querySelector 来查询元素，注意字符串类型 selector 的格式
2. 调用 querySelector 的元素为包裹组件的元素，即组件 $el.parentElement
3. 函数 selector 必须返回一个 HTMLElement 元素
4. **如果父元素下有多个相同 selector 的元素**(例如多个相同 className 的元素)，建议使用函数类型 selector
5. 函数类型会在每次需要 reset 的时候执行，如需缓存 DOM 元素，请自行缓存

### 示例

#### 使用 prop 控制

```jsx
// template
<reset-scroll-top selector=".list" :should-reset.sync="resetScrollTop">
  <ul class="list" style="overflow: auto; height: 50px;">
    <li>1</li>
    <li>1</li>
    <li>1</li>
    <li>1</li>
    <li>1</li>
    <li>1</li>
    <li>1</li>
  </ul>
</reset-scroll-top>

// script
export default {
  data() {
    return {
      resetScrollTop: false
    };
  },
  methods: {
    // 某个需要重置的时间点调用
    resetScroll() {
      this.resetScrollTop = true;
    }
  }
};
```

#### 使用方法重置

```jsx
// template
<reset-scroll-top ref="resetScrollCom" selector=".list">
  <ul class="list" style="overflow: auto; height: 50px;">
    <li>1</li>
    <li>1</li>
    <li>1</li>
    <li>1</li>
    <li>1</li>
    <li>1</li>
    <li>1</li>
  </ul>
</reset-scroll-top>

// script
export default {
  methods: {
    onCurrentPageChange() {
      // 需要重置时调用
      this.$refs.resetScrollCom.reset();
    }
  }
};
```

#### 函数 selector

```jsx
// template
<reset-scroll-top :selector="getResetScrollSelector" :should-reset.sync="resetScrollTop">
  <ul ref="list" style="overflow: auto; height: 50px;">
    <li>1</li>
    <li>1</li>
    <li>1</li>
    <li>1</li>
    <li>1</li>
    <li>1</li>
    <li>1</li>
  </ul>
</reset-scroll-top>

// script
export default {
  data() {
    return {
      resetScrollTop: false
    };
  },
  methods: {
    // 某个需要重置的时间点调用
    resetScroll() {
      this.resetScrollTop = true;
    },
    // 需要返回一个 element || document
    getResetScrollSelector() {
      return this.$refs.list;
    }
  }
};
```

