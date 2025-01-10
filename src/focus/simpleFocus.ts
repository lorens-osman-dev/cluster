

const hideenClass = "plugin-simple-focus-hidden";

class SimpleFocusClass  {
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
      hiddenEl.addClass(hideenClass);
    });
  }

  exitFocus() {
    this.isFocus = false;

    const unFocusEls = document.querySelectorAll<HTMLElement>(
      `.${hideenClass}`
    );

    unFocusEls.forEach((unFocusEl) => {
      unFocusEl.removeClass(hideenClass);
    });
  }
}

export default SimpleFocusClass;