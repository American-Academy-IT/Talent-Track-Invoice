import fileDownload from 'js-file-download';
import { useState } from 'react';

import useNotification from '../../hooks/use-notification';
import API from '../../server-proxy/config';
import CustomButton from './custom-button';

interface Props {
  serial: string;
  path: string;
  type?: string;
}

const DownloadButton = (props: Props) => {
  const { serial, path, type } = props;
  const { errorNotification } = useNotification();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const res = await API.get(`${path}/download/${serial}`, {
        responseType: 'blob',
        params: { type },
      });

      fileDownload(res.data, `${serial}.pdf`);
    } catch (err) {
      errorNotification(err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <CustomButton
      name={serial}
      size="xs"
      variant="link"
      colorScheme="blue"
      isLoading={isDownloading}
      onClick={handleDownload}
    />
  );
};

export default DownloadButton;
