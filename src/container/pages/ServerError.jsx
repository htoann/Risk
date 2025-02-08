import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';

function ServerError() {
  const { t } = useTranslation();

  return (
    <Result
      status="warning"
      title={t('Common_ServerError_Desc')}
      extra={
        <Button type="primary" key="reload" onClick={() => window.location.reload()}>
          {t('Common_RefreshPage')}
        </Button>
      }
    />
  );
}

export default ServerError;
