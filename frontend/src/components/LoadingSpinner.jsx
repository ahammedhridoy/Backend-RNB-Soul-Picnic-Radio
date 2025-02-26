import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen loading">
      <Box sx={{ display: "flex" }}>
        <CircularProgress className="text-green-600" />
      </Box>
    </div>
  );
};

export default LoadingSpinner;
