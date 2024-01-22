import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Box, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, HStack, IconButton, useDisclosure, VStack, Img } from "@chakra-ui/react";
import { AddIcon, MinusIcon, CheckIcon } from "@chakra-ui/icons";
import { useDropzone } from "react-dropzone";

interface ImageAdderProps {
  onImageAdded: (croppedImage: string) => void;
}

const ImageAdder: React.FC<ImageAdderProps> = ({ onImageAdded }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFileChange = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setImageSrc(URL.createObjectURL(file));
        onOpen();
      }
    },
    [onOpen]
  );

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async () => {
    try {
      const image = new Image();
      image.src = imageSrc!;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      await new Promise((resolve) => {
        image.onload = resolve;
      });

      ctx.drawImage(image, croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height, 0, 0, croppedAreaPixels.width, croppedAreaPixels.height);

      return new Promise<string>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(URL.createObjectURL(blob));
        }, "image/jpeg");
      });
    } catch (error) {
      console.error("Error in getCroppedImg:", error);
      throw error;
    }
  };

  const handleDone = async () => {
    if (croppedAreaPixels) {
      const croppedImage = await getCroppedImg();
      onImageAdded(croppedImage);
      setImageSrc(croppedImage);
      onClose();
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setImageSrc(URL.createObjectURL(file));
        onOpen();
      }
    },
    [onOpen]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxFiles: 1,
  });

  const zoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 3));
  };

  const zoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 1));
  };

  return (
    <>
      <Box {...getRootProps()} border="2px dotted gray" borderRadius="2em" textAlign="center" width="15rem" height="15rem" padding="1em" marginBottom="1em">
        <input {...getInputProps()} style={{ display: "none" }} />
        {!imageSrc ? (
          <VStack justifyContent="center" alignItems="center" height="100%" spacing={4}>
            <Text fontSize="1em" textAlign="center">
              Drag & drop a cover image here, or click to select one
            </Text>
            <Text fontSize="3em" role="img" aria-label="upload emoji">
              🏔️
            </Text>
          </VStack>
        ) : (
          <Img src={imageSrc} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW="70vw" maxH="70vh">
          <ModalHeader>Crop your image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {imageSrc && (
              <Box width="100%" height="500px" position="relative">
                <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} cropShape="rect" showGrid={false} />
                <HStack justify="center" spacing={4} mt={2}>
                  <IconButton aria-label="Zoom out" icon={<MinusIcon />} onClick={zoomOut} />
                  <IconButton aria-label="Zoom in" icon={<AddIcon />} onClick={zoomIn} />
                </HStack>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button bg="black.100" _hover={{ bg: "brand.100" }} rightIcon={<CheckIcon />} onClick={handleDone}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImageAdder;
