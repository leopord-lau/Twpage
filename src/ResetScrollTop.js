const ResetScrollTop = {
  name: 'ResetScrollTop',
  props: {
    // 是否重置，支持 .sync 修饰符
    shouldReset: {
      type: Boolean,
      default: false
    },

    // 要重置元素的选择器，内部使用 querySelector
    selector: {
      type: [String, Function],
      required: true
    }
  },
  computed: {
    isFunctionSelector() {
      return typeof this.selector === 'function';
    }
  },
  watch: {
    shouldReset(newVal) {
      if (newVal) {
        this.reset();
        this.$emit('update:shouldReset', false);
      }
    },
    selector() {
      this.targetEl = null;
    }
  },
  mounted() {
    this._getTarget();
  },
  activated() {
    if (!this.isFunctionSelector && !this.targetEl) {
      this._getTarget();
    }
  },
  deactivated() {
    this.targetEl = null;
  },
  beforeDestroy() {
    this.targetEl = null;
  },
  methods: {
    reset() {
      const targetEl = this._getTarget();
      targetEl && (targetEl.scrollTop = 0);
    },

    // 获取要重置的 DOM 对象
    _getTarget() {
      if (this.isFunctionSelector) {
        const el = this.selector();
        return (el instanceof HTMLElement || el === document) ? el : null;
      }

      if (this.targetEl) {
        return this.targetEl;
      }

      try {
        // 使用父元素查询对应的元素，防止页面有多个相同元素然后重置错误
        const parentEl = this.$el.parentElement || document;
        const el = parentEl.querySelector(this.selector);

        // 缓存 DOM 实例，防止频繁访问 DOM
        this.targetEl = el;
        return el;
      } catch (e) {
        // catch querySelector error
      }

      return null;
    }
  },
  render() {
    return this.$slots.default;
  }
};

export default ResetScrollTop;
