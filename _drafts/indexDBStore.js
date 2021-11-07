
export const IndexDBStore = (dbName = 'keyval-store', storeName = 'keyval') => {

  const dbp = new Promise((resolve, reject) => {
    const openreq = indexedDB.open(dbName, 1);
    openreq.onerror = () => reject(openreq.error);
    openreq.onsuccess = () => resolve(openreq.result);
    openreq.onupgradeneeded = () => {
      openreq.result.createObjectStore(storeName);
    };
  });
  const idbStore = (type, callback) =>
    dbp.then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, type);
      transaction.oncomplete = () => resolve();
      transaction.onabort = transaction.onerror = () => reject(transaction.error);
      callback(transaction.objectStore(storeName));
    }));

  return {
    getItem: (key, _) => idbStore('readonly', store => ((_ = store.get(key))).then(() => _.result)),
    setItem: (key, value) => idbStore('readwrite', store => (store.put(value, key))),
    removeItem: (key) => idbStore('readwrite', store => (store.delete(key))),
    clear: () => idbStore('readwrite', store => (store.clear())),
    keys: (_ = []) => idbStore('readonly', store => {
      // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
      // And openKeyCursor isn't supported by Safari.
      (store.openKeyCursor || store.openCursor).call(store).onsuccess = function() {
        if (!this.result) return;
        _.push(this.result.key);
        this.result.continue();
      };
    }).then(() => _)
  };

};