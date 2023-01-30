import Component from '@glimmer/component';
import { isBlank } from '@ember/utils';
import { action, get } from '@ember/object';
import { schedule } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

export default class Trigger extends Component {
  @tracked
  text = '';

  constructor(owner, args) {
    super(owner, args);

    this.oldSelect = args.select;
  }

  /**
   * Lifecycle Hook
   * power-select updates the state of the publicAPI (select) for every typeahead
   * so we capture this as `state` via oldSelect && newSelect
   */
  @action
  updatePublicApi(_elem, [select, extra]) {
    let oldSelect = this.oldSelect;
    this.oldSelect = select;
    let newSelect = select;

    /*
     * We need to update the input field with value of the selected option whenever we're closing
     * the select box.
     */
    if (oldSelect.isOpen && !newSelect.isOpen && newSelect.searchText) {
      let input = document.querySelector(
        `#ember-power-select-typeahead-input-${newSelect.uniqueId}`
      );
      let newText = getSelectedAsText(newSelect, extra);
      if (input !== null && input.value !== newText) {
        input.value = newText;
      }
      this.text = newText;
    }

    if (newSelect.lastSearchedText !== oldSelect.lastSearchedText) {
      if (isBlank(newSelect.lastSearchedText)) {
        schedule('actions', null, newSelect.actions.close, null, true);
      } else {
        schedule('actions', null, newSelect.actions.open);
      }
    }

    if (oldSelect.selected !== newSelect.selected) {
      this.text = getSelectedAsText(newSelect, extra);
    }
  }

  /**
   * on mousedown prevent propagation of event
   *
   * @private
   * @method stopPropagation
   * @param {Object} event
   */
  @action
  stopPropagation(e) {
    e.stopPropagation();
  }

  /**
   * called from power-select internals
   *
   * @private
   * @method handleKeydown
   * @param {Object} event
   */
  @action
  handleKeydown(e) {
    // up or down arrow and if not open, no-op and prevent parent handlers from being notified
    if ([38, 40].indexOf(e.keyCode) > -1 && !this.args.select.isOpen) {
      e.stopPropagation();
      return;
    }
    let isLetter = (e.keyCode >= 48 && e.keyCode <= 90) || e.keyCode === 32; // Keys 0-9, a-z or SPACE
    // if isLetter, escape or enter, prevent parent handlers from being notified
    if (isLetter || [13, 27].indexOf(e.keyCode) > -1) {
      // open if loading msg configured
      if (!this.args.select.isOpen && this.args.loadingMessage) {
        schedule('actions', null, this.args.select.actions.open);
      }
      e.stopPropagation();
    }

    // optional, passed from power-select
    if (this.args.onKeydown && this.args.onKeydown(e) === false) {
      return false;
    }
    return;
  }
}

/**
 * obtains selected value based on complex object or primitive value from power-select publicAPI
 */
function getSelectedAsText(select, extra) {
  let labelPath = extra?.labelPath;
  let value;
  if (labelPath != null && select.selected) {
    // complex object
    value = get(select.selected, labelPath);
  } else {
    // primitive value
    value = select.selected;
  }
  if (value === undefined) {
    value = '';
  }
  return value;
}
