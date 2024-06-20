import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import "../../assets/css/img-slider.css"
import { useRef } from 'react';
import { useScreenshot } from 'use-react-screenshot';
const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const [ImageShow, setImageShow] = useState(null);
  const ref = useRef(null);
  const [screenshot, takeScreenshot] = useScreenshot();


  const [value, setValue] = useState(1); // Initial value
  // State to hold the number of rows and columns
  const [gridSize, setGridSize] = useState({ rows: 1, cols: 1 });
  // State to hold the current color
  const [deg, setDeg] = useState("240"); // Initial color is black
  const handlePost = async () => {
    takeScreenshot(ref.current);
    setImage(screenshot);
    console.log(image)
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", post);
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", screenshot);
    }

    const response = await fetch(`http://localhost:3001/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const posts = await response.json();
    dispatch(setPosts({ posts }));
    setImage(null);
    setPost("");
  };
    // Handler for the slider change
    const handleSliderChange = (event) => {
      setValue(event.target.value);
      const value = parseInt(event.target.value); // Parse slider value to integer
      const newGridSize = {
        rows: Math.round(value / 5.5),
        cols: Math.round(value / 5.5),
      };
      setGridSize(newGridSize);
     const randomColor = Math.floor(Math.random() * 360) + 1;
     setDeg(randomColor)
    };

    // Create grid items
  const createGridItems = () => {
    let items = [];
    for (let i = 0; i < gridSize.rows * gridSize.cols; i++) {
      items.push(
        <div key={i} className="grid-item">
          <div
            className="image-container"
          >
            <img src={ImageShow} style={{
               filter: `brightness(100%) contrast(100%) saturate(0%) sepia(100%) hue-rotate(${deg.toString()+"deg"})`}} width="100%" height="100%" alt="post" />
          </div>
        </div>
      );
    }
    return items;
  };

  const handleDrop = (acceptedFiles) => {
    setImage(acceptedFiles[0]);
    const droppedImage = acceptedFiles[0];
    
    const imageUrl = URL.createObjectURL(droppedImage);
    setImageShow(imageUrl);
  };
  
  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={handleDrop}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() =>{ setImage(null);setImageShow(null) }}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
          {/* comp */}
          { image &&
          <div className="main-div container" ref={ref}>
      <label htmlFor="slider" className="label">
        {value * 2}
      </label>
      <>
        <input
          type="range"
          className="form-range"
          id="customRange1"
          min="4"
          step="1"
          max="50"
          defaultValue="1" // Use defaultValue instead of value for initial state
          onChange={handleSliderChange}
        />
      </>

      <div
      
        className="grid-container"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize.cols}, auto)`, // Fix template string
          transition: "all 2s linear",
        }}
        
      >
        {createGridItems()}
      </div>
    </div>
    
}
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        {isNonMobileScreens ? (
          <>
            <FlexBetween gap="0.25rem">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Attachment</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}

        <Button
          disabled={!post}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
