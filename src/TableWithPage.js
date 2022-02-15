
import TTable from './TTable';
import TPage from './TPage';

const elTableMethods = ['clearSelection', 'toggleRowSelection', 'toggleAllSelection', 'toggleRowExpansion', 'setCurrentRow', 'clearSort', 'clearFilter', 'doLayout', 'sort'];

export default {
  name: 'TableWithPage',
  components: { TTable, TPage },
  props: {
    data: {
      type: Array,
      required: true
    },

    // 用于给表格添加 loading
    loading: {
      type: Boolean,
      default: false
    },

    // 是否在 current-page 改变时重置表格体的 scrollTop
    resetToTop: {
      type: Boolean,
      default: false
    },

    pageProps: {
      type: Object,
      default: () => ({})
    },
    hasDelete: {
      type: Boolean,
      default: false
    },
    resetIndex: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 是否只有一条数据
    isOnlyHasOneRow() {
      return this.data.length <= 1;
    }
  },
  watch: {
    hasDelete(newVal) {
      if (!newVal) {
        return;
      }

      // 当前页数据只有一条的时候，需要重新计算页码
      const newPageIndex = this.isOnlyHasOneRow
        ? this.computeDeletedPageIndex()
        : this.$refs.page.innerPageIndex;
      this.$refs.page.handleCurrentPageChange(newPageIndex);

      this.$emit('update:has-delete', false);
    }
  },
  mounted() {
    elTableMethods.forEach(methodName => (this[methodName] = this.$refs.table[methodName]));
  },
  methods: {
    /* page 相关 */
    computeDeletedPageIndex() {
      // 如果当前页不是第一页，则需要将页码 - 1
      const { innerPageIndex } = this.$refs.page;
      return innerPageIndex === 1 ? innerPageIndex : innerPageIndex - 1;
    },

    updateResetIndex() {
      this.$emit('update:reset-index', false);
    },

    handleCurrentChange(currentPage) {
      if (this.resetToTop) {
        this.$refs.table.$el.querySelector('.el-table__body-wrapper').scrollTop = 0;
      }

      // 因为表格也有 current-change 事件，所以更改一下 pagination 的 current-change 事件的名字作为区分
      this.$emit('page-current-change', currentPage);
    },

    resolveTableChild(h) {
      return h(
        'TTable',
        {
          ref: 'table',
          props: { data: this.data },
          attrs: { ...this.$attrs },
          on: { ...this.$listeners },
          scopedSlots: { ...this.$scopedSlots },
          directives: [
            {
              name: 'loading',
              expression: 'loading',
              value: this.loading
            }
          ]
        }
      );
    },

    resolvePageChild(h) {
      const pageDefaultSlot = this.$scopedSlots.pagination;
      const children = pageDefaultSlot ? pageDefaultSlot() : [];

      const listeners = {
        'current-change': this.handleCurrentChange
      };
      this.$listeners['size-change'] && (listeners['size-change'] = this.$listeners['size-change']);
      this.$listeners['page-change'] && (listeners['page-change'] = this.$listeners['page-change']);
      this.$listeners['prev-click'] && (listeners['prev-click'] = this.$listeners['prev-click']);
      this.$listeners['next-click'] && (listeners['next-click'] = this.$listeners['next-click']);

      return h(
        'TPage',
        {
          ref: 'page',
          props: {
            ...this.pageProps,
            resetIndex: this.resetIndex
          },
          attrs: { ...this.pageProps },
          on: {
            'update:reset-index': this.updateResetIndex,
            ...listeners
          }
        },
        children
      );
    },

    resolveChildren(h) {
      return [this.resolveTableChild(h), this.resolvePageChild(h)];
    }
  },
  render(h) {
    return h(
      'section',
      null,
      this.resolveChildren(h)
    );
  }
};
