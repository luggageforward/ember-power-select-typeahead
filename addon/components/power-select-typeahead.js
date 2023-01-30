import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PowerSelectTypeahead extends Component {
  get beforeOptionsComponent() {
    return this.args.beforeOptionsComponent ?? null;
  }

  get loadingMessage() {
    return this.args.loadingMessage ?? null;
  }

  get noMatchesMessage() {
    return this.args.noMatchesMessage ?? null;
  }

  get tabindex() {
    return this.args.tabindex ?? -1;
  }

  get triggerComponent() {
    return this.args.triggerComponent ?? 'power-select-typeahead/trigger';
  }

  @action
  onKeyDown(select, e) {
    if (this.args.onKeydown && this.args.onKeydown(select, e) === false) {
      return false;
    }

    // if escape, then clear out selection
    if (e.keyCode === 27) {
      select.actions.choose(null);
    }

    return;
  }
}
