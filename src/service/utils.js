import { Modal } from 'antd';
import { getI18n } from '../utils';

export const openModalServerError = () =>
  Modal.error({
    title: getI18n('Common_ServerError_Title'),
    content: getI18n('Common_ServerError_Desc'),
    style: {
      top: '40%',
    },
  });
