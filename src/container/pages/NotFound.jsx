import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';

function NotFound() {
  const { t } = useTranslation();

  return (
    <Result
      status="404"
      title="404"
      subTitle={t('Common_PageNotFound')}
      extra={
        <Button type="primary" to="/">
          {t('Common_ReturnHome')}
        </Button>
      }
    />
  );
}

export default NotFound;
