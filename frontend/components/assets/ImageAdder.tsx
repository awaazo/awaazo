import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Box, Flex, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, HStack, IconButton, useDisclosure, VStack, Img } from '@chakra-ui/react'
import { AddIcon, MinusIcon, CheckIcon } from '@chakra-ui/icons'
import { useDropzone } from 'react-dropzone'
import ImgAddedPic from "../../public/svgs/ImgAdded.svg"

interface ImageAdderProps {
  onImageAdded: (croppedImage: string) => void
}

const ImageAdder: React.FC<ImageAdderProps> = ({ onImageAdded }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()


  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const getCroppedImg = async () => {
    try {
      const image = new Image()
      image.src = imageSrc!
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height

      await new Promise((resolve) => {
        image.onload = resolve
      })

      ctx.drawImage(image, croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height, 0, 0, croppedAreaPixels.width, croppedAreaPixels.height)

      return new Promise<string>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(URL.createObjectURL(blob))
        }, 'image/jpeg')
      })
    } catch (error) {
      console.error('Error in getCroppedImg:', error)
      throw error
    }
  }

  const handleDone = async () => {
    if (croppedAreaPixels) {
      const croppedImage = await getCroppedImg()
      onImageAdded(croppedImage)
      setImageSrc(croppedImage)
      onClose()
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setImageSrc(URL.createObjectURL(file))
        onOpen()
      }
    },
    [onOpen]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxFiles: 1,
  })

  const zoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 3))
  }

  const zoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 1))
  }

  

  return (
    <>
      <Box {...getRootProps()} bg="az.darkerGrey" borderRadius="17px" textAlign="center" width="200px" height="200px"  overflow="hidden">
        <input {...getInputProps()} style={{ display: 'none' }} />
        {!imageSrc ? (
          <Box position="relative" _hover={{ 
            opacity: 0.5,
            transition: "all 0.3s ease-in-out",

          }}>
            <Img
              src={ImgAddedPic.src}
              alt="Add Image"
            />
            <Text position="absolute" top="20%" left="50%" transform="translate(-50%, -50%)" color="white" fontSize="lg" fontWeight={"bold"}>Add A Pic</Text>
          </Box>
          
        ) : (
          <Img
            src={imageSrc}
            alt="Preview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 'inherit',
              padding: "0.5em",
            }}
          />
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW="600px" maxH={'100vh'}>
          <ModalHeader>Crop your image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {imageSrc && (
              <Box width="500px" height="500px" minHeight={'70vh'} position="relative">
                <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} cropShape="rect" showGrid={false} />
                <HStack justify="center" spacing={4} mt={2}>
                  <IconButton aria-label="Zoom out" icon={<MinusIcon />} onClick={zoomOut} />
                  <IconButton aria-label="Zoom in" icon={<AddIcon />} onClick={zoomIn} />
                </HStack>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button bg="black.100" _hover={{ bg: 'brand.100' }} rightIcon={<CheckIcon />} onClick={handleDone}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ImageAdder
