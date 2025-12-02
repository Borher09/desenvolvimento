export const helpers = {
  dateFormat: (date: string) => {
    const locale = new Date(date);
    return locale.toLocaleString('pt-BR');
  },

  inc: (value: string) => parseInt(value) + 1,

  json: (context) => JSON.stringify(context, null, 2),

  'selected-option': (id: any, compareId: any, oldId?: any) => {
    if (oldId) return id == oldId ? 'selected' : '';
    return id == compareId ? 'selected' : '';
  },

  isString: (value) => typeof value === 'string',

  year: () => new Date().getFullYear(),

  getError: (errors: any[], key: string) => {
    const errorObj = errors?.find((i) => i.property == key);
    return errorObj ? errorObj.message : null;
  },

  getValue: (old: string, defaultValue: string) => {
    return old || defaultValue;
  },

  // 👉 AQUI está o helper que faltava
  formatNumber: (value: any) => {
    if (value === null || value === undefined || value === '') return '';
    return Number(value).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  },
};
