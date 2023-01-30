import Controller from '@ember/controller';
import RSVP from 'rsvp';
import { later } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

const NUMBERS = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
];

const USERS = [
  { name: 'Arthur' },
  { name: 'Sam' },
  { name: 'Dan' },
  { name: 'Miguel' },
  { name: 'Svilen' },
  { name: 'Ruslan' },
  { name: 'Kirill' },
  { name: 'Stuart' },
  { name: 'Jamie' },
  { name: 'Matteo' },
];
const EXTRA = { labelPath: 'name' };

export default class ApplicationController extends Controller {
  @tracked
  user;

  @tracked
  user2;

  @tracked
  user3;

  get numbers() {
    return NUMBERS;
  }

  get users() {
    return USERS;
  }

  get extra() {
    return EXTRA;
  }

  @action
  skipShortSearches(term, select) {
    if (term.length <= 2) {
      select.actions.search('');
      return false;
    }
  }

  @action
  search(term) {
    return NUMBERS.filter((num) => num.indexOf(term) > -1);
  }

  @action
  searchAsync(term) {
    return new RSVP.Promise(function (resolve) {
      if (term.length === 0) {
        resolve([]);
      } else {
        later(function () {
          resolve(NUMBERS.filter((num) => num.indexOf(term) > -1));
        }, 600);
      }
    });
  }

  @action
  searchUsersAsync(term) {
    console.log('search', term);
    // return users.filter(u => u.name.indexOf(term) > -1);
    return new RSVP.Promise(function (resolve) {
      if (term.length === 0) {
        resolve([]);
      } else {
        later(function () {
          resolve(USERS.filter((u) => u.name.indexOf(term) > -1));
        }, 600);
      }
    });
  }
}
