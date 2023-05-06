import { Grid, Typography } from '@mui/material';

import FileIcon from '../fileIcon';

interface UploadListProps {
  files: File[];
}

const UploadList = ({ files }: UploadListProps) => {
  return (
    <Grid
      sx={{
        mt: 1,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap'
      }}
    >
      {files.map((file) => (
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            mb: 1
          }}
          key={file.name}
        >
          <Grid
            sx={{
              mr: 1,
              width: 30
            }}
          >
            <FileIcon fileName={file.name} />
          </Grid>
          <Typography variant="body1">{file.name}</Typography>
        </Grid>
      ))}
    </Grid>
  );
};

export default UploadList;
