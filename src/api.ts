class Api {
  path: string;

  constructor() {
    this.path = 'http://showroom.eis24.me/api/v4/test';
  }
  getCounters(offset: number, limit: number) {
    return fetch(`${this.path}/meters/?offset=${offset}&limit=${limit}`);
  }

  getAddresses(id: string) {
    return fetch(`${this.path}/areas/?id__in=${id}`);
  }
  deleteCounter(id: string) {
    return fetch(`${this.path}/meters/${id}/`, {
      method: 'DELETE',
    });
  }
}

const api = new Api();

export default api;
