import { counterType } from '../../@types/types';
import './style.css';
import TrashIcon from '../../assets/trash.svg';
import GVSIcon from '../../assets/icon-gvs.svg';
import HVSIcon from '../../assets/icon-hvs.svg';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { values } from 'mobx';
import { useEffect } from 'react';
import { store } from '../../models/counters';
import { getAddress } from '../../utils/helpers';

type Props = {
  store: store;
};

const getIcon = (type: counterType) => {
  switch (type) {
    case 'ColdWaterAreaMeter':
      return HVSIcon;
    case 'HotWaterAreaMeter':
      return GVSIcon;
    default:
      break;
  }
};

const Table = observer(({ store }: Props) => {
  useEffect(() => {
    store.getCounters();
  }, [store.offset, store.counters.length]);

  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th className="item_1">№</th>
            <th className="item_2">Тип</th>
            <th className="item_3">Дата установки</th>
            <th className="item_4">Автоматический</th>
            <th className="item_5">Текущие показания</th>
            <th colSpan={2}>Адрес</th>
            <th>Примечание</th>
            <th className="item_8"></th>
          </tr>
        </thead>
      </table>
      <div className="table-body">
        <table>
          <tbody>
            {values(store.counters)
              .slice(0, 20)
              .map((counter, i) => {
                return (
                  <tr key={counter.id}>
                    <td className="item_1">{i + 1 + store.offset}</td>
                    <td className="item_2">
                      <div className="type-icon__wrapper">
                        <img src={getIcon(counter?.['_type']?.[0])} />
                        {counter?.['_type']?.[0] === 'ColdWaterAreaMeter'
                          ? 'ХВС'
                          : 'ГВС'}
                      </div>
                    </td>
                    <td className="item_3">
                      {dayjs(counter.installation_date).format('DD.MM.YYYY')}
                    </td>
                    <td className="item_4">
                      {counter.is_automatic ? 'Да' : 'Нет'}
                    </td>
                    <td className="item_5">{counter.initial_values}</td>
                    <td colSpan={2}>{getAddress(store, counter.area.id)}</td>
                    <td>{counter.description}</td>
                    <td className="item_8">
                      <div
                        className="icon-wrapper"
                        onClick={() => store.removeCounter(counter)}
                      >
                        <img src={TrashIcon} className="icon" />
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div>
        <table>
          <tfoot>
            <tr>
              <td colSpan={8}>
                <div className="pagination__wrapper">
                  <button
                    className={
                      'tfoot__btn' + (store.page === 0 ? ' active' : '')
                    }
                    onClick={() =>
                      store.changePage(
                        store.page > 0 ? store.page - 1 : store.page
                      )
                    }
                  >
                    {store.page < 1 ? 1 : store.page}
                  </button>
                  <button
                    className={
                      'tfoot__btn' + (store.page >= 1 ? ' active' : '')
                    }
                    onClick={() =>
                      store.changePage(
                        store.page === 0 ? store.page + 1 : store.page
                      )
                    }
                  >
                    {store.page < 1 ? 2 : store.page + 1}
                  </button>
                  <button
                    className={'tfoot__btn'}
                    onClick={() =>
                      store.changePage(
                        store.page === 0 ? store.page + 2 : store.page + 1
                      )
                    }
                    disabled={store.page === store.lastPage}
                  >
                    {store.page === 0 ? 3 : store.page + 2}
                  </button>
                  <button
                    className="tfoot__btn"
                    onClick={() =>
                      store.changePage(
                        Math.floor((store.page + store.lastPage) / 2)
                      )
                    }
                  >
                    ...
                  </button>
                  <button
                    className="tfoot__btn"
                    onClick={() => store.changePage(store.lastPage - 2)}
                  >
                    {store.lastPage - 1}
                  </button>
                  <button
                    className="tfoot__btn"
                    onClick={() => store.changePage(store.lastPage - 1)}
                  >
                    {store.lastPage}
                  </button>
                  <button
                    className="tfoot__btn"
                    onClick={() => store.changePage(store.lastPage)}
                  >
                    {store.lastPage + 1}
                  </button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
});

export default Table;
