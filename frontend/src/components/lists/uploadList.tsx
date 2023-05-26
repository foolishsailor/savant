import { Grid, Typography, LinearProgress } from '@mui/material';

import FileIcon from '../fileIcon';

interface UploadListProps {
  files: File[];
  uploadProgress: number[];
}

const UploadList = ({ files, uploadProgress }: UploadListProps) => {
  console.log('uploadProgress', uploadProgress);
  return (
    <Grid
      sx={{
        mt: 1,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap'
      }}
    >
      {files.map((file, index) => (
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
          <LinearProgress variant="determinate" value={uploadProgress[index]} />
        </Grid>
      ))}
    </Grid>
  );
};

export default UploadList;
