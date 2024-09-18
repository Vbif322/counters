import { destroy, flow, Instance, types } from 'mobx-state-tree';
import { counter } from '../@types/types';
import api from '../api';

const Counter = types.model({
  id: types.identifier,
  _type: types.array(
    types.union(
      types.literal('HotWaterAreaMeter'),
      types.literal('ColdWaterAreaMeter'),
      types.literal('AreaMeter'),
      types.undefined
    )
  ),
  area: types.model({ id: types.identifier }),
  is_automatic: types.union(types.boolean, types.null),
  communication: types.string,
  description: types.string,
  serial_number: types.string,
  installation_date: types.string,
  brand_name: types.union(types.string, types.null),
  model_name: types.union(types.string, types.null),
  initial_values: types.array(types.number),
});

const Address = types.model({
  id: types.identifier,
  number: types.number,
  str_number: types.string,
  str_number_full: types.string,
  house: types.model({
    address: types.string,
    id: types.identifier,
    fias_addrobjs: types.array(types.string),
  }),
});

const CounterStore = types
  .model({
    count: types.number,
    counters: types.array(Counter),
    addresses: types.array(Address),
    offset: types.number,
    limit: types.number,
    state: types.enumeration('State', ['pending', 'fulfilled', 'error', '']),
  })
  .actions((self) => ({
    getCounters: flow(function* getCounters() {
      self.state = 'pending';
      try {
        const response = yield api.getCounters(self.offset, self.limit);
        const data = yield response.json();
        const addressIDs = [
          ...new Set((data.results as counter[]).map((el) => el.area.id)),
        ];
        for (const ID of addressIDs) {
          if (self.addresses.find((address) => address.id === ID)) {
            continue;
          }
          const res = yield api.getAddresses(ID);
          const address = yield res.json();
          self.addresses.push(address.results[0]);
        }
        self.count = data.count;
        self.counters = data.results;
        self.state = 'fulfilled';
      } catch (error) {
        console.error('Failed to fetch projects', error);
        self.state = 'error';
      }
    }),
    changePage(page: number) {
      self.offset = page * 20;
    },
    removeCounter: flow(function* removeCounter(counter) {
      try {
        yield api.deleteCounter(counter.id);
        destroy(counter);
      } catch (error) {
        console.log(error);
      }
    }),
  }))
  .views((self) => ({
    get page() {
      return self.offset / 20;
    },
    get lastPage() {
      return Math.floor(self.count / 20);
    },
  }));

const store = CounterStore.create({
  count: 100,
  offset: 0,
  limit: 25,
  state: '',
});

export type store = Instance<typeof CounterStore>;

export default store;
