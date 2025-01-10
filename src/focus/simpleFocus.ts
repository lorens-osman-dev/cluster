

const hiddenCssClass = "plugin-simple-focus-hidden";

class SimpleFocusClass {
  isFocus: boolean;
  constructor() {
    this.isFocus = false;
  }

  toggleFocus(path: string) {
    if (this.isFocus) {
      this.exitFocus();
    } else {
      this.enterFocus(path);
    }
  }

  enterFocus(path: string) {
    this.isFocus = true;
    const hiddenEls = document.querySelectorAll<HTMLElement>(
      `.tree-item:not(:has([data-path="${path}"]),:has([data-path^="${path}/"]))`
    );
    hiddenEls.forEach((hiddenEl) => {
      hiddenEl.addClass(hiddenCssClass);
    });
  }

  exitFocus() {
    this.isFocus = false;

    const unFocusEls = document.querySelectorAll<HTMLElement>(
      `.${hiddenCssClass}`
    );

    unFocusEls.forEach((unFocusEl) => {
      unFocusEl.removeClass(hiddenCssClass);
    });
  }
}

export default SimpleFocusClass;