function debounce(fn, time = 10) {
  let timer = null;

  return function(...args) {
    const now = Date.now();

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, time);
  }
}

export default {
  name: 'TPage',
  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40]
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    align: {
      type: String,
      default: 'left'
    },
    resetIndex: {
      type: Boolean,
      default: false
    },

    // 用于合成事件触发时 emit 的值的 key
    sizeKey: {
      type: String,
      default: 'pageSize'
    },
    currentKey: {
      type: String,
      default: 'currentPage'
    }
  },
  data() {
    return {
      innerPageIndex: 1,
      innerPageSize: 0
    }
  },
  watch: {
    pageSize: {
      immediate: true,
      handler() {
        this.innerPageSize = this.pageSize;
      }
    },

    currentPage: {
      immediate: true,
      handler() {
        this.innerPageIndex = this.currentPage;
      }
    },

    pageSizes: {
      immediate: true,
      handler(newVal) {
        if (Array.isArray(newVal)) {
          this.innerPageSize = newVal.includes(this.pageSize) ? this.pageSize : this.pageSizes[0];
        }
      }
    },

    resetIndex(newVal) {
      if (!newVal) {
        return;
      }

      this.handleCurrentPageChange(1);
      this.$emit('update:reset-index', false);
    }
  },
  created() {
    this.emitPageChange();
  },
  methods: {
    // 保留原有的 size-change、current-change 事件
    // 新增两个事件的合并事件，该事件通过防抖处理防止了在最后一页切换 pageSize 导致发起两次请求问题
    handlePageSizeChange(pageSize) {
      this.innerPageSize = pageSize;
      this.$emit('size-change', pageSize);
      this.emitPageChange();
    },

    handleCurrentPageChange(currentPage) {
      this.innerPageIndex = currentPage;
      this.$emit('current-change', currentPage);
      this.emitPageChange();
    },

    // 防抖处理，在两个事件同时触发时只触发一次该事件
    emitPageChange: debounce(function () {
      const { sizeKey, currentKey, innerPageIndex, innerPageSize } = this;
      this.$emit('page-change', { [sizeKey]: innerPageSize, [currentKey]: innerPageIndex });
    }),

    resolveListeners() {
      const listeners = {
        'size-change': this.handlePageSizeChange,
        'current-change': this.handleCurrentPageChange
      };
      this.$listeners['prev-click'] && (listeners['prev-click'] = this.$listeners['prev-click']);
      this.$listeners['next-click'] && (listeners['next-click'] = this.$listeners['next-click']);
      return listeners;
    },

    resolveProps() {
      const props = {
        ...this.$attrs,
        pageSizes: this.pageSizes,
        pageSize: this.innerPageSize,
        currentPage: this.innerPageIndex,
        layout: this.layout
      }

      return props;
    },

    resolveChildren() {
      const defaultSlot = this.$scopedSlots.default;
      const children = defaultSlot ? defaultSlot() : [];
      return children;
    }
  },
  render(h) {
    const listeners = this.resolveListeners();
    const props = this.resolveProps()
    const children = this.resolveChildren();

    return h(
      'ElPagination',
      {
        props: { ...props },
        on: { ...listeners },
        style: {
          textAlign: this.align
        }
      },
      children
    );
  }
};
